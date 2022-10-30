const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');


const User = require('../models/User');
const Exercise = require('../models/Exercise');
var addWeeks = require('date-fns/addWeeks')
var add = require('date-fns/add')
var sub = require('date-fns/sub')


// reset database for tests
beforeEach( async () => {
    await User.deleteMany({});
    await Exercise.deleteMany({});
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
                duration: 50,
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate()-7)
            }
            const obj2 = {
                duration: 40,
                date: today
            }
            const obj3 = {
                duration: 30,
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate()+7)
            }
            await api
                .post('/api/exercises/0/')
                .send(obj1)
                .set('Authorization', `bearer ${token}`);
            await api
                .post('/api/exercises/0/')
                .send(obj2)
                .set('Authorization', `bearer ${token}`);
            await api
                .post('/api/exercises/0/')
                .send(obj3)
                .set('Authorization', `bearer ${token}`)
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
                duration: 50,
                date: sub(today, { months: 1})
            }
            const obj2 = {
                duration: 40,
                date: today
            }
            const obj3 = {
                duration: 30,
                date: add(today, { months: 1})
            }
            await api
                .post('/api/exercises/0/')
                .send(obj1)
                .set('Authorization', `bearer ${token}`);
            await api
                .post('/api/exercises/0/')
                .send(obj2)
                .set('Authorization', `bearer ${token}`);
            await api
                .post('/api/exercises/0/')
                .send(obj3)
                .set('Authorization', `bearer ${token}`)
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
                duration: 50,
                date: sub(today, { years: 1})
            }
            const obj2 = {
                duration: 40,
                date: today
            }
            const obj3 = {
                duration: 30,
                date: add(today, { years: 1})
            }
            await api
                .post('/api/exercises/0/')
                .send(obj1)
                .set('Authorization', `bearer ${token}`);
            await api
                .post('/api/exercises/0/')
                .send(obj2)
                .set('Authorization', `bearer ${token}`);
            await api
                .post('/api/exercises/0/')
                .send(obj3)
                .set('Authorization', `bearer ${token}`)
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