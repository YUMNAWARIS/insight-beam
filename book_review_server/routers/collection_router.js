const {Router} = require('express')
const auth = require('../Middleware/auth')
const collection_controller = require('../controllers/collection_controller')

const router = Router()

// Add a book to user's collection
router.post('/:id', auth, collection_controller.addToCollection)

// Remove a book from user's collection
router.delete('/:id', auth, collection_controller.removeFromCollection)

// Get user's collection
router.get('/', auth, collection_controller.getMyCollection)

// Get user's liked books
router.get('/likes', auth, collection_controller.getMyLikes)

module.exports = router


