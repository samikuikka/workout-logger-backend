const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Exercise = require('../models/Exercise');
const WorkoutTemplate = require('../models/WorkoutTemplate');
const ExerciseName = require('../models/ExerciseName');


let workout_id = null;
let token = null;
// reset database for tests
beforeEach( async () => {
    await User.deleteMany({});
    await Exercise.deleteMany({});
    await WorkoutTemplate.deleteMany({});
    await ExerciseName.deleteMany({});
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
});

describe('GET', () => {

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