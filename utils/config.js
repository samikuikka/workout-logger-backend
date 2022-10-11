require('dotenv').config();

//In what port is the server running
const PORT = process.env.PORT || 4005;

const DATABASE = process.env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE
    : process.env.DATABASE

module.exports = {
    PORT,
    DATABASE,
};