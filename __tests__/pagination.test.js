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

let workout_id = null;
let token = null;

beforeAll( async () => {
    await User.deleteMany({});
    await Exercise.deleteMany({});
    await ExerciseName.deleteMany({});
    await WorkoutSession.deleteMany({});
    await WorkoutTemplate.deleteMany({});
    //Add 4 exercise name for tests
    await ExerciseName.create(
        {_id: 0, exercise: "Plank"},
        {_id: 1, exercise: "Squat"},
        {_id: 2, exercise: "Benmch press"},
        {_id: 3, exercise: "Deadlift"}
    );

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

    // Create the sessions
    for( let i = 0; i < 29; i++) {

        let exercise = [ { id: 0, name: `${i}`}]
        let date = Date.now()
        if(i % 2 == 0) {
            date = sub(Date.now(), { days: i});
        }
        await api
            .post('/api/workout_session')
            .send({exercises: exercise, date: date})
            .set('Authorization', `bearer ${token}`)
    }
});

test('can find the sessions', async () => {
    const sessions = await WorkoutSession.find({});
    expect(sessions).toHaveLength(29);
});

test('shows only 10 sessions', async () => {
    const response = await api
        .get('/api/workout_session')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
    
    expect(response.body.sessions).toHaveLength(10);
});

test('without page query parameter, shows latest 10 sessions', async () => {
    const response = await api
        .get('/api/workout_session')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
    
    expect(response.body.sessions.map(s => s.exercises[0].name)).toEqual(expect.arrayContaining(["27","25","23"]))
});

test('different pages show different sessions', async () => {
    const response = await api
        .get('/api/workout_session?page=1')
        .set('Authorization', `bearer ${token}`)
        .expect(200)

    expect(response.body.sessions.map(s => s.exercises[0].name)).toEqual(expect.arrayContaining(["7","5","3"]))
});

test('can show smaller amount than 10 if not more available', async () => {
    const response = await api
        .get('/api/workout_session?page=2')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
    
    expect(response.body.sessions).toHaveLength(9)
})

test('shows 0 if too big page', async () => {
    const response = await api
        .get('/api/workout_session?page=3')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
    
    expect(response.body.sessions).toHaveLength(0)
})


