const colors = require('colors')
const { mongooseConnection } = require('./db')
const { demoUsers } = require('./data')

// Configuration
require('dotenv').config()
mongooseConnection()

//Models
const People = require('../models/peopleModel')

// Import Data Seeder:
const importData = async () => {
  try {
    await People.deleteMany()
    await People.create(demoUsers)
    console.log('Data Inserted'.magenta.inverse)
    process.exit()
  } catch (error) {
    console.log(`Error: ${error}`.red.inverse)
    process.exit(1)
  }
}

// Destroy Data Seeder:
const destroyData = async () => {
  try {
    await People.deleteMany()
    console.log('Data Destroyed Successfully'.rainbow.bold)
    process.exit()
  } catch (error) {
    console.log(`Error ${error.message}`.red.bold)
    process.exit(1)
  }
}

// Manage Seeder Command:
if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
