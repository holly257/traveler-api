const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./makeTestData')

describe('trips-router endpoints', () => {
    let db
    let testUsers = helpers.makeTestUsers()
    let testTrips = helpers.makeTestTrips()

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy(db))
    beforeEach('clean the table', () => helpers.cleanTables((db)))

    beforeEach('insert users', () => {
        return db.into('users').insert(testUsers)
    })

    context('Given there are trips in the database', () => {
        beforeEach('insert trips', () => {
            return db.into('trips').insert(testTrips)
        })


        it(`GET /api/trips responds with 200 and all of the reviews`, () => {
            return supertest(app)
                .get('/api/trips')
                .expect(200, testTrips)
        })
        it('GET /api/trips/:trip_id responds with 200 and requested review', () => {
            const trip_id = 1
            const expectedTrip = testTrips[trip_id - 1]
            return supertest(app)
                .get(`/api/trips/${trip_id}`)
                .expect(200, expectedTrip)
        })
           
        
    })

    
    context('Given no trips in the database', () => {
        describe('GET /api/trips', () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                .get('/api/trips')
                .expect(200, [])
            })
            it('GET /api/trips/:trip_id responds with 404', () => {
                const trip_id = 123
                return supertest(app)
                    .get(`/api/trips/${trip_id}`)
                    .expect(404, {
                        error: { message: 'Trip does not exist'}
                    })
            })
            //if I decide to do delete & patch, 404 cases will be the same as ^
        })

        it('POST /api/trips responds with 201 and the new review', () => {
            const newTrip = {
                name: 'another new Trip',
                city: 'test new city',
                country: 'country of people',
                date_created: new Date(),
                user_id: 2
            }
            return supertest(app)
                .post('/api/trips')
                .send(newTrip)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.name).to.eql(newTrip.name)
                    expect(res.body.city).to.eql(newTrip.city)
                    expect(res.body.country).to.eql(newTrip.country)
                    const expected = new Date().toLocaleString()
                    const actual = new Date(res.body.date_created).toLocaleString()
                    expect(actual).to.eql(expected)
                    expect(res.body.user_id).to.eql(newTrip.user_id)
                    expect(res.headers.location).to.eql(`/api/trips/${res.body.id}`)
                })
                .then(postRes =>
                    supertest(app)
                        .get(`/api/trips/${postRes.body.id}`)
                        .expect(postRes.body)    
                )
            })

        const requiredFields = ['name', 'city', 'country', 'user_id']
        requiredFields.forEach(field => {
            const reqNewTrip = {
                name: 'Dunder Mifflin Trip',
                city: 'Scranton', 
                country: 'USA', 
                user_id: 2,
            }
            it(`responds with 400 and an error when the '${field}' is missing`, () => {
                delete reqNewTrip[field]
                return supertest(app)
                    .post('/api/trips')
                    .send(reqNewTrip)
                    .expect(400, {
                            error: { message: `Missing ${field} in request body`}
                        })
            })
        })
    })

    context('Given an xss attack', () => {
        const testUser = helpers.makeTestUsers()[1]
        const {
            maliciousTrip,
            expectedTrip,
        } = helpers.makeMaliciousTrip(testUser)

        beforeEach('insert malicious trip', () => {
            return db.into('trips').insert(maliciousTrip)
        })

        it(`GET /api/trips removes xss content`, () => {
            return supertest(app)
                .get('/api/trips')
                .expect(200)
                .expect(res => {
                    expect(res.body[0].name).to.eql(expectedTrip.name)
                    expect(res.body[0].city).to.eql(expectedTrip.city)
                    expect(res.body[0].country).to.eql(expectedTrip.country)
                })
        })
        it(`GET /api/trips/:trip_id removes xss content`, () => {
            const trip_id = 911
            return supertest(app)
                .get(`/api/trips/${trip_id}`)
                .expect(200)
                .expect(res => {
                    expect(res.body.name).to.eql(expectedTrip.name)
                    expect(res.body.city).to.eql(expectedTrip.city)
                    expect(res.body.country).to.eql(expectedTrip.country)
                })
        })
        it(`POST /api/trips removes xss content`, () => {
            return supertest(app)
                .post(`/api/trips`)
                .send(maliciousTrip)
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(expectedTrip.name)
                    expect(res.body.city).to.eql(expectedTrip.city)
                    expect(res.body.country).to.eql(expectedTrip.country)
                })
        })
    })  
})