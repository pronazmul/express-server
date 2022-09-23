// External Modules:
const createError = require('http-errors')
const jwt = require('jsonwebtoken')

const authTest = (req, res, next) => {
  try {
    const accessToken = req.signedCookies['accessToken']
    const refreshToken = req.signedCookies['refreshToken']

    //   const decoded = jwt.verify(token, process.env.JWT_SECRET)
    //   req.user = decoded

    if (accessToken || refreshToken) {
        
      
    } else {
      next(createError(401, 'no token found'))
    }
  } catch (error) {
    console.log({ errorx: error })
    next()
  }
}

// Module Export :
module.exports = { authTest }
