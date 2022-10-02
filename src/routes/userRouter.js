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
  userLogout,
} = require('../controllers/userController')

// Middlewares

const authorize = require('../middlewares/authentication/authorize')
const authorizeSelf = require('../middlewares/authentication/authorizeSelf')
const validateRequest = require('../middlewares/validateRequest')
const { singleConvertToWebp } = require('../middlewares/upload/imageConverter')
const { singleUploader } = require('../middlewares/upload/imageUploader')
const {
  createUserSchema,
  loginSchema,
  updateUserSchema,
} = require('../schema/userSchema')
const authCheck = require('../middlewares/authentication/authCheckCookie')

//Routes:

router.delete('/destroy', deleteAllUsers)
router.post('/', validateRequest(createUserSchema), createUser)
router.post('/auth', validateRequest(loginSchema), userLogin)
router.post('/auth/logout', authCheck, userLogout)
router.get('/', authCheck, authorize(['admin']), allUsers)

router.get(
  '/:id',
  authCheck,
  authorize(['admin', 'user']),
  authorizeSelf,
  getSingleUser
)

router.put(
  '/:id',
  validateRequest(updateUserSchema),
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
