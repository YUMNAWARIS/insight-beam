const Book = require('../models/book')
const User = require('../models/user')

module.exports.post_book = async function (req, res, next) {
    const { title, author, description, publisher, ISBN , purchase_link, imaged_link} = req.body
    const user_id = req.user
    try {
        const book = await Book.createBook({
            title, author, description, publisher, ISBN,
            creator: user_id,
            purchase_link,
            imaged_link
        })
        if (book) {
            res.json({
                Message : "Book is added successfully...", 
                New_Book : book
            })
        }else{
            res.status(500).json({
                Error: true,
                Error_message: 'Something went wrong...',
            })
        }
    } catch (error) {
        res.status(400).json({
            Error: true,
            Error_Message: error.message,
        })
    }
}

module.exports.update_book = async function (req, res, next) {
    const { title, author, description, publisher, ISBN } = req.body
    const book_id = req.params.id
    const user_id = req.user
    // authorize: ensure the current user owns the book
    const ownerBooks = await User.getUserCreatedBooks(user_id)
    const owns = ownerBooks.find(b => b.id === book_id)
    if (!owns) {
        return res.status(400).json({
            Error: true,
            Error_Message: "You are not authorized to update info about this book.",
        })
    }
    const book_detail = await Book.updateBook(book_id, {
        title, author, description, publisher, ISBN
    })
    res.status(200).json({
        Message: "Book Info is updated",
        _Book: book_detail
    })
}

module.exports.get_all = async function (req, res, next) {
    const books = await Book.findAllBooks()
    res.json({
        Books: books
    })
}

module.exports.get_one = async function (req, res, next) {
    const id = req.params.id
    try {
        const book = await Book.findBookById(id)
        if (book) {
            res.json({
                Book: book
            })
        } else {
            res.status(400).json({
                Error: true,
                Error_Message: "Book Not Found",
            })
        }
    } catch (err) {
        res.status(400).json({
            Error: true,
            Error_Message: "Book Not Found",
        })
    }
}

module.exports.mybooks = async function(req,res,next){
    const user = req.user;
    const books = await User.getUserCreatedBooks(user)
    res.status(200).json({
        user: user,
        books
    })
}

module.exports.mylikes = async function(req,res,nex){
    const user = req.user;
    const books = await User.getUserLikedBooks(user)
    res.status(200).json({
        user: user,
        books
    })
}