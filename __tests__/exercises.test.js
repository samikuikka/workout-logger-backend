const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Exercise = require('../models/Exercise');
const Weightlift = require('../models/Exercises/Weightlift');
const Run = require('../models/Exercises/Run');

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

        test('can post exercise type weightlifting', async () => {

            // At start there are no exercises in the db
            let exercises = await Exercise.find({});
            expect(exercises).toHaveLength(0);
            
            const exercise = {
                weight: 50,
                reps: 10
            }
            
            const response = await api
                .post('/api/exercises/weightlift')
                .send(exercise)
                .set('Authorization', `bearer ${token}`)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            // Check that POST send back the exercise that was added
            expect(response.body.name).toEqual('Weightlift');
            
            // After POST exercises have 1 exercise in db
            exercises = await Exercise.find({});
            expect(exercises).toHaveLength(1); 
        });

        test('can post run (or other)', async () => {
            let exercises = await Exercise.find({});
            expect(exercises).toHaveLength(0);
            const exercise = {
                duration: 60,
                distance: 12
            }

            const response = await api
                .post('/api/exercises/run')
                .send(exercise)
                .set('Authorization', `bearer ${token}`)
                .expect(201)
                .expect('Content-Type', /application\/json/);
            
            expect(response.body.name).toEqual('Run');
                
            // After POST exercises have 1 exercise in db
            exercises = await Exercise.find({});
            expect(exercises).toHaveLength(1); 
        });

        test('can send many types and all of them saves to db', async () => {
            let exercises = await Exercise.find({});
            expect(exercises).toHaveLength(0);


            await api
                .post('/api/exercises/weightlift')
                .send({weight: 10, reps: 100})
                .set('Authorization', `bearer ${token}`)
                .expect(201);
            
            await api
                .post('/api/exercises/run')
                .send({distance: 5, duration: 30})
                .set('Authorization', `bearer ${token}`)
                .expect(201);

            exercises = await Exercise.find({});
            expect(exercises).toHaveLength(2);
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

        test('shows user exercises when user has any', async () => {
            
            const user = await User.find({name: 'test'});
            const userID = user[0]._id;
            
            const ex1 = new Weightlift({name: 'Weightlift', user: userID, weight: 50, reps: 10});
            const ex2 = new Run({name: 'Run', user: userID, distance: 10, duration: 30});
            await ex1.save();
            await ex2.save();

            const exercises = await Exercise.find({});
            expect(exercises).toHaveLength(2);

            const response = await api
                .get('/api/exercises')
                .set('Authorization', `bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);

            expect(response.body).toHaveLength(2);   
        });

        test('"/weightlift" shows user owns type weightlift exercises', async () => {
            const users = await User.find({name: 'test'});
            const userID = users[0]._id;

            const ex1 = new Weightlift({name: 'Weightlift', user: userID, weight: 50, reps: 10});
            const ex2 = new Weightlift({name: 'Weightlift', user: userID, weight: 100, reps: 5});

            await ex1.save();
            await ex2.save();

            const exercises = await Weightlift.find({});
            expect(exercises).toHaveLength(2);

            const response = await api
                .get('/api/exercises/weightlift')
                .set('Authorization', `bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);
            
            expect(response.body.map(x => x.weight)).toEqual(expect.arrayContaining([50, 100]));
        });

        test('individual exercise route (e.g. "/run") show only the own type resources to the user', async () => {
            const user = await User.find({name: 'test'});
            const userID = user[0]._id;
            
            const ex1 = new Weightlift({name: 'Weightlift', user: userID, weight: 50, reps: 10});
            const ex2 = new Run({name: 'Run', user: userID, distance: 10, duration: 30});
            await ex1.save();
            await ex2.save();

            const exercises = await Exercise.find({});
            expect(exercises).toHaveLength(2);

            const response = await api
                .get('/api/exercises/run')
                .set('Authorization', `bearer ${token}`)
                .expect(200);
              
            expect(response.body).toHaveLength(1);
        });

    })
});