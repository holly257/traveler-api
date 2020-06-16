const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./makeTestData')

describe('reviews-router endpoints', () => {
    let db
    let testUsers = helpers.makeTestUsers()
    let testReviews = helpers.makeTestReviews()

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy(db))
    beforeEach('clean the table', () => helpers.cleanTablesNotUsers((db)))

    describe('Protected endpoints', () => {
        beforeEach('insert reviews', () => {
            return db.into('reviews').insert(testReviews)
        })

        const protectedGetEndpoints = [
            {
                name: 'GET /api/reviews',
                path: '/api/reviews'
            },
            {
                name: 'GET /api/reviews/:review_id',
                path: '/api/reviews/1'
            },
            {
                name: 'GET /api/trips',
                path: '/api/trips'
            },
            {
                name: 'GET /api/trips/:trip_id',
                path: '/api/trips/1'
            },
            
        ]

        protectedGetEndpoints.forEach(endpoint => {
            it(`${endpoint.name} responds with 401 'Missing bearer token' when no bearer token`, () => {
                return supertest(app)
                    .get(endpoint.path)
                    .expect(401, {
                        error: 'Missing bearer token'
                    })
            })
            it(`${endpoint.name} responds 401 'Unauthorized request' when invalid JWT secret`, () => {
                const validUser = testUsers[0]
                const invalidSecret = 'bad-secret'
                return supertest(app)
                    .get(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                    .expect(401, {
                        error: 'Unauthorized Request'
                    })
            })
            it(`${endpoint.name} responds 401 'Unauthorized request' when invalid sub in payload`, () => {
                const invalidUser = { username: 'nope', id:1 }
                return supertest(app)
                    .get(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(invalidUser))
                    .expect(401, {
                        error: 'Unauthorized Request'
                    })
            })

        })

        const protectedPostEndpoints = [
            {
                name: 'POST /api/reviews',
                path: '/api/reviews'
            },
            {
                name: 'POST /api/reviews/:review_id',
                path: '/api/reviews/1'
            },
            {
                name: 'POST /api/trips',
                path: '/api/trips'
            },
            {
                name: 'POST /api/trips/:trip_id',
                path: '/api/trips/1'
            },
            
        ]

        protectedPostEndpoints.forEach(endpoint => {
            it(`${endpoint.name} responds with 401 'Missing bearer token' when no bearer token`, () => {
                return supertest(app)
                    .post(endpoint.path)
                    .expect(401, {
                        error: 'Missing bearer token'
                    })
            })
            it(`${endpoint.name} responds 401 'Unauthorized request' when invalid JWT secret`, () => {
                const validUser = testUsers[0]
                const invalidSecret = 'bad-secret'
                return supertest(app)
                    .post(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                    .expect(401, {
                        error: 'Unauthorized Request'
                    })
            })
            it(`${endpoint.name} responds 401 'Unauthorized request' when invalid sub in payload`, () => {
                const invalidUser = { username: 'nope', id:1 }
                return supertest(app)
                    .post(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(invalidUser))
                    .expect(401, {
                        error: 'Unauthorized Request'
                    })
            })
        })

        const protectedDeleteEndpoints = [
            {
                name: 'DELETE /api/reviews/:review_id',
                path: '/api/reviews/1'
            },
            {
                name: 'DELETE /api/trips/:trip_id',
                path: '/api/trips/1'
            },
            
        ]

        protectedDeleteEndpoints.forEach(endpoint => {
            it(`${endpoint.name} responds with 401 'Missing bearer token' when no bearer token`, () => {
                return supertest(app)
                    .delete(endpoint.path)
                    .expect(401, {
                        error: 'Missing bearer token'
                    })
            })
            it(`${endpoint.name} responds 401 'Unauthorized request' when invalid JWT secret`, () => {
                const validUser = testUsers[0]
                const invalidSecret = 'bad-secret'
                return supertest(app)
                    .delete(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                    .expect(401, {
                        error: 'Unauthorized Request'
                    })
            })
            it(`${endpoint.name} responds 401 'Unauthorized request' when invalid sub in payload`, () => {
                const invalidUser = { username: 'nope', id:1 }
                return supertest(app)
                    .delete(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(invalidUser))
                    .expect(401, {
                        error: 'Unauthorized Request'
                    })
            })
        })

        const protectedPatchEndpoints = [
            {
                name: 'PATCH /api/trips/:trip_id',
                path: '/api/trips/1'
            },
            
        ]

        protectedPatchEndpoints.forEach(endpoint => {
            it(`${endpoint.name} responds with 401 'Missing bearer token' when no bearer token`, () => {
                return supertest(app)
                    .patch(endpoint.path)
                    .expect(401, {
                        error: 'Missing bearer token'
                    })
            })
            it(`${endpoint.name} responds 401 'Unauthorized request' when invalid JWT secret`, () => {
                const validUser = testUsers[0]
                const invalidSecret = 'bad-secret'
                return supertest(app)
                    .patch(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                    .expect(401, {
                        error: 'Unauthorized Request'
                    })
            })
            it(`${endpoint.name} responds 401 'Unauthorized request' when invalid sub in payload`, () => {
                const invalidUser = { username: 'nope', id:1 }
                return supertest(app)
                    .patch(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(invalidUser))
                    .expect(401, {
                        error: 'Unauthorized Request'
                    })
            })
        })
    })

})