const exercisesNameRouter = require('express').Router();
const { max } = require('date-fns');
const ExerciseName = require('../models/ExerciseName');

// Get the name and id of the exercises
exercisesNameRouter.get('/', async (request, response) => {
    const names = await ExerciseName.find({});
    response.status(200).json(names);
});

// Post new exercise name and set id to it
exercisesNameRouter.post('/', async (request, response) => {
    const body = request.body;

    //Highest id number in the db
    const max_id = await ExerciseName.findOne().sort('-_id');

    //Increment by 1
    const id = max_id ? max_id._id + 1 : 0;

    const exerciseName = new ExerciseName({
        _id: id,
        exercise: body.exercise
    });

    const savedName = await exerciseName.save();
    response.status(201).json(savedName);
});

module.exports = exercisesNameRouter;