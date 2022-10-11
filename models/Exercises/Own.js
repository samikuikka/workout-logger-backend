const  mongoose  = require('mongoose');
const Exercise = require('../Exercise');

const OwnExercise = Exercise.discriminator(
    'Own',
    new mongoose.Schema({

    })
);