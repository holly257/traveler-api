const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./makeTestData')

describe('activities-router endpoints', () => {
    let db
    let testUsers = helpers.makeTestUsers()
    let testTrips = helpers.makeTestTrips()
    let testDays = helpers.makeTestDays()
    let testActivities = helpers.makeTestActivities()

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
    beforeEach('insert trips', () => {
        return db.into('trips').insert(testTrips)
    })
    beforeEach('insert days', () => {
        return db.into('days').insert(testDays)
    })


    context('Given there are activities in the database', () => {
        beforeEach('insert activities', () => {
            return db.into('activities').insert(testActivities)
        })
        
        it(`GET /api/trips/:trip_id/days/:day_id/activities responds with 200 and all of the activities for that day`, () => {
            const trip_id = 1
            const day_id = 1
            const expectedActivities = testActivities.filter(activity => activity.day_id == day_id)
            return supertest(app)
                .get(`/api/trips/${trip_id}/days/${day_id}/activities`)
                .expect(200, expectedActivities)
        })
        //will give me any activity - not restricted by day_id
        //not working yet
        it('GET /api/trips/:trip_id/days/:day_id/activities/:activity_id  responds with 200 and requested activity', () => {
            const trip_id = 1
            const day_id = 1
            const activity_id= 1
            const expectedActivities = testActivities.find(activity => activity.id == activity_id)
            return supertest(app)
                .get(`/api/trips/${trip_id}/days/${day_id}/activities/${activity_id}`)
                .expect(200, expectedActivities)
        })

    //     it('DELETE /api/trips/:trip_id responds with 204 and removes the trip', () => {
    //         const trip_id = 1
    //         const expectedTrips = testTrips.filter(trip => trip.id !== trip_id)
    //         return supertest(app)
    //             .delete(`/api/trips/${trip_id}`)
    //             .expect(204)
    //             .then(res => 
    //                 supertest(app)
    //                     .get('/api/trips')
    //                     .expect(expectedTrips)
    //             )
    //     })

    //     it('PATCH /api/trips/:trip_id responds with 204, updates trip', () => {
    //         const trip_id = 1
    //         const tripToUpdate = {
    //             name: 'another new Trip',
    //             city: 'test new city',
    //             country: 'country of people',
    //         }
    //         const expectedTrip = {
    //             ...testTrips[trip_id - 1],
    //             name: 'another new Trip',
    //             city: 'test new city',
    //             country: 'country of people',
    //         }
    //         return supertest(app)
    //             .patch(`/api/trips/${trip_id}`)
    //             .send(tripToUpdate)
    //             .expect(204)
    //             .then(res =>
    //                 supertest(app)
    //                     .get(`/api/trips/${trip_id}`)
    //                     .expect(expectedTrip)    
    //             )
    //     })
    //     it('PATCH /api/trips/:trip_id responds with 204 when updating a subset of fields', () => {
    //         const trip_id = 1
    //         const tripToUpdate = {
    //             name: 'another new Trip',
    //         }
    //         const expectedTrip = {
    //             ...testTrips[trip_id - 1],
    //             ...tripToUpdate
    //         }
    //         return supertest(app)
    //             .patch(`/api/trips/${trip_id}`)
    //             .send({
    //                 ...tripToUpdate,
    //                 randomField: 'should not be in GET'
    //             })
    //             .expect(204)
    //             .then(res =>
    //                 supertest(app)
    //                     .get(`/api/trips/${trip_id}`)
    //                     .expect(expectedTrip)    
    //             )
    //     })
    //     it('PATCH /api/trips/:trip_id responds 400 when no required fields are given', () => {
    //         const trip_id = 1
    //         return supertest(app)
    //             .patch(`/api/trips/${trip_id}`)
    //             .send({ wrongField: 'nope'})
    //             .expect(400, {
    //                 error: { message: 'Request body must contain value to update'}
    //             })
    //     })
    })

    
    context('Given no activities in the database', () => {
        it(`GET /api/trips/:trip_id/days/:day_id/activities responds with 200 and an empty list`, () => {
            const trip_id = 1
            const day_id = 1
            return supertest(app)
            .get(`/api/trips/${trip_id}/days/${day_id}/activities`)
            .expect(200, [])
        })
        it('GET /api/trips/:trip_id/days/:day_id/activities/:activity_id responds with 404 for wrong day id', () => {
            const trip_id = 1
            const day_id = 1
            const activity_id = 999
            return supertest(app)
            .get(`/api/trips/${trip_id}/days/${day_id}/activities/${activity_id}`)
                .expect(404, {
                    error: { message: 'Activity does not exist'}
                })
        })
    //     it('DELETE /api/trips/:trip_id responds with 404', () => {
    //         const trip_id = 123
    //         return supertest(app)
    //             .delete(`/api/trips/${trip_id}`)
    //             .expect(404, {
    //                 error: { message: 'Trip does not exist'}
    //             })
    //     })
    //     it('PATCH /api/trips/:trip_id responds with 404', () => {
    //         const trip_id = 123
    //         return supertest(app)
    //             .patch(`/api/trips/${trip_id}`)
    //             .expect(404, {
    //                 error: { message: 'Trip does not exist'}
    //             })
    //     })

    //     it('POST /api/trips responds with 201 and the new review', () => {
    //         const newTrip = {
    //             name: 'another new Trip',
    //             city: 'test new city',
    //             country: 'country of people',
    //             date_created: new Date(),
    //             user_id: 2
    //         }
    //         return supertest(app)
    //             .post('/api/trips')
    //             .send(newTrip)
    //             .expect(201)
    //             .expect(res => {
    //                 expect(res.body).to.have.property('id')
    //                 expect(res.body.name).to.eql(newTrip.name)
    //                 expect(res.body.city).to.eql(newTrip.city)
    //                 expect(res.body.country).to.eql(newTrip.country)
    //                 const expected = new Date().toLocaleString()
    //                 const actual = new Date(res.body.date_created).toLocaleString()
    //                 expect(actual).to.eql(expected)
    //                 expect(res.body.user_id).to.eql(newTrip.user_id)
    //                 expect(res.headers.location).to.eql(`/api/trips/${res.body.id}`)
    //             })
    //             .then(postRes =>
    //                 supertest(app)
    //                     .get(`/api/trips/${postRes.body.id}`)
    //                     .expect(postRes.body)    
    //             )
    //         })

    //     const requiredFields = ['name', 'city', 'country', 'user_id']
    //     requiredFields.forEach(field => {
    //         const reqNewTrip = {
    //             name: 'Dunder Mifflin Trip',
    //             city: 'Scranton', 
    //             country: 'USA', 
    //             user_id: 2,
    //         }
    //         it(`responds with 400 and an error when the '${field}' is missing`, () => {
    //             delete reqNewTrip[field]
    //             return supertest(app)
    //                 .post('/api/trips')
    //                 .send(reqNewTrip)
    //                 .expect(400, {
    //                         error: { message: `Missing ${field} in request body`}
    //                     })
    //         })
    //     })
    })

    // context('Given an xss attack', () => {
    //     const testUser = helpers.makeTestUsers()[1]
    //     const {
    //         maliciousTrip,
    //         expectedTrip,
    //     } = helpers.makeMaliciousTrip(testUser)

    //     beforeEach('insert malicious trip', () => {
    //         return db.into('trips').insert(maliciousTrip)
    //     })

    //     it(`GET /api/trips removes xss content`, () => {
    //         return supertest(app)
    //             .get('/api/trips')
    //             .expect(200)
    //             .expect(res => {
    //                 expect(res.body[0].name).to.eql(expectedTrip.name)
    //                 expect(res.body[0].city).to.eql(expectedTrip.city)
    //                 expect(res.body[0].country).to.eql(expectedTrip.country)
    //             })
    //     })
    //     it(`GET /api/trips/:trip_id removes xss content`, () => {
    //         const trip_id = 911
    //         return supertest(app)
    //             .get(`/api/trips/${trip_id}`)
    //             .expect(200)
    //             .expect(res => {
    //                 expect(res.body.name).to.eql(expectedTrip.name)
    //                 expect(res.body.city).to.eql(expectedTrip.city)
    //                 expect(res.body.country).to.eql(expectedTrip.country)
    //             })
    //     })
    //     it(`POST /api/trips removes xss content`, () => {
    //         return supertest(app)
    //             .post(`/api/trips`)
    //             .send(maliciousTrip)
    //             .expect(201)
    //             .expect(res => {
    //                 expect(res.body.name).to.eql(expectedTrip.name)
    //                 expect(res.body.city).to.eql(expectedTrip.city)
    //                 expect(res.body.country).to.eql(expectedTrip.country)
    //             })
    //     })
    // })  
})