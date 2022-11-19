const sessionsRouter = require('express').Router();
const WorkoutSession = require('../models/WorkoutSession');
const User = require('../models/User');
const Exercise = require('../models/Exercise');
const { userExtractor } = require('../utils/middleware');
var sanitize = require('mongo-sanitize');
var add = require('date-fns/add')
var sub = require('date-fns/sub')

//Date helpers
const { startOfYear, endOfYear, endOfMonth, startOfMonth, startOfWeek, endOfWeek } = require('date-fns');

sessionsRouter.get('/', userExtractor, async (request, response) => {
    const user = request.user;
    const filters = sanitize(request.query);

    const perPage = 10;
    const page = filters['page'] > 0 ? filters['page'] : 0;

    const now = new Date();
    let maxDate = add(now, { years: 1});
    let minDate = sub(now, { years: 10});

    switch(filters["date_range"]) {
        case 'week':
            maxDate = endOfWeek(now);
            minDate = startOfWeek(now);
            break;
        case 'month':
            maxDate = endOfMonth(now);
            minDate = startOfMonth(now)
            break;
        case 'year':
            maxDate = endOfYear(now);
            minDate = startOfYear(now);
            break;
        default:         
    }

    const obj = await User
        .findById(user._id)
        .populate({
            path: 'sessions',
            match: { "date": {
                "$gte": minDate,
                "$lt": maxDate
            }},
            options: {
                limit: perPage,
                sort: { date: -1},
                skip: page * perPage
            },

            populate: {
                path: 'exercises'
            }
        });
    
    const all = await User
        .findById(user._id)
        .populate({
            path: 'sessions',
            match: { "date": {
                "$gte": minDate,
                "$lt": maxDate
            }},
        });

    const count = all.sessions.length;
    const res = {
        pages: Math.ceil(count / perPage),
        page: page,
        sessions: obj.sessions
    }
    
    response.status(200).json(res)
})

// Add new workout session to the users workout sessions
sessionsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body;
    const user = request.user;
    //console.log("body: ", request.body);
    if(user === null) {
        return response.status(400).send('user for the session is needed')
    }
    if(body.exercises == null) {
        return response.status(400).send('Cannot post an empty workout session')
    }

    // loop through exercises and create new ones
    // Check that there is an array of exercises in the body
    if(!Array.isArray(body.exercises)) {
        return response.status(400).send('Array not given in the request body');
    }
    //Check that every exercise has an id
    if(!body.exercises.every((exercise) => typeof exercise.id === "number" && exercise.id >= 0)) {
        return response.status(400).send('All of the exercises did not have id');
    }
    const exercises = await Exercise.create(body.exercises)
    const exercise_ids = exercises.map(e => e._id);

    // Create a new session
    const session = new WorkoutSession({
        ...body, user, exercises: exercise_ids
    });
    const saved = await session.save();

    // update the list of users workout sessions
    let current_user = await User.findById(user._id);
    current_user.sessions = [...current_user.sessions, saved._id];
    const res = await current_user.save();

    response.status(201).json(res.sessions);
})

module.exports = sessionsRouter;