const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./makeTestData')
const bcrypt = require('bcryptjs')

describe('users-router endpoints', () => {
    let db
    let testUsers = helpers.makeTestUsers()

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy(db))
    beforeEach('clean the table', () => helpers.cleanTables(db))

    it('POST /api/users responds with 201 and creates the new user', () => {
        const newUser = {
            username: 'anotherTestUser',
            fullname: 'test user',
            password: 'country$$333AndPeople',
            email: 'test@gmail.com'
        }
        return supertest(app)
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect(res => {
                expect(res.body).to.have.property('id')
                expect(res.body.username).to.eql(newUser.username)
                expect(res.body.fullname).to.eql(newUser.fullname)
                expect(res.body.email).to.eql(newUser.email)
                expect(res.body).to.not.have.property('password')
                const expected = new Date().toLocaleString()
                const actual = new Date(res.body.date_created).toLocaleString()
                expect(actual).to.eql(expected)
                expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
            })
            .expect(res => 
                db
                    .from('users')
                    .select('*')
                    .where({ id: res.body.id })   
                    .first()
                    .then(row => {
                        expect(row.username).to.eql(newUser.username)
                        expect(row.fullname).to.eql(newUser.fullname)
                        expect(row.email).to.eql(newUser.email)

                        return bcrypt.compare(newUser.password, row.password)
                    }) 
                    .then(compareResult => {
                        expect(compareResult).to.be.true
                    })
            )
    })
    
    context('Given users in the database', () => {
        beforeEach('insert users', () => {
            helpers.seedUsers(db, testUsers)
        })
        
        it(`responds 400 when username is already taken`, () => {
            const duplicateUser = {
                username: testUsers[0].username,
                fullname: 'test user',
                password: '11AAaabb!!',
                email: 'test@gmail.com'
            }
            return supertest(app)
                    .post('/api/users')
                    .send(duplicateUser)
                    .expect(400, {
                            error: `Username already taken`
                        })
        })

        context('Given users in the database', () => {
            beforeEach('clean the table', () => helpers.cleanTables((db)))

            const requiredFields = ['username', 'fullname', 'password', 'email']
            requiredFields.forEach(field => {
                const reqNewUser = {
                    username: 'anotherTestUser',
                    fullname: 'test user',
                    password: 'countryAndPeople',
                    email: 'test@gmail.com'
                }
                it(`responds with 400 and an error when the '${field}' is missing`, () => {
                    delete reqNewUser[field]
                    return supertest(app)
                        .post('/api/users')
                        .send(reqNewUser)
                        .expect(400, {
                                error: { message: `Missing ${field} in request body`}
                            })
                })
            })

            it(`responds 400 'Password must be longer than 7 characters' when empty password`, () => {
                const userShortPass = {
                    username: 'anotherTestUser',
                    fullname: 'test user',
                    password: 'hello',
                    email: 'test@gmail.com'
                }
                return supertest(app)
                        .post('/api/users')
                        .send(userShortPass)
                        .expect(400, {
                                error: `Password must be longer than 7 characters`
                            })
            })
            it(`responds 400 'Password must be shorter than 72 characters' when empty password`, () => {
                const userLongPass = {
                    username: 'anotherTestUser',
                    fullname: 'test user',
                    password: '*'.repeat(73),
                    email: 'test@gmail.com'
                }
                return supertest(app)
                        .post('/api/users')
                        .send(userLongPass)
                        .expect(400, {
                                error: `Password must be shorter than 72 characters`
                            })
            })
            it(`responds 400 when password starts with a space`, () => {
                const userPassSpace = {
                    username: 'anotherTestUser',
                    fullname: 'test user',
                    password: ' something3#',
                    email: 'test@gmail.com'
                }
                return supertest(app)
                        .post('/api/users')
                        .send(userPassSpace)
                        .expect(400, {
                                error: `Password must not start or end with an empty space`
                            })
            })
            it(`responds 400 when password ends with a space`, () => {
                const userPassSpace = {
                    username: 'anotherTestUser',
                    fullname: 'test user',
                    password: 'something3# ',
                    email: 'test@gmail.com'
                }
                return supertest(app)
                        .post('/api/users')
                        .send(userPassSpace)
                        .expect(400, {
                                error: `Password must not start or end with an empty space`
                            })
            })
            it(`responds 400 when password isn't complex`, () => {
                const userPassNotComplex = {
                    username: 'anotherTestUser',
                    fullname: 'test user',
                    password: '11AAaabb',
                    email: 'test@gmail.com'
                }
                return supertest(app)
                        .post('/api/users')
                        .send(userPassNotComplex)
                        .expect(400, {
                                error: `Password must contain 1 upper case, lower case, number and special character`
                            })
            })
            
        })
        it(`responds 400 when email doesn't contain '@' symbol`, () => {
            const userBadEmail = {
                username: 'anotherTestUser',
                fullname: 'test user',
                password: '11AAaabb!!',
                email: 'testgmail.com'
            }
            return supertest(app)
                    .post('/api/users')
                    .send(userBadEmail)
                    .expect(400, {
                            error: `Email format is incorrect`
                        })
        })

        context('Given an xss attack', () => {
            const {
                maliciousUser,
                expectedUser,
            } = helpers.makeMaliciousUser()
        
            it(`POST /api/users removes xss content`, () => {
                return supertest(app)
                    .post(`/api/users`)
                    .send(maliciousUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body.username).to.eql(expectedUser.username)
                        expect(res.body.fullname).to.eql(expectedUser.fullname)
                        expect(res.body.email).to.eql(expectedUser.email)
                    })
            })
        })
    })  
})