// Required Packeges
const mongoose = require('mongoose')

/**
 * @description: Connect to MongoDB
 * @connection Local: mongodb://localhost:27017/express_auth
 */
const mongooseConnection = async () => {
  try {
    const OPTIONS = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: '',
      pass: '',
    }
    await mongoose.connect(process.env.MONGO_COMPASS, OPTIONS)
    console.log(
      `MongoDB Successfully Connected with ${mongoose.connection.name}`.green
        .bold
    )
  } catch (error) {
    console.log(`Error ${error.message}`.red.bold)
    process.exit(1)
  }
}

// Module Exports:
module.exports = { mongooseConnection }
