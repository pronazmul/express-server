// External Modules:
const router = require('express').Router()

// Controller:
const {
  createUser,
  userLogin,
  getSingleUser,
  allUsers,
  updateUser,
  deleteUser,
  avatarUpload,
  deleteAllUsers,
} = require('../controllers/userController')

// Middlewares
const authCheck = require('../middlewares/authentication/authCheck')
const authorize = require('../middlewares/authentication/authorize')
const authorizeSelf = require('../middlewares/authentication/authorizeSelf')
const dataValidation = require('../middlewares/dataValidation')
const { singleConvertToWebp } = require('../middlewares/upload/imageConverter')
const { singleUploader } = require('../middlewares/upload/imageUploader')
const { createUserSchema } = require('../utils/yupValidationSchema')

//Routes:

router.delete('/destroy', deleteAllUsers)

router.post('/', dataValidation(createUserSchema), createUser)
router.get('/', allUsers)
router.post('/auth', userLogin)
router.get(
  '/:id',
  authCheck,
  authorize(['admin', 'user']),
  authorizeSelf,
  getSingleUser
)
router.put(
  '/:id',
  authCheck,
  authorize(['admin', 'user']),
  authorizeSelf,
  updateUser
)
router.delete('/:id', authCheck, authorize(['admin']), deleteUser)
router.post(
  '/:id/upload',
  authCheck,
  authorize(['admin', 'user']),
  authorizeSelf,
  singleUploader('avatar', 'users'),
  singleConvertToWebp('users'),
  avatarUpload
)

// Exports
module.exports = router
