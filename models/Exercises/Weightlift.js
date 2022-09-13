const  mongoose  = require('mongoose');
const Exercise = require('../Exercise');

const WeightliftExercise = Exercise.discriminator(
    'Weightlift',
    new mongoose.Schema({
        weight: {
            type: Number,
            required: true
        },
        reps: {
            type: Number,
            required: true
        }
    })
);

module.exports = WeightliftExercise;