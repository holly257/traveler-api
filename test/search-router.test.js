const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./makeTestData')

describe('search-router endpoints', () => {
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
    beforeEach('clean the table', () => helpers.cleanTables((db)))

    beforeEach('insert users', () => {
        return db.into('users').insert(testUsers)
    })

    context('Given there are reviews in the database', () => {
        beforeEach('insert reviews', () => {
            return db.into('reviews').insert(testReviews)
        })

        it(`GET /api/search responds with 200 and all of the reviews`, () => {
            return supertest(app)
                .get('/api/search')
                .expect(200, testReviews)
        })

        it(`GET /api/search/term responds with 400 if the city name is not included`, () => {
            const newSearch = {
                other: 'term'
            }
            return supertest(app)
                .get('/api/search/term')
                .send(newSearch)
                .expect(400)
        })
        it(`GET /api/search/term responds with 400 if the city name is not included`, () => {
            const newSearch = {
                city: 'term'
            }
            return supertest(app)
                .get('/api/search/term')
                .query(newSearch)
                .expect(404, {
                    error: { message: 'City has not been reviewed yet'}
                })
        })
        it(`GET /api/search/term responds with 200 and the matched cities`, () => {
            const newSearch = {
                city: 'Scranton'
            }
            const expectedReview = testReviews.filter(review => review.city === newSearch.city)
            return supertest(app)
                .get('/api/search/term')
                .query(newSearch)
                .expect(200, expectedReview)
        })
        it(`GET /api/search/term responds with 200 and the matched cities and category`, () => {
            const newSearch = {
                city: 'Scranton',
                category: 'shopping'
            } 
            return supertest(app)
                .get('/api/search/term')
                .query(newSearch)
                .expect(200, [testReviews[0]])
        })
    })
    
    describe('Given no reviews in the database ', () => {
        it(`GET /api/search responds with 200 and an empty list`, () => {
            return supertest(app)
            .get('/api/search')
            .expect(200, [])
        })
        it(`GET /api/search/term responds with 404 an error`, () => {
            const newSearch = {
                city: 'Scranton'
            }
            return supertest(app)
            .get('/api/search/term')
            .query(newSearch)
            .expect(404, {
                error: { message: 'City has not been reviewed yet'}
            })
        })
        it(`GET /api/search/term responds with 404 and an error`, () => {
            const newSearch = {
                city: 'Scranton',
                category: 'shopping'
            } 
            return supertest(app)
                .get('/api/search/term')
                .query(newSearch)
                .expect(404, {
                    error: { message: 'City with that category has not been reviewed yet'}
                })
        })
    })  

    context('Given an xss attack', () => {
        const testUser = helpers.makeTestUsers()[1]
        const {
            maliciousSearch,
            expectedSearch
        } = helpers.makeMaliciousReview(testUser)

        beforeEach('insert malicious review', () => {
            return db.into('reviews').insert(maliciousSearch)
        })

        it(`GET /api/search removes xss content`, () => {
            return supertest(app)
                .get('/api/search')
                .expect(200)
                .expect(res => {
                    expect(res.body[0].name).to.eql(expectedSearch.name)
                    expect(res.body[0].image_alt).to.eql(expectedSearch.image_alt)
                    expect(res.body[0].city).to.eql(expectedSearch.city)
                    expect(res.body[0].country).to.eql(expectedSearch.country)
                    expect(res.body[0].address).to.eql(expectedSearch.address)
                    expect(res.body[0].comments).to.eql(expectedSearch.comments)
                })
        })
        it(`GET /api/search/term responds with 200 and the matched cities`, () => {
            const newSearch = {
                city: 'Atlanta'
            }
            return supertest(app)
                .get('/api/search/term')
                .query(newSearch)
                .expect(200, [expectedSearch])
        })
        it(`GET /api/search/term responds with 200 and the matched cities and category`, () => {
            const newSearch = {
                city: 'Atlanta',
                category: 'shopping'
            } 
            return supertest(app)
                .get('/api/search/term')
                .query(newSearch)
                .expect(200, [expectedSearch])
        })
    }) 
})