const workoutsRouter = require('express').Router();
const WorkoutTemplate = require('../models/WorkoutTemplate');
const { userExtractor } = require('../utils/middleware');
const User = require('../models/User');

//Get all the workouts of the user
workoutsRouter.get('/', userExtractor, async (request, response) => {
    const user = request.user;

    //Get the user
    const obj = await User
        .findById(user._id)
        .populate('workouts');

    response.status(200).json(obj.workouts);
});



module.exports = workoutsRouter;