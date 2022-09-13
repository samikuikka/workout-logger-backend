const  mongoose  = require('mongoose');
const Exercise = require('../Exercise');

const RunExercise = Exercise.discriminator(
    'Run',
    new mongoose.Schema({
        duration: {
            type: Number
        },
        distance: {
            type: Number,
            required: true
        }
    })
);

module.exports = RunExercise;