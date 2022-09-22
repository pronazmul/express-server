const colors = require('colors')
const { mongooseConnection } = require('./db')
const { demoUsers } = require('./data')
const People = require('../models/peopleModel')

// Configuration
mongooseConnection()
require('dotenv').config()

// Import Data Seeder:
const importData = async () => {
  try {
    await People.deleteMany()
    await People.insertMany(demoUsers)
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
import { demoUsers, users } from './data'
