const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

//Schema for exercise names
const exerciseNameSchema = new mongoose.Schema({
    _id: Number,
    exercise: {
        type: String,
        required: true,
        unique: true
    },
});

exerciseNameSchema.plugin(uniqueValidator);

exerciseNameSchema.set('toJSON', {
    transform: (document, object) => {
        object.id = object._id;
        delete object._id;
        delete object.__v;
    }
});

const ExerciseName = mongoose.model('ExerciseName', exerciseNameSchema);

module.exports = ExerciseName;