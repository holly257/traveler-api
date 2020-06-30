const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./makeTestData');

describe('activities-router endpoints', () => {
    let db;
    let testUsers = helpers.makeTestUsers();
    let testTrips = helpers.makeTestTrips();
    let testDays = helpers.makeTestDays();
    let testActivities = helpers.makeTestActivities();

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
    beforeEach('insert trips', () => {
        return db.into('trips').insert(testTrips);
    });
    beforeEach('insert days', () => {
        return db.into('days').insert(testDays);
    });

    context('Given there are activities in the database', () => {
        beforeEach('insert activities', () => {
            return db.into('activities').insert(testActivities);
        });

        it(`GET /api/activities responds with 200 and all of the activities for that day`, () => {
            return supertest(app)
                .get(`/api/activities`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, testActivities);
        });

        it('GET /api/activities/:activity_id  responds with 200 and requested activity', () => {
            const day_id = 1;
            const activity_id = 1;
            const expectedActivities = testActivities.find(activity => activity.id == activity_id);
            return supertest(app)
                .get(`/api/activities/${activity_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, expectedActivities);
        });

        it('DELETE /api/activities/:activity_id responds with 204 and removes the trip', () => {
            const id = 1;
            const day_id = 1;
            const expectedActivities = testActivities.filter(activity => activity.id !== id);
            return supertest(app)
                .delete(`/api/activities/${id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(204)
                .then(res =>
                    supertest(app)
                        .get('/api/activities')
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(expectedActivities)
                );
        });

        it('PATCH /api/activities/:activity_id responds with 204, updates trip', () => {
            const activityId = 1;
            const ActivityToUpdate = {
                activity: 'another new Trip',
                meridiem: 'am',
                start_time: 8,
                day_id: 1,
            };
            const expectedActivity = {
                ...testActivities[activityId - 1],
                activity: 'another new Trip',
                meridiem: 'am',
                start_time: 8,
                day_id: 1,
            };
            return supertest(app)
                .patch(`/api/activities/${activityId}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(ActivityToUpdate)
                .expect(201)
                .then(res =>
                    supertest(app)
                        .get(`/api/activities/${activityId}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(expectedActivity)
                );
        });
        it('PATCH /api/activities/:activity_id responds with 204 when updating a subset of fields', () => {
            const activity_id = 1;
            const ActivityToUpdate = {
                activity: 'another new Trip',
            };
            const expectedActivity = {
                ...testActivities[activity_id - 1],
                ...ActivityToUpdate,
            };
            return supertest(app)
                .patch(`/api/activities/${activity_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send({
                    ...ActivityToUpdate,
                    randomField: 'should not be in GET',
                })
                .expect(201)
                .then(res =>
                    supertest(app)
                        .get(`/api/activities/${activity_id}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(expectedActivity)
                );
        });
        it('PATCH /api/activities/:activity_id responds 400 when no required fields are given', () => {
            const activity_id = 1;
            return supertest(app)
                .patch(`/api/activities/${activity_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send({ wrongField: 'nope' })
                .expect(400, {
                    error: {
                        message: 'Request body must contain value to update',
                    },
                });
        });
    });

    context('Given no activities in the database', () => {
        it(`GET /api/activities/ responds with 200 and an empty list`, () => {
            return supertest(app)
                .get(`/api/activities/`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, []);
        });
        it('GET /api/activities/:activity_id responds with 404 for wrong day id', () => {
            const activity_id = 999;
            return supertest(app)
                .get(`/api/activities/${activity_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(404, {
                    error: { message: 'Activity does not exist' },
                });
        });
        it('DELETE /api/activities/:activity_id responds with 404', () => {
            const activity_id = 123;
            return supertest(app)
                .delete(`/api/activities/${activity_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(404, {
                    error: { message: 'Activity does not exist' },
                });
        });
        it('PATCH /api/activities/:activity_id responds with 404', () => {
            const activity_id = 123;
            return supertest(app)
                .patch(`/api/activities/${activity_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(404, {
                    error: { message: 'Activity does not exist' },
                });
        });

        it('POST /api/activities responds with 201 and the new activity', () => {
            const newActivity = {
                activity: 'another new test',
                meridiem: 'am',
                start_time: 8,
                day_id: 2,
            };
            return supertest(app)
                .post('/api/activities')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(newActivity)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id');
                    expect(res.body.activity).to.eql(newActivity.activity);
                    expect(res.body.meridiem).to.eql(newActivity.meridiem);
                    expect(res.body.start_time).to.eql(newActivity.start_time);
                    expect(res.body.day_id).to.eql(newActivity.day_id);
                    expect(res.headers.location).to.eql(`/api/activities/${res.body.id}`);
                })
                .then(postRes =>
                    supertest(app)
                        .get(`/api/activities/${postRes.body.id}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(postRes.body)
                );
        });

        const requiredFields = ['activity', 'meridiem', 'start_time', 'day_id'];
        requiredFields.forEach(field => {
            const reqNewActivity = {
                activity: 'another new test',
                meridiem: 'am',
                start_time: 8,
                day_id: 2,
            };
            it(`responds with 400 and an error when the '${field}' is missing`, () => {
                delete reqNewActivity[field];
                return supertest(app)
                    .post('/api/activities')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .send(reqNewActivity)
                    .expect(400, {
                        error: { message: `Missing ${field} in request body` },
                    });
            });
        });
    });

    context('Given an xss attack', () => {
        const testUser = helpers.makeTestUsers()[1];
        const { maliciousActivity, expectedActivity } = helpers.makeMaliciousActivity(testUser);

        beforeEach('insert malicious trip', () => {
            return db.into('activities').insert(maliciousActivity);
        });

        it(`GET /api/activities removes xss content`, () => {
            return supertest(app)
                .get('/api/activities')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200)
                .expect(res => {
                    expect(res.body[0].activity).to.eql(expectedActivity.activity);
                });
        });

        it(`GET /api/activities/:activity_id removes xss content`, () => {
            const activity_id = 1;
            return supertest(app)
                .get(`/api/activities/${activity_id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200)
                .expect(res => {
                    expect(res.body.activity).to.eql(expectedActivity.activity);
                });
        });

        it(`POST /api/activities removes xss content`, () => {
            return supertest(app)
                .post(`/api/activities`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(maliciousActivity)
                .expect(201)
                .expect(res => {
                    expect(res.body.activity).to.eql(expectedActivity.activity);
                });
        });
    });
});
