const exercisesRouter = require('express').Router();
const Exercise = require('../models/Exercise');
const { userExtractor } = require('../utils/middleware');
const { choose } = require('../services/exerciseService')

// Get all the exercises of an user
exercisesRouter.get('/', userExtractor, async (request, response) => {
    const user = request.user;
    const exercises = await Exercise.find({user: user._id})
    response.status(200).json(exercises);
});

exercisesRouter.post('/0/', userExtractor, async (request, response) => {
    const body = request.body;
    
    const exercise = choose(id, body);
});

module.exports = exercisesRouter;