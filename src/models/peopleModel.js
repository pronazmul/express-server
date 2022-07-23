// Required Packeges
let mongoose = require('mongoose')
let uniqueValidator = require('mongoose-unique-validator')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
const { user } = require('../utilities/constants')

const peopleSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      unique: true,
      type: String,
      required: true,
    },
    avatar: String,
    roles: [{ type: String }],
  },
  { timestamps: true, versionKey: false }
)

// Integrate MOngoose Unique Validoator Plugin
peopleSchema.plugin(uniqueValidator, {
  message: '{PATH} should be unique, {VALUE} Already Exists!',
})

peopleSchema.pre('save', async function (next) {
  this.roles = [user.role[0]]
  this.password = await bcrypt.hash(this.password, 10)
})

/**
 *@Desc Compare Hashed Password Custom Model Method, Will be Acessible from User Model object.
 *@param(string) User Password to be compared
 *@returns Boolean
 */
peopleSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

/**
 *@Desc Make Hash Password
 *@param(string) - Normal Passowrd
 *@returns (string) - Hashed Password
 */
peopleSchema.methods.makeHash = async function (password) {
  return await bcrypt.hash(password, 10)
}

/**
 * @desc mongoose shcema method to create json web token
 * @param {object} userObject
 * @returns jwt token
 */
peopleSchema.methods.generateJwtToken = function (userObject) {
  return jwt.sign(userObject, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  })
}

// Make User Modelresult
const People = mongoose.model('people', peopleSchema)

// Export User Model
module.exports = People
