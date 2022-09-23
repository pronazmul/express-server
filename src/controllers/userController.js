// External Modules:
const createError = require('http-errors')

// Internal Modules:
const People = require('../models/peopleModel')
const Session = require('../models/sessionModel')
const { unlinkSingleImage, emptyDirectory } = require('../utils/files')
const { regxSearchQuery } = require('../utils/mongoose')

/**
 * @description Create New User.
 * @Route [POST]- /api/users
 * @Access Public
 * @returns {Object} - Created User.
 */

const createUser = async (req, res, next) => {
  try {
    let newUser = new People(req.body)
    let user = await newUser.save()
    let userData = {
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      mobile: user?.mobile,
      roles: user?.roles,
      avatar: user?.avatar,
    }
    let token = user.generateJwtToken(userData)
    res.status(200).json({ status: 'success', data: { ...userData, token } })
  } catch (error) {
    if (error?._message) {
      let message = error?.message?.split(':').pop()
      next(createError(422, message))
    } else {
      next(createError(500, error))
    }
  }
}

/**
 * @description Authenticate User (email, pass)
 * @Route [POST]- /api/users/auth
 * @Access Public
 * @returns {Object} - Logged in User.
 */

const userLogin = async (req, res, next) => {
  try {
    let { email, password } = req.body
    let user = await People.findOne({ email })
    let isMatch = await user.checkPassword(password)

    if (user && isMatch) {
      let session = await Session.create({
        user: user?._id,
        userAgent: req.headers['user-agent'],
      })

      let userData = {
        _id: user._id,
        name: user?.name,
        email: user?.email,
        roles: user?.roles,
        avatar: user?.avatar,
      }
      let accessToken = user.generateJwtToken({ user: userData, session })

      let refreshToken = user.generateJwtToken(
        { session },
        process.env.REFRESH_TOKEN
      )

      res.cookie('accessToken', accessToken, {
        maxAge: process.env.ACCESS_TOKEN,
        httpOnly: true,
        signed: true,
      })

      res.cookie('refreshToken', refreshToken, {
        maxAge: process.env.REFRESH_TOKEN,
        httpOnly: true,
        signed: true,
      })

      res
        .status(200)
        .json({ status: 'success', data: { ...userData, token: accessToken } })
    } else {
      next(createError(401, 'Authentication Failed!'))
    }
  } catch (error) {
    console.log({ errors: error })
    next(createError(500, 'Internal Server Error!'))
  }
}

/**
 * @description Retrive Single User Info By UserID
 * @Route [GET]- /api/users/:userID
 * @Access protected - [admin]
 * @returns {Object} - Single User Object
 */
const getSingleUser = async (req, res, next) => {
  try {
    let query = { _id: req.params.id }
    let projection = 'name email mobile roles avatar'
    const user = await People.findOne(query, projection)
    res.status(200).json({ status: 'success', data: user })
  } catch (error) {
    next(createError(500, 'Internal Server Error!'))
  }
}

/**
 * @description Retrive All Users
 * @Route [GET]- /api/users?search='abc'&page=1&limit=10
 * @Access protected - [admin]
 * @returns {Array} - All User Array.
 */

const allUsers = async (req, res, next) => {
  try {
    const { search, page = 0, limit = 0 } = req.query
    const query = search
      ? regxSearchQuery(search, ['name', 'email', 'mobile'])
      : {}
    const projection = 'name email mobile roles avatar'

    const totalCount = await People.countDocuments(query)
    const users = await People.find(query, projection)
      .limit(limit)
      .skip(limit * (page - 1))

    res.status(200).json({ status: 'success', data: users, totalCount })
  } catch (error) {
    next(createError(500, 'Data Failed to Fetch'))
  }
}

/**
 * @description Update user By UserID
 * @Route [PUT]- /api/users/:userID
 * @Access protected - [user, admin]
 * @returns {Object} - Updated User.
 */

const updateUser = async (req, res, next) => {
  try {
    let query = { _id: req.params.id }
    let options = { new: true }
    const existedUser = await People.findById(query)

    // If Delivered Password Make it Hash
    const password = req.body.password
      ? await existedUser.makeHash(req.body.password)
      : existedUser.password

    let updatedData = {
      ...req.body,
      password,
      roles: existedUser.roles,
    }
    const user = await People.findOneAndUpdate(query, updatedData, options)

    let userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      mobile: user.mobile,
      avatar: user.avatar,
    }
    let token = user.generateJwtToken(userData)
    res.status(200).json({ status: 'success', data: { ...userData, token } })
  } catch (error) {
    if (error?._message) {
      let message = error?.message?.split(':').pop()
      next(createError(422, message))
    } else {
      next(createError(500, error))
    }
  }
}

/**
 * @description Delete User By UserID
 * @Route [DELETE]- /api/users/:userID
 * @Access protected - [admin]
 * @returns {Object} - Deleted Status.
 */

const deleteUser = async (req, res, next) => {
  try {
    let query = { _id: req.params.id }
    await People.deleteOne(query)
    res.status(200).json({ status: 'success', data: true })
  } catch (error) {
    next(createError(500, 'Data Failed to Fetch'))
  }
}

/**
 * @description Upload Avatar By UserID.
 * @Route [POST]- /api/users/:userID/upload
 * @Access protected - logged in user only
 * @returns {Object} - Updated User Information and JWT Token after modifing avatar url.
 */

const avatarUpload = async (req, res, next) => {
  try {
    let query = { _id: req.params.id }
    const result = await People.findById(query)
    const isDemo = result?.avatar.split('/').includes('default')

    if (result?.avatar && !isDemo && req.file) {
      let removeOldOne = unlinkSingleImage(result.avatar)
      if (removeOldOne) result.avatar = req.file.link
    }

    if (req.file) result.avatar = req.file.link
    const updated = await People.findByIdAndUpdate(
      query,
      { avatar: result.avatar },
      { new: true }
    )
    let userData = {
      _id: updated._id,
      name: updated?.name,
      email: updated?.email,
      role: updated?.role,
      avatar: updated?.avatar,
    }
    let token = updated.generateJwtToken(userData)
    res.status(200).json({ status: 'success', data: { ...userData, token } })
  } catch (error) {
    next(createError(500, 'Internal Server Error!'))
  }
}

/**
 * @description Delete All Data
 * @Route [DELETE]- /api/users/destroy
 * @Access protected - [-]
 * @returns {status, deletedCount} - Deleted Status.
 */

const deleteAllUsers = async (req, res, next) => {
  try {
    const users = await People.deleteMany()
    const avatars = emptyDirectory('users')

    res.status(200).json({
      status: 'success',
      deletedCount: users?.deletedCount,
      avatarDeletedCount: avatars,
    })
  } catch (error) {
    console.log({ error })
    next(createError(500, 'Something went wrong!'))
  }
}

// Module Exports:
module.exports = {
  createUser,
  userLogin,
  getSingleUser,
  allUsers,
  updateUser,
  deleteUser,
  avatarUpload,
  deleteAllUsers,
}
