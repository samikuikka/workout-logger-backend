const Exercise = require('../models/Exercise')
var isThisWeek = require('date-fns/isThisWeek')

/*Filter the exercises with the given request queries.
*   Currently accepted filter parameters:
*
*       -date_range {"week", "month", "year"} : filter by the given date range
*
*/
const filter = (exercises, filters) => {
    const filteredExercises = exercises.filter( exercise => {
        let isValid = true;

        for(key in filters) {
            console.log(key, filters[key]);
            switch (key) {
                case 'date_range':
                    isValid = isValid && dateFilter(exercise, filters[key])
                default:
                    isValid = isValid;
            }
        }

       return isValid;
    })
    return filteredExercises
}

//Check if date of an exercise in the given time-frame
const dateFilter = (exercise, time) => {
    let flag = true;
    switch (time) {
        case 'week':
            console.log(exercise.date, isThisWeek(exercise.date) )
            flag = isThisWeek(exercise.date) 
        default:
            flag = flag
    }
    return flag
}

module.exports = {
    filter
}
