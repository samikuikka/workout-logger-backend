const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

//Schema for user
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    passwordHash: String,
    email: String,
    workouts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkoutTemplate"
    }]
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
    transform: (document, object) => {
        object.id = object._id.toString();
        delete object._id;
        delete object.__v;
        delete object.passwordHash;
    }
});

//creating model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;