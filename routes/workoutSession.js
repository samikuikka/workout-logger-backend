const sessionsRouter = require('express').Router();
const WorkoutSession = require('../models/WorkoutSession');
const User = require('../models/User');
const Exercise = require('../models/Exercise');
const { userExtractor } = require('../utils/middleware');

sessionsRouter.get('/', userExtractor, async (request, response) => {
    const user = request.user;

    const obj = await User
        .findById(user._id)
        .populate('sessions')

    response.status(200).json(obj.sessions)
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
        user, exercises: exercise_ids
    });
    const saved = await session.save();

    // update the list of users workout sessions
    let current_user = await User.findById(user._id);
    current_user.sessions = [...current_user.sessions, saved._id];
    const res = await current_user.save();

    response.status(201).json(res.sessions);
})

module.exports = sessionsRouter;