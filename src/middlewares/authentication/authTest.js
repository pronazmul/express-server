// External Modules:
const createError = require('http-errors')
const { decode } = require('../../utils/jwt')

const authTest = (req, res, next) => {
  try {
    const accessToken = req.signedCookies['accessToken']
    const refreshToken = req.signedCookies['refreshToken']

    if (accessToken) {
      const user = decode(accessToken)
      req.user = user?.decoded?.user
      req.session = user?.decoded?.session
      console.log({ req })
      next()
    }

    if (!accessToken && refreshToken) {
      const user = decode(accessToken)
      req.user = user?.decoded?.user
      req.session = user?.decoded?.session
      console.log({ req })
      next()
    }

    if (!accessToken && !refreshToken) {
      next(createError(401, 'no token found'))
    }
  } catch (error) {
    next('Internal Server Error!')
  }
}

// Module Export :
module.exports = { authTest }
