const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Exercise = require('../models/Exercise');


// reset database for tests
beforeEach( async () => {
    await User.deleteMany({});
    await Exercise.deleteMany({});
});

describe('exercise', () => {
    let token = null;

    // log in and save token
    beforeEach( async () => {
        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({username: 'test', passwordHash});
        await user.save();
        let res = await api
            .post('/api/login')
            .send({username: 'test', password: 'sekret'});
        token = res.body.token;
    })

    describe('POST', () => {

        // delete exercises before each test
        beforeEach( async () => {
            await Exercise.deleteMany({});
        })

        test('post increases count', async () => {

            const obj = {
                id: 0,
                
            }
        })

    });

    describe('GET', () => {

        test('show empty exercises when user has no exercises added', async () => {

            const response = await api
                .get('/api/exercises')
                .set('Authorization', `bearer ${token}`)
                .expect(200)
                
            expect(response.body).toEqual([]);
        });


    })
});