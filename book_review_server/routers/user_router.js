const {Router} = require('express')
const user_controller = require('../controllers/user_controller')
const router = Router()

router.post('/login',user_controller.login)
router.post('/signup',user_controller.signup)

module.exports = router