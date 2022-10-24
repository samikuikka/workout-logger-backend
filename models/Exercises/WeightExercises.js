const  mongoose  = require('mongoose');
const Exercise = require('../Exercise');

// Inherited exercise with extra weight, sets, reps parameters
const WeightExercise = Exercise.discriminator(
    'WeightExercise',
    new mongoose.Schema({
        weight: Number,
        sets: Number,
        reps: Number
    })
);

// id 2
const BenchPress = WeightExercise.discriminator(
    'BenchPress',
);

// id 3
const Deadlift = WeightExercise.discriminator(
    'Deadlift',
);

// id 4
const TBarRow = WeightExercise.discriminator(
    'T-barRow',
);

// id 6
const SIDumbellCurl = WeightExercise.discriminator(
    'SeatedInclineDumbbellCurl',
);

// id 7
const StandingBurbellCurl = WeightExercise.discriminator(
    'StandingBarbellCurl',
);

// id 9
const DumbbellLateralRaise = WeightExercise.discriminator(
    'DumbbellLateralRaise'
);

// id 10
const Presses = WeightExercise.discriminator(
    'Presses'
);

// id 11
const LegCurl =  WeightExercise.discriminator(
    'LegCurl'
);

module.exports = {
    BenchPress,
    Deadlift,
    TBarRow,
    SIDumbellCurl,
    StandingBurbellCurl,
    DumbbellLateralRaise,
    Presses,
    LegCurl
}