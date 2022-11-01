const Exercise = require('../models/Exercise');
const ExerciseName = require('../models/ExerciseName');

//Create the exercises
const create = async (exercises, user) => {
    let response = [];

    for ( let exercise of exercises) {
        //add user to exercise
        exercise.user = user;
        //add name to exercise
        const exercise_name = await ExerciseName.findById(exercise.id);

        //If we found predefined exercise:
        if(exercise_name) {
            exercise.name = exercise_name.exercise;

            const obj = new Exercise({...exercise});
            const saved = await obj.save();
            response.push(saved);
        }

        // TODO else for users own exercises
    }
    
    //Seend the list
    return response;
}


module.exports = {
    create
}