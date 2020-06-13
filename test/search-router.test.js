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

    })
    

    describe('Given no reviews in the database GET /api/search', () => {
        it(`responds with 200 and an empty list`, () => {
            return supertest(app)
            .get('/api/search')
            .expect(200, [])
        })
    })  
   


    context('Given an xss attack', () => {
        const testUser = helpers.makeTestUsers()[1]
        const {
            maliciousReview,
            expectedReview,
        } = helpers.makeMaliciousReview(testUser)

        beforeEach('insert malicious review', () => {
            return db.into('reviews').insert(maliciousReview)
        })

        it(`GET /api/search removes xss content`, () => {
            return supertest(app)
                .get('/api/search')
                .expect(200)
                .expect(res => {
                    expect(res.body[0].name).to.eql(expectedReview.name)
                    expect(res.body[0].image_alt).to.eql(expectedReview.image_alt)
                    expect(res.body[0].city).to.eql(expectedReview.city)
                    expect(res.body[0].country).to.eql(expectedReview.country)
                    expect(res.body[0].address).to.eql(expectedReview.address)
                    expect(res.body[0].comments).to.eql(expectedReview.comments)
                })
        })
       
    })  
})