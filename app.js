const config = require('./utils/config');
const express = require('express');
const cors = require('cors');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');
const logger = require('./utils/logger');

//Routes
const userRouter = require('./routes/user');
const loginRouter = require('./routes/login');
const exercisesRouter = require('./routes/exercises');
const exercisesNameRouter = require('./routes/exercise_name');
const workoutsRouter = require('./routes/workouts');
const sessionRouter = require('./routes/workoutSession');

//Express app
const app = express();

//Connecting to mongoDB database
mongoose.connect(config.DATABASE)
    .then( () => {
        logger.info("Connected to database");
    })
    .catch( (e) => {
        logger.info("Error connecting to databse", e.message);
});

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('build'));
app.use(middleware.tokenExtractor);

//Routing
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter)
app.use('/api/exercises', exercisesRouter);
app.use('/api/exercise_names', exercisesNameRouter);
app.use('/api/workouts', workoutsRouter);
app.use('/api/workout_session', sessionRouter);

// route "/"
app.get('/', async (request, response) => {
    response.status(200).send("API for exercise manager");
});

app.get('/secret', middleware.userExtractor, async (request, response) => {
    response.status(200).send("SECRET SITE");
});

module.exports = app;