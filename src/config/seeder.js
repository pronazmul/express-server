// External Dependencies
const colors = require('colors')
const { mongooseConnection } = require('./db')
require('dotenv').config()

// Indernal Dependencies
const People = require('../models/peopleModel')

// Database Conenction
mongooseConnection()

// Import Data Seeder:
const importData = async () => {}

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
