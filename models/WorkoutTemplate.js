const mongoose = require('mongoose');

const workoutTemplateSchema = new mongoose.Schema({
    // id of the workout template
    id: {
        type: Number,
        required: true
    },
    // name for the template e.g. 'Käsitreeni'
    name: {
        type: String,
        required: true
    },
    // list of ids corresponding to exercises done in the workout
    exercises: [Number]

})

const WorkoutTemplate = mongoose.model('WorkoutTemplate', workoutTemplateSchema);

module.exports = WorkoutTemplate;