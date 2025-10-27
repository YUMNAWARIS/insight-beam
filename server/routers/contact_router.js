
const {Router} = require('express')
const router = Router()

const contact_Controller = require('../controllers/contact_controller')

router.post('/', contact_Controller.post_contact)

module.exports = router