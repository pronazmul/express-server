const router = require('express').Router()
const userRoutes = require('./userRouter')

//Health Checker
router.use('/health', (_req, res) => res.status(200).json({ status: 'ok' }))

// Application Routes
router.use('/api/v1/users', userRoutes)

// Module Exports
module.exports = router
