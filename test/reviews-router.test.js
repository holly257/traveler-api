const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./makeTestData');

describe('reviews-router endpoints', () => {
    let db;
    let testUsers = helpers.makeTestUsers();
    let testReviews = helpers.makeTestReviews();

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy(db));
    beforeEach('clean the table', () => helpers.cleanTablesNotUsers(db));

    context('Given there are reviews in the database', () => {
        beforeEach('insert reviews', () => {
            return db.into('reviews').insert(testReviews);
        });

        it(`GET /api/reviews responds with 200 and all of the reviews for that user`, () => {
            const expectedReviews = testReviews.filter(review => review.user_id == testUsers[0].id);
            return supertest(app)
                .get('/api/reviews')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, expectedReviews);
        });
        it('GET /api/reviews/:review_id responds with 200 and requested review', () => {
            const review_id = 1;
            const expectedReview = testReviews[review_id - 1];
            return supertest(app)
                .get(`/api/reviews/${review_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, expectedReview);
        });
        it('PATCH/api/reviews/:review_id responds with 204, updates trip', () => {
            const reviewId = 1;
            const editedReview = {
                name: 'hey Mifflin',
                image:
                    'https://images.unsplash.com/photo-1527239441953-caffd968d952?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
                image_alt: 'Other Paper Company',
                city: 'Texas',
                country: 'USA',
                address: '1725 Sloth Texas',
                rating: 4,
                category: 'activity',
                comments: 'they have a pretzel day every month.',
                user_id: testUsers[0].id,
            };
            const expectedReviews = {
                ...testReviews[reviewId - 1],
                name: 'hey Mifflin',
                image:
                    'https://images.unsplash.com/photo-1527239441953-caffd968d952?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
                image_alt: 'Other Paper Company',
                city: 'Texas',
                country: 'USA',
                address: '1725 Sloth Texas',
                rating: 4,
                category: 'activity',
                comments: 'they have a pretzel day every month.',
                user_id: testUsers[0].id,
            };
            return supertest(app)
                .patch(`/api/reviews/${reviewId}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(editedReview)
                .expect(201)
                .then(res =>
                    supertest(app)
                        .get(`/api/reviews/${reviewId}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(expectedReviews)
                );
        });
        it('PATCH/api/reviews/:review_id responds with 204 when updating a subset of fields', () => {
            const reviewId = 1;
            const editedReview = {
                name: 'hey Mifflin',
                image:
                    'https://images.unsplash.com/photo-1527239441953-caffd968d952?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
                image_alt: 'Other Paper Company',
            };
            const expectedReviews = {
                ...testReviews[reviewId - 1],
                name: 'hey Mifflin',
                image:
                    'https://images.unsplash.com/photo-1527239441953-caffd968d952?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
                image_alt: 'Other Paper Company',
            };
            return supertest(app)
                .patch(`/api/reviews/${reviewId}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(editedReview)
                .expect(201)
                .then(res =>
                    supertest(app)
                        .get(`/api/reviews/${reviewId}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(expectedReviews)
                );
        });
        it('PATCH /api/reviews/:review_id responds 400 when no required fields are given', () => {
            const reviewId = 1;
            return supertest(app)
                .patch(`/api/reviews/${reviewId}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send({ wrongField: 'nope' })
                .expect(400, {
                    error: {
                        message: 'Request body must contain value to update',
                    },
                });
        });
        it('DELETE /api/reviews/:review_id responds with 204 and removes the review', () => {
            const review_id = 2;
            return supertest(app)
                .delete(`/api/reviews/${review_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(204);
        });
    });

    context('Given no reviews in the database', () => {
        describe('GET /api/reviews', () => {
            it('DELETE /api/reviews/:review_id responds with 404', () => {
                const review_id = 123;
                return supertest(app)
                    .delete(`/api/reviews/${review_id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, {
                        error: { message: 'Review does not exist' },
                    });
            });
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/reviews')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, []);
            });
            it('GET /api/reviews/:review_id responds with 404', () => {
                const review_id = 123;
                return supertest(app)
                    .get(`/api/reviews/${review_id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, {
                        error: { message: 'Review does not exist' },
                    });
            });
            it('PATCH /api/reviews/:review_id responds with 404', () => {
                const review_id = 123;
                return supertest(app)
                    .patch(`/api/reviews/${review_id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, {
                        error: { message: 'Review does not exist' },
                    });
            });
        });

        it('POST /api/reviews responds with 201 and the new review', () => {
            const newReview = {
                name: 'Other Mifflin',
                image:
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Dunder_Mifflin%2C_Inc.svg/1200px-Dunder_Mifflin%2C_Inc.svg.png',
                image_alt: 'Other Mifflin Paper Company',
                city: 'Scranton',
                country: 'USA',
                date_created: new Date(),
                address: '1725 Slough Avenue Scranton, PA.',
                rating: 5,
                category: 'shopping',
                comments: 'they have a pretzel day every year, that is pretty awesome. ',
                user_id: testUsers[0].id,
            };
            return supertest(app)
                .post('/api/reviews')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(newReview)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id');
                    expect(res.body.name).to.eql(newReview.name);
                    expect(res.body.image).to.eql(newReview.image);
                    expect(res.body.image_alt).to.eql(newReview.image_alt);
                    expect(res.body.city).to.eql(newReview.city);
                    expect(res.body.country).to.eql(newReview.country);
                    const expected = new Date().toLocaleString();
                    const actual = new Date(res.body.date_created).toLocaleString();
                    expect(actual).to.eql(expected);
                    expect(res.body.address).to.eql(newReview.address);
                    expect(res.body.rating).to.eql(newReview.rating);
                    expect(res.body.category).to.eql(newReview.category);
                    expect(res.body.comments).to.eql(newReview.comments);
                    expect(res.body.user_id).to.eql(newReview.user_id);
                    expect(res.headers.location).to.eql(`/api/reviews/${res.body.id}`);
                })
                .then(postRes =>
                    supertest(app)
                        .get(`/api/reviews/${postRes.body.id}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(postRes.body)
                );
        });

        const requiredFields = [
            'name',
            'city',
            'country',
            'rating',
            'category',
            'comments',
            'image',
        ];
        requiredFields.forEach(field => {
            const reqNewReview = {
                name: 'Other Mifflin',
                city: 'Scranton',
                country: 'USA',
                rating: 5,
                category: 'shopping',
                comments: 'they have a pretzel day every year, that is pretty awesome. ',
                user_id: 1,
                image: 'Other Mifflin Paper Company',
            };
            it(`responds with 400 and an error when the '${field}' is missing`, () => {
                delete reqNewReview[field];
                return supertest(app)
                    .post('/api/reviews')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .send(reqNewReview)
                    .expect(400, {
                        error: { message: `Missing ${field} in request body` },
                    });
            });
        });
    });

    context('Given an xss attack', () => {
        const testUser = helpers.makeTestUsers()[1];
        const { maliciousReview, expectedReview } = helpers.makeMaliciousReview(testUser);

        beforeEach('insert malicious review', () => {
            return db.into('reviews').insert(maliciousReview);
        });

        it(`GET /api/reviews removes xss content`, () => {
            return supertest(app)
                .get('/api/reviews')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200)
                .expect(res => {
                    expect(res.body[0].name).to.eql(expectedReview.name);
                    expect(res.body[0].image_alt).to.eql(expectedReview.image_alt);
                    expect(res.body[0].city).to.eql(expectedReview.city);
                    expect(res.body[0].country).to.eql(expectedReview.country);
                    expect(res.body[0].address).to.eql(expectedReview.address);
                    expect(res.body[0].comments).to.eql(expectedReview.comments);
                });
        });
        it(`GET /api/reviews/:review_id removes xss content`, () => {
            const review_id = 911;
            return supertest(app)
                .get(`/api/reviews/${review_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200)
                .expect(res => {
                    expect(res.body.name).to.eql(expectedReview.name);
                    expect(res.body.image_alt).to.eql(expectedReview.image_alt);
                    expect(res.body.city).to.eql(expectedReview.city);
                    expect(res.body.country).to.eql(expectedReview.country);
                    expect(res.body.address).to.eql(expectedReview.address);
                    expect(res.body.comments).to.eql(expectedReview.comments);
                });
        });
        it(`POST /api/reviews removes xss content`, () => {
            return supertest(app)
                .post(`/api/reviews`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(maliciousReview)
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(expectedReview.name);
                    expect(res.body.image_alt).to.eql(expectedReview.image_alt);
                    expect(res.body.city).to.eql(expectedReview.city);
                    expect(res.body.country).to.eql(expectedReview.country);
                    expect(res.body.address).to.eql(expectedReview.address);
                    expect(res.body.comments).to.eql(expectedReview.comments);
                });
        });
    });
});
