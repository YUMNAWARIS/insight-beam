const {Router} = require('express')
const user_controller = require('../controllers/user_controller')
const auth = require('../Middleware/auth')
const router = Router()

router.post('/login',user_controller.login)
router.post('/signup',user_controller.signup)
router.patch('/profile', auth, user_controller.updateProfile)
router.post('/change-password', auth, user_controller.changePassword)

module.exports = router