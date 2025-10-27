const User = require('../models/user')
const Book = require('../models/book')

module.exports.addToCollection = async function (req, res) {
    try {
        const userId = req.user
        const bookId = req.params.id

        const book = await Book.findBookById(bookId)
        if (!book) {
            return res.status(400).json({ Error: 'Book not Found' })
        }

        await User.addToCollection(userId, bookId)
        return res.status(200).json({ message: 'Book added to your collection' })
    } catch (error) {
        return res.status(400).json({ Error: error.message })
    }
}

module.exports.removeFromCollection = async function (req, res) {
    try {
        const userId = req.user
        const bookId = req.params.id
        const book = await Book.findBookById(bookId)
        if (!book) {
            return res.status(400).json({ Error: 'Book not Found' })
        }
        const removed = await User.removeFromCollection(userId, bookId)
        if (!removed) {
            return res.status(200).json({ Error: 'Book is not in your collection.' })
        }
        return res.status(200).json({ message: 'Book removed from your collection' })
    } catch (error) {
        return res.status(400).json({ Error: error.message })
    }
}

module.exports.getMyCollection = async function (req, res) {
    try {
        const userId = req.user
        const books = await User.getUserCollection(userId)
        return res.status(200).json({ books })
    } catch (error) {
        return res.status(500).json({ Error: error.message })
    }
}

module.exports.getMyLikes = async function (req, res) {
    try {
        const userId = req.user
        const books = await User.getUserLikedBooks(userId)
        return res.status(200).json({ books })
    } catch (error) {
        return res.status(500).json({ Error: error.message })
    }
}


