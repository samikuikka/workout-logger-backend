const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Exercise = require('../models/Exercise');
const { BenchPress } = require('../models/Exercises/WeightExercises');


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
                duration: 50
            }

            const response = await api
                .post('/api/exercises/0/')
                .send(obj)
                .set('Authorization', `bearer ${token}`)
                .expect(201)
                .expect('Content-Type', /application\/json/);
            
            expect(response.body.name).toEqual('Plank');
            let exercises = await Exercise.find({});
            expect(exercises).toHaveLength(1);
        });

        test('can post different type of exercises', async () => {
            const obj = {
                duration: 50,
            }

            const obj2 = {
                reps: 10
            }

            await api
                .post('/api/exercises/0/')
                .send(obj)
                .set('Authorization', `bearer ${token}`)
                .expect(201);

            await api
                .post('/api/exercises/1/')
                .send(obj2)
                .set('Authorization', `bearer ${token}`)
                .expect(201);
            
            let exercises = await Exercise.find({});
            expect(exercises).toHaveLength(2);
        });

        test('works with more then one extra parameters', async () => {
            const obj = {
                weight: 50,
                sets: 5,
                reps: 10
            }

            await api
                .post('/api/exercises/2/')
                .send(obj)
                .set('Authorization', `bearer ${token}`)
                .expect(201);

            const exercises = await Exercise.find({})
            
            expect(exercises).toHaveLength(1);
        });

        test('filter by type works', async () => {
            const obj = {
                weight: 50,
                sets: 5,
                reps: 10
            }

            const obj2 = {
                duration: 50,
            }

            await api
                .post('/api/exercises/2/')
                .send(obj)
                .set('Authorization', `bearer ${token}`)
                .expect(201);
            
            await api
                .post('/api/exercises/2/')
                .send(obj)
                .set('Authorization', `bearer ${token}`)
                .expect(201);

            await api
                .post('/api/exercises/0/')
                .send(obj)
                .set('Authorization', `bearer ${token}`)
                .expect(201);
            
            const exercises = await Exercise.find({});
            expect(exercises).toHaveLength(3);

            const presses = await BenchPress.find({});
            expect(presses).toHaveLength(2);

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

        test('show exercises when there are multiple of them', async () => {
            const obj = {
                weight: 10
            }
            await api.post('/api/exercises/2')
                .send(obj)
                .set('Authorization', `bearer ${token}`)

            await api.post('/api/exercises/3')
                .send(obj)
                .set('Authorization', `bearer ${token}`)
            
            const response = await api.get('/api/exercises')
                .set('Authorization', `bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);
            
            expect(response.body).toHaveLength(2);
        });

        test('can GET specific type of exercises', async () => {
            const obj = {
                weight: 10
            }
            await api.post('/api/exercises/2')
                .send(obj)
                .set('Authorization', `bearer ${token}`)

            await api.post('/api/exercises/3')
                .send(obj)
                .set('Authorization', `bearer ${token}`)

            const response = await api.get('/api/exercises/2')
                .set('Authorization', `bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);
            
            expect(response.body).toHaveLength(1);
            const all = await Exercise.find({})
            expect(all).toHaveLength(2);
            
        });


    })
});