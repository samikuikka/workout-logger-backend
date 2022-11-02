const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    //extras
    weight: Number,
    weightType: {
        type: String,
        enum: ['kg', 'lb']
    },
    sets: Number,
    reps: Number,
    duration: Number,

});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;