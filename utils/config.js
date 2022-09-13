require('dotenv').config();

//In what port is the server running
const PORT = process.env.PORT;

const DATABASE = process.env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE
    : process.env.DATABASE

module.exports = {
    PORT,
    DATABASE,
};