const loginRouter = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var sanitize = require('mongo-sanitize');

// post to '/api/login' to log in user
loginRouter.post('/', async (request, response) => {
    const body = sanitize(request.body);

    //Find the user
    const user = await User.findOne({ username: body.username });

    // Boolean value indicating that user exists and password matches
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)

    //If password does not match, deny login
    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        });
    }

    //For token creation
    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET);

    response
        .status(200)
        .send({token, username: user.username, id: user.id});
});

module.exports = loginRouter;