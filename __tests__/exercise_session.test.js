const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');
var sub = require('date-fns/sub')

const User = require('../models/User');
const Exercise = require('../models/Exercise');
const WorkoutTemplate = require('../models/WorkoutTemplate');
const ExerciseName = require('../models/ExerciseName');
const WorkoutSession = require('../models/WorkoutSession');

// reset database for tests
beforeEach( async () => {
    await User.deleteMany({});
    await Exercise.deleteMany({});
    await ExerciseName.deleteMany({});
    await WorkoutSession.deleteMany({});
    //Add 4 exercise name for tests
    await ExerciseName.create(
        {_id: 0, exercise: "Plank"},
        {_id: 1, exercise: "Squat"},
        {_id: 2, exercise: "Benmch press"},
        {_id: 3, exercise: "Deadlift"}
    );
    
});

const exercises = [ {
    id: 3,
    name: "Deadlift",
    weight: 100,
    sets: 5,
    reps: 3
},
{
    id: 1,
    name: "squat",
    weight: 80,
    sets: 3,
    reps: 8
}
]

describe('POST', () => {

    let workout_id = null;
    let token = null;

    beforeEach( async () => {
        await WorkoutTemplate.deleteMany({});
        await WorkoutSession.deleteMany({});
        await Exercise.deleteMany({});
        //Add new workout template
        const new_w = new WorkoutTemplate({
            id: 0,
            name: "Full body",
            exercises: [0,1,3]
        });
        const saved = await new_w.save();
        workout_id = saved._id;
        
        //Log in before test
        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({username: 'test', passwordHash, workouts: [workout_id]});
        await user.save();
        let res = await api
            .post('/api/login')
            .send({username: 'test', password: 'sekret'});
        token = res.body.token;
    });

    test('can not send without exercises', async () => {
        const response = await api
            .post('/api/workout_session')
            .send({})
            .set('Authorization', `bearer ${token}`)
            .expect(400);
        
        expect(response.text).toBe('Cannot post an empty workout session')
    });

    test('exercises is a array', async () => {
        const response = await api
        .post('/api/workout_session')
        .send({exercises: 'this is not an array'})
        .set('Authorization', `bearer ${token}`)
        .expect(400);

        expect(response.text).toBe('Array not given in the request body')
    });

    test('exercises must have id', async () => {
        const response = await api
            .post('/api/workout_session')
            .send({exercises: [{ id: 1, name: 'some'}, {name: 'other'}]})
            .set('Authorization', `bearer ${token}`)
            .expect(400);
        
        expect(response.text).toBe('All of the exercises did not have id');
    });

    test('posting increases workout sessions', async () => {
        let sessions = await WorkoutSession.find({});
        expect(sessions).toHaveLength(0);

        const response = await api
            .post('/api/workout_session')
            .send({exercises: exercises})
            .set('Authorization', `bearer ${token}`)
            .expect(201);
        
        sessions = await WorkoutSession.find({});
        expect(sessions).toHaveLength(1);
    });

    test('session increases exercises', async () => {
     
        let exs = await Exercise.find({});
        expect(exs).toHaveLength(0);

        await api
            .post('/api/workout_session')
            .send({exercises: exercises})
            .set('Authorization', `bearer ${token}`)
            .expect(201);

        
        exs = await Exercise.find({});
        expect(exs).toHaveLength(2);
    });

    test('session has right exercises', async () => {
        await api
            .post('/api/workout_session')
            .send({exercises: exercises})
            .set('Authorization', `bearer ${token}`)
            .expect(201);
        
        // Only 1 session in the db
        const all_sessions = await WorkoutSession.find({}).populate('exercises');
        expect(all_sessions).toHaveLength(1);

        // Session has two exercises
        const session = all_sessions[0];
        expect(session.exercises).toHaveLength(2);

        //should have exercises with ids 3 and 1
        expect(session.exercises.map(e => e.id))
            .toEqual(
                expect.arrayContaining([3, 1])
        );
             
    });


    test('custom date for exercise can be added', async () => {
        const yesterday = sub(new Date(), { days: 1});

        await api
            .post('/api/workout_session')
            .send({exercises: exercises, date: yesterday})
            .set('Authorization', `bearer ${token}`)
            .expect(201);

        // Only 1 session in the db
        const all_sessions = await WorkoutSession.find({}).populate('exercises');
        expect(all_sessions).toHaveLength(1);

        // Session has two exercises
        const session = all_sessions[0];
        expect(session.date).toEqual(yesterday);
        
    });
})


//GET TESTS
describe('GET', () => {
    let workout_id = null;
    let token = null;

    beforeEach( async () => {
        await WorkoutTemplate.deleteMany({});
        await WorkoutSession.deleteMany({});
        await Exercise.deleteMany({});
        //Add new workout template
        const new_w = new WorkoutTemplate({
            id: 0,
            name: "Full body",
            exercises: [0,1,3]
        });
        const saved = await new_w.save();
        workout_id = saved._id;
        
        //Log in before test
        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({username: 'test', passwordHash, workouts: [workout_id]});
        await user.save();
        let res = await api
            .post('/api/login')
            .send({username: 'test', password: 'sekret'});
        token = res.body.token;
    });
    
    test('no sessions at the start', async () => {
        const sessions = await WorkoutSession.find({});
        expect(sessions).toHaveLength(0)
        
        const response = await api
            .get('/api/workout_session')
            .set('Authorization', `bearer ${token}`)
            .expect(200);

        expect(response.body).toHaveLength(0);
    });

    test('can find sessions of the user', async () => {

        const post_res = await api
            .post('/api/workout_session')
            .send({exercises: exercises})
            .set('Authorization', `bearer ${token}`)
            .expect(201)
        
        //Currently should find session
        const all_s = await WorkoutSession.find({});
        expect(all_s).toHaveLength(1);
    
        const response = await api
            .get('/api/workout_session')
            .set('Authorization', `bearer ${token}`)
            .expect(200);


        expect(response.body).toHaveLength(1);
        
    })

    test('exercises have been populated', async () => {
        await api
            .post('/api/workout_session')
            .send({exercises: exercises})
            .set('Authorization', `bearer ${token}`)
            .expect(201);

        const response = await api
            .get('/api/workout_session')
            .set('Authorization', `bearer ${token}`)
            .expect(200);

        expect(response.body).toHaveLength(1);
        
        expect(response.body[0].exercises).toHaveLength(2)
        expect(response.body[0].exercises.map(e => e.name)).toEqual(expect.arrayContaining(["Deadlift", 'squat']))
    })
})
