const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');


const User = require('../models/User');
const Exercise = require('../models/Exercise');
const ExerciseName = require('../models/ExerciseName');

var add = require('date-fns/add')
var sub = require('date-fns/sub')


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

describe('filtering', () => {
    let token = null;
    const current_time = new Date();
    var today = new Date(current_time.getFullYear(), current_time.getMonth(), current_time.getDate());

    // log in and save token
    beforeEach( async () => {
        //log in
        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({username: 'test', passwordHash});
        await user.save();
        let res = await api
            .post('/api/login')
            .send({username: 'test', password: 'sekret'});
        token = res.body.token;
    })

    describe('week', () => {

        beforeEach( async () => {
            await Exercise.deleteMany({})
            const obj1 = {
                id: 0,
                duration: 50,
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate()-7)
            }
            const obj2 = {
                id: 0,
                duration: 40,
                date: today
            }
            const obj3 = {
                id: 0,
                duration: 30,
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate()+7)
            }
            await api
                .post('/api/exercises')
                .send([obj1, obj2, obj3])
                .set('Authorization', `bearer ${token}`);
        });

        test('can find the exercises', async () => {
            const exercises = await Exercise.find({});
            expect(exercises).toHaveLength(3);
            
        });

        test('can filter this weeks exercises', async () => {

            const response = await api
                .get('/api/exercises?date_range=week')
                .set('Authorization', `bearer ${token}`)
                .expect(200)
            // Should found only 1 exercise from this week
            expect(response.body).toHaveLength(1)
            //Should be the correct one in the db
            expect(response.body[0].duration).toBe(40);
        });
        
    });

    describe('month', () => {
        beforeEach( async () => {
            await Exercise.deleteMany({})
            const obj1 = {
                id: 0,
                duration: 50,
                date: sub(today, { months: 1})
            }
            const obj2 = {
                id: 0,
                duration: 40,
                date: today
            }
            const obj3 = {
                id: 0,
                duration: 30,
                date: add(today, { months: 1})
            }
            await api
                .post('/api/exercises')
                .send([obj1, obj2, obj3])
                .set('Authorization', `bearer ${token}`);
        });

        test('can find the exercises', async () => {
            const exercises = await Exercise.find({});
            expect(exercises).toHaveLength(3);
        });

        test('can filter by month', async () => {

            const response = await api
                .get('/api/exercises?date_range=month')
                .set('Authorization', `bearer ${token}`)
                .expect(200)
            //Should find only 1 erxercise from this month
            expect(response.body).toHaveLength(1);
            //And it should be the one with duration 40
            expect(response.body[0].duration).toBe(40);
        });

    });

    describe('year', () => {
        beforeEach( async () => {
            await Exercise.deleteMany({})
            const obj1 = {
                id: 0,
                duration: 50,
                date: sub(today, { years: 1})
            }
            const obj2 = {
                id: 0,
                duration: 40,
                date: today
            }
            const obj3 = {
                id: 0,
                duration: 30,
                date: add(today, { years: 1})
            }
            await api
                .post('/api/exercises')
                .send([obj1, obj2, obj3])
                .set('Authorization', `bearer ${token}`);
        });

        test('can find the exercises', async () => {
            const exercises = await Exercise.find({});
            expect(exercises).toHaveLength(3);
        });

        test('can filter by year', async () => {

            const response = await api
                .get('/api/exercises?date_range=year')
                .set('Authorization', `bearer ${token}`)
                .expect(200)
            //Should find only 1 erxercise from this month
            expect(response.body).toHaveLength(1);
            //And it should be the one with duration 40
            expect(response.body[0].duration).toBe(40);
        });
    })


});