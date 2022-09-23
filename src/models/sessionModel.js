// Required Packeges
let mongoose = require('mongoose')
let uniqueValidator = require('mongoose-unique-validator')

const sessionSchema = mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: 'people' },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  { timestamps: true, versionKey: false }
)

// Integrate MOngoose Unique Validoator Plugin
sessionSchema.plugin(uniqueValidator, {
  message: '{VALUE} Already Exists!',
})

// Make User Modelresult
const Session = mongoose.model('session', sessionSchema)

// Export User Model
module.exports = Session
