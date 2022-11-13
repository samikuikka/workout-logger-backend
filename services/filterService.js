var isThisWeek = require('date-fns/isThisWeek');
var isThisMonth = require('date-fns/isThisMonth')
var isThisYear = require('date-fns/isThisYear')

/*Filter the exercises with the given request queries.
*   Currently accepted filter parameters:
*
*       -date_range {"week", "month", "year"} : filter by the given date range
*
*/
const filter = (sessions, filters) => {
    const filteredSessions = sessions.filter( session => {
        let isValid = true;

        for(key in filters) {
            //console.log(key, filters[key]);
            switch (key) {
                case 'date_range':
                    isValid = isValid && dateFilter(session, filters[key])
                default:
                    isValid = isValid;
            }
        }

       return isValid;
    })
    return filteredSessions
}

//Check if date of an session in the given time-frame
const dateFilter = (session, time) => {
    let flag = true;
    switch (time) {
        case 'week':
            flag = isThisWeek(session.date);
            break;
        case 'month':
            flag = isThisMonth(session.date);
            break;
        case 'year':
            flag = isThisYear(session.date);
            break;
        default:
            flag = flag
    }
    return flag
}

module.exports = {
    filter
}
