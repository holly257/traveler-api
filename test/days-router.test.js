const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./makeTestData')

describe('days-router endpoints', () => {
    let db
    let testUsers = helpers.makeTestUsers()
    let testTrips = helpers.makeTestTrips()
    let testDays = helpers.makeTestDays()

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
        it('POST /api/days responds with 201 and the new day', () => {
            return supertest(app)
                .post('/api/days')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send({trip_id: testTrips[0].id})
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.trip_id).to.eql(testTrips[0].id)
                    expect(res.headers.location).to.eql(`/api/days/${res.body.id}`)
                })
        })

        context('Given there are days in the database', () => {
            beforeEach('insert days', () => {
                return db.into('days').insert(testDays)
            })
            it(`GET /api/days responds with 200 and all of the days`, () => { 
                return supertest(app)
                    .get(`/api/days`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, testDays)
            })
            it('DELETE /api/days/:day_id responds with 204 and removes the day', () => {
                const id = 1
                const expectedDays = testDays.filter(day => day.id !== id)
                return supertest(app)
                    .delete(`/api/days/${id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get('/api/days')
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(expectedDays)
                    )
            })
        })
    })

    context('Given no trips in the database', () => {
        it(`GET /api/days responds with 200 and an empty list`, () => {
            return supertest(app)
                .get(`/api/days`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, [])
        })
        it('DELETE /api/days/:day_id responds with 404', () => {
            const day_id = 123
            return supertest(app)
                .delete(`/api/days/${day_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(404, {
                    error: { message: 'Day does not exist'}
                })
        })
        
        it(`responds with 400 and an error when the 'trip_id' is missing`, () => {
            const reqNewActivity = {
                day: 2
            }
            return supertest(app)
                .post('/api/days')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(reqNewActivity)
                .expect(400, {
                        error: { message: `Missing trip_id in request body`}
                    })
        })
    })
})