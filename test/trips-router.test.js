const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./makeTestData')


//all the ones failing are /:trip_id
//need to figure out format on what I am expecting
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

    // beforeEach('insert users', () => {
    //     helpers.seedUsers(db, testUsers)
    //     // return db.into('users').insert(testUsers)
    // })

    context('Given there are trips in the database', () => {
        beforeEach('insert trips', () => {
            return db.into('trips').insert(testTrips)
        })

        it.only(`GET /api/trips responds with 200 and all of the reviews for that user`, () => {
            const expectedTrips = testTrips.filter(trip => trip.user_id == testUsers[0].id)
            return supertest(app)
                .get('/api/trips')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, expectedTrips)
                .expect(res => {
                    expect(res.body[0].user_id).to.eql(testUsers[0].id)
                })
        })

        //need to to test returning the whole trips array
        //FAILING - expected is diff than response gotten
        it('GET /api/trips/:trip_id responds with 200 and requested review', () => {
            const trip_id = 1
            const expectedTrip = testTrips[trip_id - 1]
            return supertest(app)
                .get(`/api/trips/${trip_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, expectedTrip)
        })

        it('DELETE /api/trips/:trip_id responds with 204 and removes the trip', () => {
            const trip_id = 1
            const expectedTrips = testTrips.filter(trip => trip.id !== trip_id)
            return supertest(app)
                .delete(`/api/trips/${trip_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(204)
                .then(res => 
                    supertest(app)
                        .get('/api/trips')
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(expectedTrips)
                )
        })

        //not sure what a patch is going to look like
        //FAILING - expected is diff than response gotten
        it('PATCH /api/trips/:trip_id responds with 204, updates trip', () => {
            const trip_id = 1
            const tripToUpdate = {
                name: 'another new Trip',
                city: 'test new city',
                country: 'country of people',
            }
            const expectedTrip = {
                ...testTrips[trip_id - 1],
                name: 'another new Trip',
                city: 'test new city',
                country: 'country of people',
            }
            return supertest(app)
                .patch(`/api/trips/${trip_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(tripToUpdate)
                .expect(204)
                .then(res =>
                    supertest(app)
                        .get(`/api/trips/${trip_id}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(expectedTrip)    
                )
        })

        //FAILING - expected is diff than response gotten
        it('PATCH /api/trips/:trip_id responds with 204 when updating a subset of fields', () => {
            const trip_id = 1
            const tripToUpdate = {
                name: 'another new Trip',
            }
            const expectedTrip = {
                ...testTrips[trip_id - 1],
                ...tripToUpdate
            }
            return supertest(app)
                .patch(`/api/trips/${trip_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send({
                    ...tripToUpdate,
                    randomField: 'should not be in GET'
                })
                .expect(204)
                .then(res =>
                    supertest(app)
                        .get(`/api/trips/${trip_id}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(expectedTrip)    
                )
        })
        it('PATCH /api/trips/:trip_id responds 400 when no required fields are given', () => {
            const trip_id = 1
            return supertest(app)
                .patch(`/api/trips/${trip_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send({ wrongField: 'nope'})
                .expect(400, {
                    error: { message: 'Request body must contain value to update'}
                })
        })
    })

    
    context('Given no trips in the database', () => {
        it(`GET /api/trips responds with 200 and an empty list`, () => {
            return supertest(app)
            .get('/api/trips')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(200, [])
        })

        //failing - for 200 OK
        it('GET /api/trips/:trip_id responds with 404', () => {
            const trip_id = 123
            return supertest(app)
                .get(`/api/trips/${trip_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(404, {
                    error: { message: 'Trip does not exist'}
                })
        })
         //failing - for 204 no content
        it('DELETE /api/trips/:trip_id responds with 404', () => {
            const trip_id = 123
            return supertest(app)
                .delete(`/api/trips/${trip_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(404, {
                    error: { message: 'Trip does not exist'}
                })
        })
         //failing - for 400 bad request - not  making it to patch
        it('PATCH /api/trips/:trip_id responds with 404', () => {
            const trip_id = 123
            return supertest(app)
                .patch(`/api/trips/${trip_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(404, {
                    error: { message: 'Trip does not exist'}
                })
        })
         //failing -  expected is diff than response gotten
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
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
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
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
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
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
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
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200)
                .expect(res => {
                    expect(res.body[0].name).to.eql(expectedTrip.name)
                    expect(res.body[0].city).to.eql(expectedTrip.city)
                    expect(res.body[0].country).to.eql(expectedTrip.country)
                })
        })
        //FAILING - expected undefined to equal 'bad image'
        it(`GET /api/trips/:trip_id removes xss content`, () => {
            const trip_id = 911
            return supertest(app)
                .get(`/api/trips/${trip_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
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
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
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