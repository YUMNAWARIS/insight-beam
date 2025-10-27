const multer = require('multer')
const ImageStore = require('../models/image_store')
const User = require('../models/user')
const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/jpg']
        if (allowed.includes(file.mimetype)) return cb(null, true)
        cb(new Error('Only jpeg, jpg, png files are allowed'))
    }
})

async function uploadImage(req, res) {
    try {
        const userId = req.user
        if (!userId) {
            return res.status(401).json({ Error: true, Error_Message: 'Unauthorized' })
        }
        if (!req.file) {
            return res.status(400).json({ Error: true, Error_Message: 'No file uploaded' })
        }
        const imageName = req.file.originalname
        const imageBuffer = req.file.buffer
        const metadata = {
            mimetype: req.file.mimetype,
            size: req.file.size,
            fieldname: req.file.fieldname,
            originalname: req.file.originalname
        }
        const saved = await ImageStore.saveImage({ imageName, imageBuffer, metadata })
        await User.updateUserProfile(userId, { 
            profile_image: `${process.env.BASE_URL}/image/${saved.id}` 
        })
        res.status(200).json({
            Image_URL: `${process.env.BASE_URL}/image/${saved.id}`
        })
    } catch (error) {
        res.status(400).json({ Error: true, Error_Message: error.message })
    }
}

module.exports = {
    upload,
    uploadImage
}

module.exports.getImage = async function (req, res) {
    try {
        const { id } = req.params
        const row = await ImageStore.getImageById(id)
        if (!row) return res.status(404).end()
        const meta = row.metadata || {}
        const contentType = meta.mimetype || 'application/octet-stream'
        res.setHeader('Content-Type', contentType)
        res.setHeader('Content-Disposition', `inline; filename="${row.image_name}"`)
        res.send(row.image_data)
    } catch (error) {
        res.status(400).json({ Error: true, Error_Message: error.message })
    }
}


