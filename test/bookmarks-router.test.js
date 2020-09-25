const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./makeTestData');

describe('bookmarks-router endpoints', () => {
    let db;
    let testUsers = helpers.makeTestUsers();
    let testBookmarks = helpers.makeTestBookmarks();
    let fullTestBookmarks = helpers.makeFullTestBookmarks();
    let testReviews = helpers.makeTestReviews();

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy(db));
    beforeEach('clean the table', () => helpers.cleanTables(db));

    beforeEach('insert users', () => {
        return db.into('users').insert(testUsers);
    });

    context('Given there are bookmarks in the database', () => {
        beforeEach('insert reviews', () => {
            return db.into('reviews').insert(testReviews);
        });

        beforeEach('insert bookmarks', () => {
            return db.into('bookmarks').insert(testBookmarks);
        });

        it(`GET /api/bookmarks responds with 200 and all of the bookmarks for that user`, () => {
            const expectedBookmarks = fullTestBookmarks.filter(
                bookmark => bookmark.user_id == testUsers[0].id
            );
            return supertest(app)
                .get('/api/bookmarks')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, expectedBookmarks);
        });
        it('DELETE /api/bookmarks/:bookmark_id responds with 204 and removes the bookmark', () => {
            const bookmark_id = 2;
            return supertest(app)
                .delete(`/api/bookmarks/${bookmark_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(204);
        });
    });

    context('Given no bookmarks in the database', () => {
        beforeEach('insert reviews', () => {
            return db.into('reviews').insert(testReviews);
        });

        describe('GET /api/bookmarks', () => {
            it('DELETE /api/bookmarks/:bookmark_id responds with 404', () => {
                const bookmark_id = 123;
                return supertest(app)
                    .delete(`/api/bookmarks/${bookmark_id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, {
                        error: { message: 'Bookmark does not exist' },
                    });
            });
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/bookmarks')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, []);
            });
        });

        it('POST /api/bookmarks responds with 201 and the new bookmark', () => {
            const newBookmark = {
                id: testReviews[0].id,
            };
            return supertest(app)
                .post('/api/bookmarks')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(newBookmark)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id');
                    expect(res.body.user_id).to.eql(testUsers[0].id);
                    expect(res.body.review_id).to.eql(newBookmark.id);
                    expect(res.headers.location).to.eql(`/api/bookmarks/${res.body.id}`);
                });
        });

        it(`responds with 400 and an error when the review_id is missing`, () => {
            return supertest(app)
                .post('/api/bookmarks')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send({})
                .expect(400, {
                    error: { message: `Missing review_id in request body` },
                });
        });
    });

    context('Given an xss attack', () => {
        const testUser = helpers.makeTestUsers()[1];
        const { maliciousBookmark, expectedBookmark, testBookmark } = helpers.makeMaliciouBookmark(
            testUser
        );

        beforeEach('insert malicious bookmark', () => {
            return db.into('reviews').insert(maliciousBookmark);
        });
        beforeEach('insert malicious bookmark', () => {
            return db.into('bookmarks').insert(testBookmark);
        });

        it(`GET /api/bookmarks removes xss content`, () => {
            return supertest(app)
                .get('/api/bookmarks')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200)
                .expect(res => {
                    expect(res.body[0].name).to.eql(expectedBookmark.name);
                    expect(res.body[0].image_alt).to.eql(expectedBookmark.image_alt);
                    expect(res.body[0].city).to.eql(expectedBookmark.city);
                    expect(res.body[0].country).to.eql(expectedBookmark.country);
                    expect(res.body[0].address).to.eql(expectedBookmark.address);
                    expect(res.body[0].comments).to.eql(expectedBookmark.comments);
                });
        });
    });
});
