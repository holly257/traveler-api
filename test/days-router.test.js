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

        context('Given there are days in the database', () => {
            beforeEach('insert days', () => {
                return db.into('days').insert(testDays)
            })

            it(`GET /api/trips/:trip_id/days responds with 200 and all of the days for that id`, () => {
                    const trip_id = 1
                    const expectedDays = testDays.filter(day => day.trip_id === trip_id)
                    return supertest(app)
                        .get(`/api/trips/${trip_id}/days`)
                        .expect(200, expectedDays)
                })
        })
    })

    context('Given no trips in the database', () => {
        it(`GET /api/trips/:trip_id/days responds with 200 and an empty list`,() => {
            const trip_id = 77
            return supertest(app)
                .get(`/api/trips/${trip_id}/days`)
                .expect(200, [])
        })
    })
})