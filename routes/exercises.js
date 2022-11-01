const exercisesRouter = require('express').Router();
const Exercise = require('../models/Exercise');
const { userExtractor } = require('../utils/middleware');
var sanitize = require('mongo-sanitize');
const { filter } = require('../services/filterService');
const { create } = require('../services/exerciseService');

// Get all the exercises of an user
exercisesRouter.get('/', userExtractor, async (request, response) => {
    const user = request.user;

    //filters
    const filters = request.query;

    const exercises = await Exercise.find({user: user._id})
    
    const filtered = filter(exercises, filters)
    
    response.status(200).json(filtered);
});

//GET certain type of exercises of the user
exercisesRouter.get('/:id', userExtractor, async (request, response) => {
    const user = request.user;
    const id = sanitize(request.params.id);
    const filters = request.query;

    const exercises = await Exercise.find({user: user._id, id: id});
    const filtered = filter(exercises, filters)
    
    response.status(200).json(filtered);
});

exercisesRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body;
    const user = request.user._id;

    // Check that body is an array
    if(!Array.isArray(body)) {
        return response.status(400).send('Array not given in the request body');
    }

    //Check that every exercise has an id
    if(!body.every((exercise) => typeof exercise.id === "number" && exercise.id >= 0)) {
        return response.status(400).send('All of the exercises did not have id');
    }

    //Add the exercises
    const exercises = await create(body, user);

    //Send the response
    response.status(201).json(exercises);
});


module.exports = exercisesRouter;