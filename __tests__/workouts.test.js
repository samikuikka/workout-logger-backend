const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Exercise = require('../models/Exercise');
const WorkoutTemplate = require('../models/WorkoutTemplate');
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

describe('GET', () => {

    let workout_id = null;
    let token = null;

    beforeEach( async () => {
        await WorkoutTemplate.deleteMany({});
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

    test('User should have 1 workout', async () => {
        const user = await User.findOne({username: 'test'}).populate('workouts');
        
        expect(user.workouts).toHaveLength(1);
        expect(user.workouts[0].name).toBe('Full body');
    });

    test('/api/workouts should find the users workout', async () => {

        const response = await api
            .get('/api/workouts')
            .set('Authorization', `bearer ${token}`)
            .expect(200);
        
        expect(response.body).toHaveLength(1);
        expect(response.body[0].name).toBe('Full body');
    });

})

describe('POST', () => {

    let workout_id = null;
    let token = null;

    beforeEach( async () => {
        await WorkoutTemplate.deleteMany({});
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
    })

    test('User should have 1 workout', async () => {
        const user = await User.findOne({username: 'test'}).populate('workouts');
        
        expect(user.workouts).toHaveLength(1);
        expect(user.workouts[0].name).toBe('Full body');
    });

    test('request without id or name gets rejected', async () => {
        const response = await api
            .post('/api/workouts')
            .set('Authorization', `bearer ${token}`)
            .send({id: 2})
            .expect(400);
        expect(response.text).toBe('id and name required')
    });

    test('no dublicate ids accepted', async () => {
        const response = await api
            .post('/api/workouts')
            .send({id: 0, name: 'Test'})
            .set('Authorization', `bearer ${token}`)
            .expect(400);
        expect(response.text).toBe('duplicate id')
    });

    test('can post valid template', async () => {
        const response = await api
            .post('/api/workouts')
            .send({id: 1, name: 'Leg workout', exercises: [1,2,4]})
            .set('Authorization', `bearer ${token}`)
            .expect(201);

        // now user should have two workouts
        const user = await User.findOne({username: 'test'}).populate('workouts');
        expect(user.workouts).toHaveLength(2);
        expect(response.body).toHaveLength(2);
        
        //and newly added workout should be accessible from the user
        expect(user.workouts.map(e => e.name)).toEqual(expect.arrayContaining(['Leg workout']));
        expect(user.workouts.map(e => e.exercises)).toEqual(expect.arrayContaining([[1,2,4]]))
    });

});

describe('PUT', () => {
    let workout_id = null;
    let token = null;

    beforeEach( async () => {
        await WorkoutTemplate.deleteMany({});
        //Add new workout template
        const new_w = new WorkoutTemplate({
            id: 0,
            name: "Full body",
            exercises: [0,1,3]
        });
        const new_w2 = new WorkoutTemplate({
            id: 1,
            name: "another one",
            exercises: [2,2,2]
        })
        const saved = await new_w.save();
        const saved2 = await new_w2.save();
        workout_id = saved._id;
        
        //Log in before test
        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({username: 'test', passwordHash, workouts: [workout_id, saved2._id]});
        await user.save();
        let res = await api
            .post('/api/login')
            .send({username: 'test', password: 'sekret'});
        token = res.body.token;
    });

    test('at the start, only 1 workout with exercises [0,1,3]', async () => {
        const user = await User.findOne({username: 'test'}).populate('workouts');
        expect(user.workouts).toHaveLength(2);
        expect(user.workouts.map(e => e.exercises)).toEqual(expect.arrayContaining([[2,2,2], [0,1,3]]));
    });

    test('put changes workout', async () => {
        const response = await api
            .put('/api/workouts/0')
            .send({name: 'Leg workout', exercises: [0,0,3]})
            .set('Authorization', `bearer ${token}`)
            .expect(201);
        
        
        //user workouts changed
        const user = await User.findOne({username: 'test'}).populate('workouts');
        expect(user.workouts).toHaveLength(2);
        expect(user.workouts.map(e => e.exercises)).toEqual(expect.arrayContaining([[0,0,3], [2,2,2]]));
    });
});

describe('DELETE', () => {
    let workout_id = null;
    let token = null;

    beforeEach( async () => {
        await WorkoutTemplate.deleteMany({});
        //Add new workout template
        const new_w = new WorkoutTemplate({
            id: 0,
            name: "Full body",
            exercises: [0,1,3]
        });
        const new_w2 = new WorkoutTemplate({
            id: 1,
            name: "another one",
            exercises: [2,2,2]
        })
        const saved = await new_w.save();
        const saved2 = await new_w2.save();
        workout_id = saved._id;
        
        //Log in before test
        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({username: 'test', passwordHash, workouts: [workout_id, saved2._id]});
        await user.save();
        let res = await api
            .post('/api/login')
            .send({username: 'test', password: 'sekret'});
        token = res.body.token;
    });

    test('find the exercises', async () => {
        const user = await User.findOne({username: 'test'});
        expect(user.workouts).toHaveLength(2);
    });

    test('deletion deletes the template with same id as request parameter', async () => {

        await api
            .delete('/api/workouts/0')
            .set('Authorization', `bearer ${token}`)
            .expect(204);
        
        const user = await User.findOne({username: 'test'}).populate('workouts');
        const workouts = user.workouts;
        
        expect(workouts).toHaveLength(1);
        expect(workouts[0].id).toEqual(1);
        expect(workouts[0].exercises).toEqual([2,2,2]);
    });
});