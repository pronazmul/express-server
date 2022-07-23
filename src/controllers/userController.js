// External Modules:
const createError = require('http-errors')

// Internal Modules:
const People = require('../models/peopleModel')
const { unlinkSingleImage } = require('../utilities/fileUnlink')
const { mongooseErrorFomatter } = require('../utilities/schemaValidator')

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
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      roles: user.roles,
      avatar: user.avatar || `${process.env.APP_URL}/uploads/users/avatar.jpg`,
    }
    let token = user.generateJwtToken(userData)
    res.status(200).json({ status: 'success', data: { ...userData, token } })
  } catch (error) {
    if (error._message) {
      res.status(500).json({
        status: 'fail',
        message: 'Input Validation Failed',
        details: mongooseErrorFomatter(error.errors),
      })
    } else {
      next(createError(500, 'Data Failed to Create'))
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
      let userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        avatar:
          user.avatar || `${process.env.APP_URL}/uploads/users/avatar.jpg`,
      }
      let token = user.generateJwtToken(userData)

      // Set Cookies:
      res.cookie(process.env.COOKIE_NAME, userData, {
        maxAge: process.env.JWT_EXPIRE_TIME,
        httpOnly: true,
        signed: true,
      })

      res.status(200).json({ status: 'success', data: { ...userData, token } })
    } else {
      next(createError(401, 'Authentication Failed!'))
    }
  } catch (error) {
    next(createError(500, 'Internal Server Error!'))
  }
}

/**
 * @description Retrive Logged In user Info from token
 * @Route [GET]- /api/users/profile
 * @Access private - logged in user
 * @returns {Object} - User Profile Object.
 */

const userProfile = async (req, res, next) => {
  try {
    let user = req.user
    res.status(200).json({ status: 'success', data: user })
  } catch (error) {
    next(createError(500, 'Internal Server Errors!'))
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
 * @Route [GET]- /api/users
 * @Access protected - [admin]
 * @returns {Array} - All User Array.
 */

const allUsers = async (req, res, next) => {
  try {
    let query = {}
    let projection = 'name email mobile roles avatar'
    const users = await People.find(query, projection)
    res.status(200).json({ status: 'success', data: users })
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
      userType: existedUser.userType,
    }

    const user = await People.findOneAndUpdate(query, updatedData, options)

    let userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      mobile: user.mobile,
      avatar: user.avatar || `${process.env.APP_URL}/uploads/users/avatar.jpg`,
    }
    let token = user.generateJwtToken(userData)
    res.status(200).json({ status: 'success', data: { ...userData, token } })
  } catch (error) {
    if (error._message) {
      res.status(500).json({
        status: 'fail',
        message: 'Input Validation Failed',
        details: mongooseErrorFomatter(error.errors),
      })
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
    let id = req.params.id
    const result = await People.findById(id)
    if (result.avatar && req.file) {
      let removeOldOne = await unlinkSingleImage(result.avatar)
      if (removeOldOne) result.avatar = req.file.link
    }
    if (req.file) result.avatar = req.file.link
    const updatedUser = await People.findByIdAndUpdate(
      { _id: id },
      { avatar: result.avatar },
      { new: true }
    )
    let userData = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar:
        updatedUser.avatar || `${process.env.APP_URL}/uploads/users/avatar.jpg`,
    }
    let token = updatedUser.generateJwtToken(userData)
    console.log(token)
    res.status(200).json({ status: 'success', data: { ...userData, token } })
  } catch (error) {
    next(createError(500, 'Internal Server Error!'))
  }
}

// Module Exports:
module.exports = {
  createUser,
  userLogin,
  userProfile,
  getSingleUser,
  allUsers,
  updateUser,
  deleteUser,
  avatarUpload,
}
