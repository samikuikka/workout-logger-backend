const  mongoose  = require('mongoose');
const Exercise = require('../Exercise');


// id 2
const BenchPress = Exercise.discriminator(
    'BenchPress',
    new mongoose.Schema({
        weight: Number,
        sets: Number,
        reps: Number
    })
);

// id 3
const Deadlift = Exercise.discriminator(
    'Deadlift',
    new mongoose.Schema({
        weight: Number,
        sets: Number,
        reps: Number
    })
);

// id 4
const TBarRow = Exercise.discriminator(
    'T-barRow',
    new mongoose.Schema({
        weight: Number,
        sets: Number,
        reps: Number
    })
);

// id 6
const SIDumbellCurl = Exercise.discriminator(
    'SeatedInclineDumbbellCurl',
    new mongoose.Schema({
        weight: Number,
        sets: Number,
        reps: Number
    })
);

// id 7
const StandingBurbellCurl = Exercise.discriminator(
    'StandingBarbellCurl',
    new mongoose.Schema({
        weight: Number,
        sets: Number,
        reps: Number
    })
);

// id 9
const DumbbellLateralRaise = Exercise.discriminator(
    'DumbbellLateralRaise',
    new mongoose.Schema({
        weight: Number,
        sets: Number,
        reps: Number
    })
);

// id 10
const Presses = Exercise.discriminator(
    'Presses',
    new mongoose.Schema({
        weight: Number,
        sets: Number,
        reps: Number
    })
);

// id 11
const LegCurl =  Exercise.discriminator(
    'LegCurl',
    new mongoose.Schema({
        weight: Number,
        sets: Number,
        reps: Number
    })
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