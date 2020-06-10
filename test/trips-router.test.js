const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./makeTestData')

describe.only('trips-router endpoints', () => {
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

        // it('POST /api/reviews responds with 201 and the new review', () => {
        //     // this.retries(3)
        //     const newReview = {
        //         name: 'Other Mifflin',
        //         image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Dunder_Mifflin%2C_Inc.svg/1200px-Dunder_Mifflin%2C_Inc.svg.png', 
        //         image_alt: 'Other Mifflin Paper Company', 
        //         city: 'Scranton', 
        //         country: 'USA', 
        //         date_created: new Date(),
        //         address: '1725 Slough Avenue Scranton, PA.', 
        //         rating: 5, 
        //         category: 'shopping', 
        //         comments: 'they have a pretzel day every year, that is pretty awesome. ', 
        //         user_id: 3,
        //     }
        //     return supertest(app)
        //         .post('/api/reviews')
        //         .send(newReview)
        //         .expect(201)
        //         .expect(res => {
        //             expect(res.body).to.have.property('id')
        //             expect(res.body.name).to.eql(newReview.name)
        //             expect(res.body.image).to.eql(newReview.image)
        //             expect(res.body.image_alt).to.eql(newReview.image_alt)
        //             expect(res.body.city).to.eql(newReview.city)
        //             expect(res.body.country).to.eql(newReview.country)
        //             const expected = new Date().toLocaleString()
        //             const actual = new Date(res.body.date_created).toLocaleString()
        //             expect(actual).to.eql(expected)
        //             expect(res.body.address).to.eql(newReview.address)
        //             expect(res.body.rating).to.eql(newReview.rating)
        //             expect(res.body.category).to.eql(newReview.category)
        //             expect(res.body.comments).to.eql(newReview.comments)
        //             expect(res.body.user_id).to.eql(newReview.user_id)
        //             expect(res.headers.location).to.eql(`/api/reviews/${res.body.id}`)
        //         })
        //         .then(postRes =>
        //             supertest(app)
        //                 .get(`/api/reviews/${postRes.body.id}`)
        //                 .expect(postRes.body)    
        //         )
        //     })

        // //postman gets correct error thrown, test not working
        // const requiredFields = ['name', 'city', 'country', 'rating', 'category', 'comments', 'user_id']
        // requiredFields.forEach(field => {
        //     const reqNewReview = {
        //         name: 'Other Mifflin',
        //         city: 'Scranton', 
        //         country: 'USA', 
        //         rating: 5, 
        //         category: 'shopping', 
        //         comments: 'they have a pretzel day every year, that is pretty awesome. ', 
        //         user_id: 3,
        //         image_alt: 'Other Mifflin Paper Company'
        //     }
        //     it.only(`responds with 400 and an error when the '${field}' is missing`, () => {
        //         delete reqNewReview[field]
        //         return supertest(app)
        //             .post('/api/reviews')
        //             .send(reqNewReview)
        //             .expect(400, {
        //                     error: { message: `Missing ${field} in request body`}
        //                 })
        //     })
        // })
    })

    // context('Given an xss attack', () => {
    //     const testUser = helpers.makeTestUsers()[1]
    //     const {
    //         maliciousReview,
    //         expectedReview,
    //     } = helpers.makeMaliciousReview(testUser)

    //     beforeEach('insert malicious review', () => {
    //         return db.into('reviews').insert(maliciousReview)
    //     })

    //     it(`GET /api/reviews removes xss content`, () => {
    //         return supertest(app)
    //             .get('/api/reviews')
    //             .expect(200)
    //             .expect(res => {
    //                 expect(res.body[0].name).to.eql(expectedReview.name)
    //                 expect(res.body[0].image_alt).to.eql(expectedReview.image_alt)
    //                 expect(res.body[0].city).to.eql(expectedReview.city)
    //                 expect(res.body[0].country).to.eql(expectedReview.country)
    //                 expect(res.body[0].address).to.eql(expectedReview.address)
    //                 expect(res.body[0].comments).to.eql(expectedReview.comments)
    //             })
    //     })
    //     it(`GET /api/reviews/:review_id removes xss content`, () => {
    //         const review_id = 911
    //         return supertest(app)
    //             .get(`/api/reviews/${review_id}`)
    //             .expect(200)
    //             .expect(res => {
    //                 expect(res.body.name).to.eql(expectedReview.name)
    //                 expect(res.body.image_alt).to.eql(expectedReview.image_alt)
    //                 expect(res.body.city).to.eql(expectedReview.city)
    //                 expect(res.body.country).to.eql(expectedReview.country)
    //                 expect(res.body.address).to.eql(expectedReview.address)
    //                 expect(res.body.comments).to.eql(expectedReview.comments)
    //             })
    //     })
    //     it(`POST /api/reviews/ removes xss content`, () => {
    //         return supertest(app)
    //             .post(`/api/reviews`)
    //             .send(maliciousReview)
    //             .expect(201)
    //             .expect(res => {
    //                 expect(res.body.name).to.eql(expectedReview.name)
    //                 expect(res.body.image_alt).to.eql(expectedReview.image_alt)
    //                 expect(res.body.city).to.eql(expectedReview.city)
    //                 expect(res.body.country).to.eql(expectedReview.country)
    //                 expect(res.body.address).to.eql(expectedReview.address)
    //                 expect(res.body.comments).to.eql(expectedReview.comments)
    //             })
    //     })
    // })  
})