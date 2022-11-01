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

describe('POST', () => {
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

        //Delete exercises
        await Exercise.deleteMany({});
    });

    test('Non-array request body forbidden', async () => {
        const response = await api
            .post('/api/exercises')
            .send({id: 5})
            .set('Authorization', `bearer ${token}`)
            .expect(400);
        
        expect(response.text).toBe('Array not given in the request body');
    });

    test('All exercises must have id', async () => {
        const response = await api
            .post('/api/exercises')
            .send([{id: 5}, {id: 4}, {name: 5}])
            .set('Authorization', `bearer ${token}`)
            .expect(400);
        
        expect(response.text).toBe('All of the exercises did not have id');
    });

    test('POSTing one increases database by one', async () => {
        const response = await api
            .post('/api/exercises')
            .send([{id: 0, weight: 10}])
            .set('Authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/);


        expect(response.body).toHaveLength(1)
        const all = await Exercise.find({});
        expect(all).toHaveLength(1);
    });

    test('right name goes to posted exercise', async () =>  {
        const response = await api
            .post('/api/exercises')
            .send([{id: 1}])
            .set('Authorization', `bearer ${token}`)
        
        expect(response.body[0].name).toBe('Squat');
    });

    test('can post multiple exercises at the same time', async () => {
        const response = await api
            .post('/api/exercises')
            .send([{id: 0}, {id: 1}, {id: 2}])
            .set('Authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        
        expect(response.body).toHaveLength(3);
        const all = await Exercise.find({});
        expect(all).toHaveLength(3);
    });

    test('can add optional fields', async () => {
        const response = await api
            .post('/api/exercises')
            .send([ {id: 0, duration: 10 }])
            .set('Authorization', `bearer ${token}`)
            .expect(201)
        
        expect(response.body[0].duration).toBe(10);
    });

});