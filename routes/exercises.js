const exercisesRouter = require('express').Router();
const Exercise = require('../models/Exercise');
const Run = require('../models/Exercises/Run');
const Weightlift = require('../models/Exercises/Weightlift');
const { userExtractor } = require('../utils/middleware');

// Get all the exercises of an user
exercisesRouter.get('/', userExtractor, async (request, response) => {
    const user = request.user;
    const exercises = await Exercise.find({user: user._id})
    response.status(200).json(exercises);
})

// Send weightlift
exercisesRouter.post('/weightlift', userExtractor, async (request, response) => {
    const user = request.user;
    const body = request.body;

    const exercise = new Weightlift({
        name: 'Weightlift',
        user: user._id,
        weight: body.weight,
        reps: body.reps
    });
    
    const savedExercise = await exercise.save();
    response.status(201).json(savedExercise);
});

exercisesRouter.post('/run', userExtractor, async (request, response) => {
    const user = request.user;
    const body = request.body;

    const exercise = new Run({
        name: 'Run',
        user: user._id,
        duration: body.duration,
        distance: body.distance
    });

    const savedRun = await exercise.save();
    response.status(201).json(savedRun);
});

module.exports = exercisesRouter;