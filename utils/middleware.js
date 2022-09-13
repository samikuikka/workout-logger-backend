const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * 
 * @param {Express.Request} request 
 * @param {Express.Response} response 
 * @param {Express.next} next 
 * @returns {void}
 * helper function for extracting the user token from the request header
 */
const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      request.token =  authorization.substring(7);
    }
    next();
};


/**
 * 
 * @param {Express.Request} request 
 * @param {Express.Response} response 
 * @param {Express.next} next 
 * @returns {void}
 * middleware for routes where login needed, if no valid token in authorization header, then show error
 */
const userExtractor = async (request, response, next) => {
  if(!request.token) {
      return response.status(401).json({error: 'no token'});
  }

  
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token id not found' });
    }
    const user = await User.findById(decodedToken.id);
    request.user = user;
    next();
  } catch (err) {
    return response.status(401).json({ error: 'token invalid'})
  }
}

module.exports = { 
    tokenExtractor,
    userExtractor
}