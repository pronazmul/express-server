// Required Module
const jwt = require('jsonwebtoken')

/**
 * @desc Function takes 3 things to create a JWT Token, first one is user objct, second one is secret key, third one is expiration time
 * @AcceptedParams user object
 * @returns token
 */

const jwtTokenGenerator = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  })
}

// Export Module
module.exports = { jwtTokenGenerator }
