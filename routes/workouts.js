const workoutsRouter = require('express').Router();
const WorkoutTemplate = require('../models/WorkoutTemplate');
const { userExtractor } = require('../utils/middleware');
const User = require('../models/User');
const ExerciseName = require('../models/ExerciseName')

//Get all the workouts of the user
workoutsRouter.get('/', userExtractor, async (request, response) => {
    const user = request.user;

    //Get the user
    const obj = await User
        .findById(user._id)
        .populate('workouts')

    response.status(200).json(obj.workouts);
});

// Add new template to the users workouts
workoutsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body;
    const user = request.user;
    
    // Request should at least have  name
    if(body.name == null) {
        return response.status(400).send('name required');
    }

    //Check that no dublicate id
    const user_model = await User.findById(user._id).populate('workouts');
    let template_id = Math.ceil(Math.random() * 8000000 + 1000000);

    if("id" in body) {
        if(user_model.workouts.some(workout => workout.id == body.id) ) {
            return response.status(400).send('duplicate id');
        }
        template_id = body.id;
    }

    // Create new template to the db
    const template = new WorkoutTemplate({
        id: template_id, ...body,
    });
    const saved = await template.save();

    // Update the user workout list
    let current_user = await User.findById(user._id);
    current_user.workouts = [...current_user.workouts, saved._id];
    const res = await current_user.save();

    response.status(201).json(res.workouts);
});

//Change users workout
workoutsRouter.put('/:id',userExtractor,  async (request, response) => {
    const body = request.body;
    const user = request.user;

    // Request should at least have name
    if(body.name == null) {
        return response.status(400).send('name required');
    }

    
    // Create new template to the db
    const template = new WorkoutTemplate({
        ...body,
        id: request.params.id
    });
    const saved = await template.save();

    //Update the users workout list
    let db_user = await User.findById(user._id).populate('workouts');
    db_user.workouts = db_user.workouts.map( workout => workout.id == saved.id ? saved._id : workout._id);
    const res = await db_user.save();
    
    return response.status(201).json(res.workouts); 
});


//Post workout from the user workout list
workoutsRouter.delete('/:id', userExtractor, async (request, response) => {
    const user = request.user;

    let db_user = await User.findById(user._id).populate('workouts');
    const filtered = db_user.workouts.filter( workout => workout.id != request.params.id);
    db_user.workouts = filtered.map( workout => workout._id);
    await db_user.save();

    return response.status(204).end();
});

module.exports = workoutsRouter;