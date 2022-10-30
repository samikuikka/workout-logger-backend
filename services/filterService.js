const Exercise = require('../models/Exercise');
var isThisWeek = require('date-fns/isThisWeek');
var isThisMonth = require('date-fns/isThisMonth')
var isThisYear = require('date-fns/isThisYear')

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
            //console.log(key, filters[key]);
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
            flag = isThisWeek(exercise.date);
            break;
        case 'month':
            flag = isThisMonth(exercise.date);
            break;
        case 'year':
            flag = isThisYear(exercise.date);
            break;
        default:
            flag = flag
    }
    return flag
}

module.exports = {
    filter
}
