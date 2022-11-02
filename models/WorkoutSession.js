const mongoose = require('mongoose');

const workoutSessionSchema = new mongoose.Schema({
    // id for referencing workoutTemplate
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkoutTemplate'
    },
    // Date of the workout
    date: {
        type: Date,
        default: () => Date.now()
    },
    // Id of the user who has done the workout
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // List of exercise ids
    exercises: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise'
    }
    ]
})

const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);

module.exports = WorkoutSession;

