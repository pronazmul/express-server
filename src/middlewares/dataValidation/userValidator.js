// External Modules:
const { check, validationResult } = require('express-validator')
const createError = require('http-errors')
const path = require('path')
const { unlink } = require('fs')

// Internal Module
const User = require('../../models/peopleModel')
const { expressValidatorErrorFormatter } = require('../../utilities/helpers')
const { user } = require('../../utilities/constants')

// Validate User Data while Creating
const userCreateValidator = [
  check('name')
    .isLength({ min: 3 })
    .withMessage('Name is Required!')
    .isAlpha('en-US', { ignore: ' -' })
    .withMessage('Name must not contain anything other than alphabet!')
    .trim(),
  check('email')
    .isEmail()
    .withMessage('Invalid email Address!')
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value })
        if (user) {
          throw createError('Email already used!')
        }
      } catch (error) {
        throw createError(error.message)
      }
    }),
  check('password')
    .isStrongPassword()
    .withMessage(
      'password must be 8 character long and should contain 1 uppercase, 1 lowercase, 1 number and 1 symble '
    ),
  check('mobile')
    .isMobilePhone('bn-BD')
    .withMessage('Invalid Mobile Number!')
    .custom(async (value) => {
      try {
        const user = await User.findOne({ mobile: value })
        if (user) {
          throw createError('Mobile number already used!')
        }
      } catch (error) {
        throw createError(error.message)
      }
    }),
  check('role').optional().isIn(user.role).withMessage('Invalid user role!'),
]

// Validate user data while updating:
const userUpdateValidator = [
  check('name')
    .optional()
    .isAlpha('en-US', { ignore: ' -' })
    .withMessage('Name must not contain anything other than alphabet!')
    .trim(),
  check('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email Address!')
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value })
        if (user) {
          throw createError('Email already used!')
        }
      } catch (error) {
        throw createError(error.message)
      }
    }),
  check('mobile')
    .optional()
    .isMobilePhone('bn-BD')
    .withMessage('Mobile number must be a bangladeshi mobile number')
    .custom(async (value) => {
      try {
        const user = await User.findOne({ mobile: value })
        if (user) {
          throw createError('Mobile number already used!')
        }
      } catch (error) {
        throw createError(error.message)
      }
    }),
  check('password')
    .optional()
    .isStrongPassword()
    .withMessage(
      'password must be 8 character long and should contain 1 uppercase, 1 lowercase, 1 number and 1 symble'
    ),
]

// Handle User input Validation Errors
const userValidationHandler = (req, res, next) => {
  const errors = validationResult(req)
  const formattedError = errors.mapped()

  if (Object.keys(formattedError).length === 0) {
    next()
  } else {
    if (req.files && req.files.length > 0) {
      const { filename } = req.files[0]
      unlink(
        path.join(__dirname, `/../../public/uploads/avatars/${filename}`),
        (error) => console.log(error)
      )
    }
    res.status(400).json({
      status: 'fail',
      message: 'Input Validation Failed!',
      details: expressValidatorErrorFormatter(formattedError),
    })
  }
}

module.exports = {
  userCreateValidator,
  userValidationHandler,
  userUpdateValidator,
}
