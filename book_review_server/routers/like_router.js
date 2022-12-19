const {Router} = require('express')
const like_controller = require('../controllers/like_controller')
const auth = require('../Middleware/auth')

const router = Router()

router.post('/:id',auth, like_controller.like)
router.delete('/:id',auth, like_controller.unlike)

module.exports = router