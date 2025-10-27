const {Router} = require('express')
const { upload, uploadImage, getImage } = require('../controllers/image_controller')
const auth = require('../Middleware/auth')

const router = Router()

router.post('/upload_image', auth, upload.single('file'), uploadImage)
router.get('/:id', getImage)

module.exports = router


