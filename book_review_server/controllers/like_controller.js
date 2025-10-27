const User = require('../models/user')
const Book = require('../models/book')

module.exports.like = async function (req, res, next) {
    const book_id = req.params.id
    const user_id = req.user

    try {
        const book = await Book.findBookById(book_id)
        if (!book) {
            return res.status(400).json({
                Error: "Book not Found"
            })
        }
        await User.addLike(user_id, book_id)
        const updated = await Book.findBookById(book_id)
        res.status(200).json({
            message : "You like a book",
            book: updated
        })
    } catch (err) {
        res.status(500).json({
            Error: err.message
        })
    }
}


module.exports.unlike = async function (req, res, next) {
    const book_id = req.params.id
    const user_id = req.user
    try {
        const book = await Book.findBookById(book_id)
        if (!book) {
            return res.status(400).json({
                Error: "Book not Found"
            })
        }
        const removed = await User.removeLike(user_id, book_id)
        if (removed) {
            res.status(200).json({ message: "Disliked Book" })
        } else {
            res.status(200).json({
                Error: "Book is not in your likes collection...."
            })
        }
    } catch (err) {
        res.status(500).json({
            Error: err.message
        })
    }
}
