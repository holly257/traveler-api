const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./makeTestData')

describe('auth endpoints', () => {
    let db
    let testUsers = helpers.makeTestUsers()
    

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
    
    
    
    describe('POST /api/auth/login', () => {
        const requiredFields = ['username', 'password']
        // const testUser = testUser[0]
        
        requiredFields.forEach(field => {
            const loginAttemptBody = {
                username: testUsers[0].username,
                password: testUsers[0].password
            }

            it(`responds 400 required error when '${field}' is missing`, () => {
                delete loginAttemptBody[field]

                return supertest(app)
                    .post('/api/auth/login')
                    .send(loginAttemptBody)
                    .expect(400, {
                        error: `Missing '${field}' in request body`
                    })
            })
            
        })

        it(`responds 400 'invalid username or password' when bad username`, () => {
            const invalidUsername = { username: 'nope', password: 'good'}
            return supertest(app)
                .post('/api/auth/login')
                .send(invalidUsername)
                .expect(400, {
                    error: 'Incorrect username or password'
                })
        })

        it(`responds 400 'invalid username or password' when bad password`, () => {
            const invalidPass = { username: testUsers[0].username, password: 'bad'}
            return supertest(app)
                .post('/api/auth/login')
                .send(invalidPass)
                .expect(400, {
                    error: 'Incorrect username or password'
                })
        })
    })
    
    
})