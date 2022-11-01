const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Exercise = require('../models/Exercise');
const ExerciseName = require('../models/ExerciseName');


// reset database for tests
beforeEach( async () => {
    await User.deleteMany({});
    await Exercise.deleteMany({});
    await ExerciseName.deleteMany({});
    //Add 4 exercise name for tests
    await ExerciseName.create(
        {_id: 0, exercise: "Plank"},
        {_id: 1, exercise: "Squat"},
        {_id: 2, exercise: "Benmch press"},
        {_id: 3, exercise: "Deadlift"}
    );
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

    describe('GET', () => {

        test('show empty exercises when user has no exercises added', async () => {

            const response = await api
                .get('/api/exercises')
                .set('Authorization', `bearer ${token}`)
                .expect(200)
                
            expect(response.body).toEqual([]);
        });

        test('show exercises when there are multiple of them', async () => {

            await api
                .post('/api/exercises')
                .send([{id: 1}, {id: 2}])
                .set('Authorization', `bearer ${token}`)
                .expect(201);
            
            const response = await api.get('/api/exercises')
                .set('Authorization', `bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);
            
            expect(response.body).toHaveLength(2);
        });

        test('can GET specific type of exercises', async () => {
            
            await api
                .post('/api/exercises')
                .send([{id: 1}, {id: 2}])
                .set('Authorization', `bearer ${token}`)
                .expect(201);

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