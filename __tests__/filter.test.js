const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');

var sub = require('date-fns/sub')
var add = require('date-fns/add')

const User = require('../models/User');
const Exercise = require('../models/Exercise');
const ExerciseName = require('../models/ExerciseName');
const WorkoutSession = require('../models/WorkoutSession');
const WorkoutTemplate = require('../models/WorkoutTemplate');


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

//reset db for tests
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

describe('filters', () => {
    let workout_id = null;
    let token = null;

    beforeEach( async () => {
        await WorkoutTemplate.deleteMany({});
        await User.deleteMany({});
        await WorkoutSession.deleteMany({});
        
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

    test('does not filter without filter parameter', async () =>  {
        const date = sub(new Date(), {years: 3});
        for(let i = 0; i < 5; i++) {
            await api
                .post('/api/workout_session')
                .send({exercises: exercises, date: date})
                .set('Authorization', `bearer ${token}`)
                .expect(201);
        }
        
        const response = await api
            .get('/api/workout_session')
            .set('Authorization', `bearer ${token}`)
            .expect(200);
        
        expect(response.body.sessions).toHaveLength(5);
    });

    test('can filter by week', async () => {
        const lastweek = sub(new Date(), {days: 7});
        const now = new Date();
        const nextweek = add(new Date(), {days: 7});
        const dates = [lastweek, now, nextweek]
        for(let i = 0; i < 3; i++) {
            await api
            .post('/api/workout_session')
            .send({exercises: exercises, date: dates[i]})
            .set('Authorization', `bearer ${token}`)
            .expect(201);
        }

        const sessions = await WorkoutSession.find({});
        expect(sessions).toHaveLength(3);

        const response = await api
            .get('/api/workout_session?date_range=week')
            .set('Authorization', `bearer ${token}`)
            .expect(200);
        
        expect(response.body.sessions).toHaveLength(1);
        expect(new Date(response.body.sessions[0].date)).toEqual(now);
    });

    test('can filter by month', async () => {
        const lastmonth = sub(new Date(), {months: 1});
        const now = new Date();
        const nextmonth = add(new Date(), {months: 1});
        const dates = [lastmonth, now, nextmonth]
        for(let i = 0; i < 3; i++) {
            await api
            .post('/api/workout_session')
            .send({exercises: exercises, date: dates[i]})
            .set('Authorization', `bearer ${token}`)
            .expect(201);
        }

        const sessions = await WorkoutSession.find({});
        expect(sessions).toHaveLength(3);

        const response = await api
            .get('/api/workout_session?date_range=month')
            .set('Authorization', `bearer ${token}`)
            .expect(200);
        
        expect(response.body.sessions).toHaveLength(1);
        expect(new Date(response.body.sessions[0].date)).toEqual(now);
    });

    test('can filter by last month', async () => {
        const month_2 = sub(new Date(), {months: 2});
        const lastmonth = sub(new Date(), {months: 1});
        const now = new Date();
        const dates = [month_2, lastmonth, now]
        for(let i = 0; i < 3; i++) {
            await api
            .post('/api/workout_session')
            .send({exercises: exercises, date: dates[i]})
            .set('Authorization', `bearer ${token}`)
            .expect(201);
        }

        const sessions = await WorkoutSession.find({});
        expect(sessions).toHaveLength(3);

        const response = await api
            .get('/api/workout_session?date_range=last_month')
            .set('Authorization', `bearer ${token}`)
            .expect(200);
        
        expect(response.body.sessions).toHaveLength(1);
        expect(new Date(response.body.sessions[0].date)).toEqual(lastmonth);
    })

    test('can filter by year', async () => {
        const lastyear = sub(new Date(), {years: 7});
        const now = new Date();
        const nextyear = add(new Date(), {years: 7});
        const dates = [lastyear, now, nextyear]
        for(let i = 0; i < 3; i++) {
            await api
            .post('/api/workout_session')
            .send({exercises: exercises, date: dates[i]})
            .set('Authorization', `bearer ${token}`)
            .expect(201);
        }

        const sessions = await WorkoutSession.find({});
        expect(sessions).toHaveLength(3);

        const response = await api
            .get('/api/workout_session?date_range=year')
            .set('Authorization', `bearer ${token}`)
            .expect(200);
        
        expect(response.body.sessions).toHaveLength(1);
        expect(new Date(response.body.sessions[0].date)).toEqual(now);
    });

})