// External Modules:
const { check, validationResult } = require('express-validator')
const createError = require('http-errors')

// Internal Module
const Check = require('../../models/checkModel')
const { check: checkData } = require('../../utilities/constants')
const { expressValidatorErrorFormatter } = require('../../utilities/helpers')

// Validate Check Details while Adding
const checkCreateValidator = [
  check('protocol')
    .notEmpty()
    .withMessage('Protocol is Required!')
    .isIn(checkData.protocol)
    .withMessage('Invalid Protocol!')
    .trim(),
  check('url')
    .notEmpty()
    .withMessage('Url is Required')
    .isURL()
    .withMessage('Invalid URL!')
    .trim()
    .custom(async (value, { req, res }) => {
      try {
        const result = await Check.findOne({ url: value, user: req.user._id })
        if (result) {
          throw createError('You already added this url!')
        }
      } catch (error) {
        throw createError(error.message)
      }
    }),
  check('method')
    .notEmpty()
    .withMessage('Request verb is Required!')
    .isIn(checkData.method)
    .withMessage('Invalid Request Verb!')
    .trim(),
  check('successCodes')
    .notEmpty()
    .withMessage('Success Codes is Required!')
    .custom((value) => value.every((v) => checkData.successCodes.includes(v)))
    .withMessage('Invalid Success Codes')
    .trim(),
  check('timeOutSecond')
    .notEmpty()
    .withMessage('Request timeout is Required!')
    .custom((v) => v > 0 && v <= checkData.timeOutSecond)
    .withMessage('Timeout Second should be within 0 to 5 seconds'),
]

// Validate Check Details while Adding
const checkUpdateValidator = [
  check('protocol')
    .optional()
    .isIn(checkData.protocol)
    .withMessage('Invalid Protocol!')
    .trim(),
  check('url')
    .optional()
    .isURL()
    .withMessage('Invalid URL!')
    .trim()
    .custom(async (value, { req, res }) => {
      try {
        const result = await Check.findOne({ url: value, user: req.user._id })
        if (result) {
          throw createError('You already added this url!')
        }
      } catch (error) {
        throw createError(error.message)
      }
    }),
  check('method')
    .optional()
    .isIn(checkData.method)
    .withMessage('Invalid Request Verb!')
    .trim(),
  check('successCodes')
    .optional()
    .custom((value) => value.every((v) => checkData.successCodes.includes(v)))
    .withMessage('Invalid Success Codes')
    .trim(),
  check('timeOutSecond')
    .optional()
    .custom((v) => v > 0 && v <= checkData.timeOutSecond)
    .withMessage('Timeout Second should be within 0 to 5 seconds'),
]

// Handle User input Validation Errors
const checkValidationHandler = (req, res, next) => {
  const errors = validationResult(req)
  const formattedError = errors.mapped()

  if (Object.keys(formattedError).length === 0) {
    next()
  } else {
    res.status(500).json({
      status: 'fail',
      message: 'Input Validation Failed',
      details: expressValidatorErrorFormatter(formattedError),
    })
  }
}

module.exports = {
  checkCreateValidator,
  checkUpdateValidator,
  checkValidationHandler,
}
