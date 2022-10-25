const  mongoose  = require('mongoose');
const Exercise = require('../Exercise');

// id 0
const PlankExercise = Exercise.discriminator(
    'Plank',
    new mongoose.Schema(
        {
            duration: Number,
        }
    )
);

// id 1
const SquatExercise = Exercise.discriminator(
    'Squat',
    new mongoose.Schema({
        reps: Number
    })
);


// id 5
const PullupExercise = Exercise.discriminator(
    'Pullup',
    new mongoose.Schema({
        sets: Number,
        reps: Number
    })
);

// id 8
const DipsExercise = Exercise.discriminator(
    'Dips',
    new mongoose.Schema({
        sets: Number,
        reps: Number
    })
);





module.exports = {
    PlankExercise,
    SquatExercise,
    PullupExercise,
    DipsExercise
};