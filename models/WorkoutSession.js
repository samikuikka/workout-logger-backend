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
    // List of exercises
    exercises: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exercise',
            required: true
        },
        name: {
            type: String,
        },
        weight: Number,
        reps: Number,
        duration: Number
    }]
})

const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);

module.exports = WorkoutSession;

