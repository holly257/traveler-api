const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./makeTestData')

describe('trips-router endpoints', () => {
    let db
    let testUsers = helpers.makeTestUsers()
    let testTrips = helpers.makeTestTrips()
    let testDays = helpers.makeTestDays()
    let testActivities = helpers.makeTestActivities()
    let getFullExpectedTrips = helpers.makeFullTestRes()

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
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

        beforeEach('insert days', () => {
            return db.into('days').insert(testDays)
        })

        beforeEach('insert activities', () => {
            return db.into('activities').insert(testActivities)
        })

        it(`GET /api/trips responds with 200 and all of the reviews for that user`, () => {
            return supertest(app)
                .get('/api/trips')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, getFullExpectedTrips)
        })

        it('DELETE /api/trips/:trip_id responds with 204 and removes the trip', () => {
            const trip_id = 1
            const expectedTrips = [getFullExpectedTrips[1]]
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

        it('PATCH /api/trips/:trip_id responds with 204, updates trip', () => {
            const trip_id = 1
            const tripToUpdate = {
                name: 'another new Trip',
                city: 'test new city',
                country: 'country of people',
            }
            const expectedTrip = {
                ...getFullExpectedTrips[trip_id - 1],
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
                        .get(`/api/trips/`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .then(res => {
                            expect(res.body[0]).to.eql(expectedTrip)
                        }) 
                )
        })

        it('PATCH /api/trips/:trip_id responds with 204 when updating a subset of fields', () => {
            const trip_id = 1
            const tripToUpdate = {
                name: 'another new Trip',
            }
            const expectedTrip = {
                ...getFullExpectedTrips[trip_id - 1],
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
                        .get(`/api/trips/`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .then(res => {
                            expect(res.body[0]).to.eql(expectedTrip)
                        })    
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
         
        it('DELETE /api/trips/:trip_id responds with 404', () => {
            const trip_id = 123
            return supertest(app)
                .delete(`/api/trips/${trip_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(404, {
                    error: { message: 'Trip does not exist'}
                })
        })
         
        it('PATCH /api/trips/:trip_id responds with 404', () => {
            const trip_id = 123
            const newTrip = {
                name: 'another new Trip',
                city: 'test new city',
                country: 'country of people',
                date_created: new Date(),
                user_id: testUsers[0].id
            }
            return supertest(app)
                .patch(`/api/trips/${trip_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(newTrip)
                .expect(404, {
                    error: { message: 'Trip does not exist'}
                })
        })

        it('POST /api/trips responds with 201 and the new review', () => {
            const newTrip = {
                name: 'another new Trip',
                city: 'test new city',
                country: 'country of people',
                date_created: new Date(),
                user_id: testUsers[0].id
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
                    expect(res.body.user_id).to.eql(newTrip.user_id)
                    expect(res.headers.location).to.eql(`/api/trips/${res.body.id}`)
                })
            })

        const requiredFields = ['name', 'city', 'country']
        requiredFields.forEach(field => {
            const reqNewTrip = {
                name: 'Dunder Mifflin Trip',
                city: 'Scranton', 
                country: 'USA', 
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

    context('Given an xss attack POST /api/trips removes xss content', () => {
        const testUser = helpers.makeTestUsers()[1]
        const {
            maliciousTrip,
            expectedTrip,
        } = helpers.makeMaliciousTrip(testUser)

        beforeEach('insert malicious trip', () => {
            return db.into('trips').insert(maliciousTrip)
        })

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