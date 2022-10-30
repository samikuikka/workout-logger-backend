const exercisesRouter = require('express').Router();
const Exercise = require('../models/Exercise');
const { userExtractor } = require('../utils/middleware');
const { PlankExercise, SquatExercise, PullupExercise, DipsExercise } = require('../models/Exercises/Exercises');
const { BenchPress, Deadlift, TBarRow, SIDumbellCurl, StandingBurbellCurl,
        DumbbellLateralRaise, Presses, LegCurl        
} = require('../models/Exercises/WeightExercises');
var sanitize = require('mongo-sanitize');
const { filter } = require('../services/filterService');

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

    const exercises = await Exercise.find({user: user._id, id: id});
    response.status(200).json(exercises);
});

// Plank
exercisesRouter.post('/0/', userExtractor, async (request, response) => {
    const body = request.body;
    body.user = request.user._id;

    const exercise = new PlankExercise({
        ...body,
        id: 0,
        name: 'Plank',
    });

    const savedExercise = await exercise.save();
    response.status(201).json(savedExercise);
});

// Squat
exercisesRouter.post('/1/', userExtractor, async (request, response) => {
    const body = request.body;
    body.user = request.user._id;

    const exercise = new SquatExercise({
        ...body,
        id: 1,
        name: 'Squat',
    });
    const savedExercise = await exercise.save();
    response.status(201).json(savedExercise);
});

// Bench press
exercisesRouter.post('/2/', userExtractor, async (request, response) => {
    const body = request.body;
    body.user = request.user._id;

    const exercise = new BenchPress({
        ...body,
        id: 2,
        name: 'Bench press',
    });

    const savedExercise = await exercise.save();
    response.status(201).json(savedExercise);
})

// Deadlift
exercisesRouter.post('/3/', userExtractor, async (request, response) => {
    const body = request.body;
    body.user = request.user._id;

    const exercise = new Deadlift({
        ...body,
        id: 3,
        name: 'Deadlift',
    });

    const savedExercise = await exercise.save();
    response.status(201).json(savedExercise);
})

// T-bar row
exercisesRouter.post('/4/', userExtractor, async (request, response) => {
    const body = request.body;
    body.user = request.user._id;

    const exercise = new TBarRow({
        ...body,
        id: 4,
        name: 'T-bar row',
    });

    const savedExercise = await exercise.save();
    response.status(201).json(savedExercise);
})

// Pullups
exercisesRouter.post('/5/', userExtractor, async (request, response) => {
    const body = request.body;
    body.user = request.user._id;

    const exercise = new PullupExercise({
        ...body,
        id: 5,
        name: 'Pullup',
    });

    const savedExercise = await exercise.save();
    response.status(201).json(savedExercise);
})

// Seated incline dumbbell curl
exercisesRouter.post('/6/', userExtractor, async (request, response) => {
    const body = request.body;
    body.user = request.user._id;

    const exercise = new SIDumbellCurl({
        ...body,
        id: 6,
        name: 'Seated incline dumbbell curl',
    });

    const savedExercise = await exercise.save();
    response.status(201).json(savedExercise);
});

// Standing Burbell Curl
exercisesRouter.post('/7/', userExtractor, async (request, response) => {
    const body = request.body;
    body.user = request.user._id;

    const exercise = new StandingBurbellCurl({
        ...body,
        id: 7,
        name: 'Standing burbell curl',
    });

    const savedExercise = await exercise.save();
    response.status(201).json(savedExercise);
});

// Dips
exercisesRouter.post('/8/', userExtractor, async (request, response) => {
    const body = request.body;
    body.user = request.user._id;

    const exercise = new DipsExercise({
        ...body,
        id: 8,
        name: 'Dips',
    });

    const savedExercise = await exercise.save();
    response.status(201).json(savedExercise);
});

// Dumbbell lateral raise
exercisesRouter.post('/9/', userExtractor, async (request, response) => {
    const body = request.body;
    body.user = request.user._id;

    const exercise = new DumbbellLateralRaise({
        ...body,
        id: 9,
        name: 'Dumbbell lateral raise',
    });

    const savedExercise = await exercise.save();
    response.status(201).json(savedExercise);
});

// Presses
exercisesRouter.post('/10/', userExtractor, async (request, response) => {
    const body = request.body;
    body.user = request.user._id;

    const exercise = new Presses({
        ...body,
        id: 10,
        name: 'Presses',
    });

    const savedExercise = await exercise.save();
    response.status(201).json(savedExercise);
});

// LegCurl
exercisesRouter.post('/11/', userExtractor, async (request, response) => {
    const body = request.body;
    body.user = request.user._id;

    const exercise = new LegCurl({
        ...body,
        id: 10,
        name: 'Leg curl',
    });

    const savedExercise = await exercise.save();
    response.status(201).json(savedExercise);
});



module.exports = exercisesRouter;