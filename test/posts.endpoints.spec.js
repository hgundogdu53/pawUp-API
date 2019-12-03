const knex = require('knex');
const app = require('../src/app');
const {
    makePetPostArray,
    makeMaliciousPost
} = require('./pawUp.fixtures.js');
const { makeUsersArray } = require('./users.fixtures');

describe('Posts Endpoints', () => {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: "pg",
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db)
    });

    before('cleanup', () => db.raw('TRUNCATE TABLE todo RESTART IDENTITY;'));

    afterEach('cleanup', () => db.raw('TRUNCATE TABLE todo RESTART IDENTITY;'));

    after('disconnect from the database', () => db.destroy());


    describe('GET /api/posts', () => {
        context('given no posts', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/posts')
                    .expect(200, []);
            });
        });

        context('given there are posts in the database', () => {
            const testUsers = makeUsersArray();
            const testPosts = makePetPostArray();

            beforeEach('insert posts', () => {
                return db.into('posts').insert(testUsers).then(() => {
                    return db
                        .into('posts')
                        .insert(testPosts)
                });
            });

            it('responds with 200 and all of the posts', () => {
                return supertest(app)
                    .get('/api/posts')
                    .expect(200, testPosts)
            });
        });

        context(`Given an XSS attack post`, () => {
            const testUsers = makeUsersArray();
            const { maliciousPost, expectedPost } = makeMaliciousPost();

            beforeEach('insert malicious post', () => {
                return db.into('posts').insert(testUsers).then(() => {
                    return db
                        .into('posts')
                        .insert([maliciousPost])
                });
            });

            it('removes XSS attack content', () => {
                return supertest(app)
                    .get(`/api/posts`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].pet_name).to.eql(expectedPost.pet_name);
                        expect(res.body[0].type_of_pet).to.eql(expectedPost.type_of_pet);
                        expect(res.body[0].birthdate).to.eql(expectedPost.birthdate);
                        expect(res.body[0].location).to.eql(expectedPost.location);
                        expect(res.body[0].hobbies).to.eql(expectedPost.hobbies);
                    });
            });
        });
    });
});
