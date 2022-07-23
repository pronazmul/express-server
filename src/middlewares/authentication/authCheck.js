// External Modules
const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const People = require('../../models/peopleModel')

/**
 * @desc This middleware will check bearar token validity
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const authCheck = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(' ')[1]
    let decoded = jwt.verify(token, process.env.JWT_SECRET)
    let user = await People.findOne({ _id: decoded._id }).select(
      '-password -createdAt -updatedAt'
    )
    req.user = user
    next()
  } catch (error) {
    next(createError(401, 'Unauthorized Request'))
  }
}
module.exports = authCheck
