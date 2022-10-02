// External Modules:
const createError = require('http-errors')
const People = require('../../models/peopleModel')
const Session = require('../../models/sessionModel')
const { decode } = require('../../utils/jwt')

const authCheck = async (req, res, next) => {
  try {
    const accessToken = req.cookies['accessToken']
    const refreshToken = req.cookies['refreshToken']

    if (accessToken) {
      const {
        decoded: { user, session },
      } = decode(accessToken)
      req.user = user
      req.session = session
      return next()
    }

    if (!accessToken && refreshToken) {
      const {
        decoded: { session },
      } = decode(refreshToken)

      const validSession = await Session.findOne({
        _id: session?._id,
        valid: true,
      })

      if (!validSession) return next(createError(401, 'Authentication Failed'))

      const user = await People.findById(
        session?.user,
        'name email mobile avatar roles'
      )

      req.session = validSession
      req.user = user

      let access = user.generateJwtToken({
        user: user,
        session: validSession,
      })

      let refresh = user.generateJwtToken(
        { session: validSession },
        process.env.REFRESH_TOKEN
      )

      res.cookie('accessToken', access, {
        maxAge: process.env.ACCESS_TOKEN,
        httpOnly: true,
      })

      res.cookie('refreshToken', refresh, {
        maxAge: process.env.REFRESH_TOKEN,
        httpOnly: true,
      })

      return next()
    }

    if (!accessToken && !refreshToken) {
      next(createError(401, 'Authentication Failed'))
    }
  } catch (error) {
    console.log({ error })
    next('Internal Server Error!')
  }
}

// Module Export :
module.exports = authCheck
