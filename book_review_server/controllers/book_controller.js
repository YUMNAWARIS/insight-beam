const Book = require('../models/book')
const User = require('../models/user')

module.exports.post_book = async function (req, res, next) {
    const { title, author, description, publisher, ISBN , purchase_link, imaged_link} = req.body
    const user_id = req.user
    try {
        const user = await User.findById({ _id: user_id })
        const book = await Book.create({
            title, author, description, publisher, ISBN,
            like_count: 0,
            reviews : [],
            creator : user_id,
            purchase_link,
            imaged_link
        })
        user.books.push(book._id)
        user.save()
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
    const user = await User.findById({ _id: user_id })

    let updated = null
    user.books.forEach(book => {
        if (book_id == book) {
            updated = book
        }
    })
    if (updated) {
        const book_detail = await Book.findByIdAndUpdate(updated, {
            title, author, description, publisher, ISBN
        })
        res.status(200).json({
            Message: "Book Info is updated",
            _Book: book_detail
        })
    } else {
        res.status(400).json({
            Error: true,
            Error_Message: "You are not authorized to update info about this book.",
        })
    }
}

module.exports.get_all = async function (req, res, next) {
    const books = await Book.find()

    res.json({
        Books: books
    })
}

module.exports.get_one = async function (req, res, next) {
    const id = req.params.id
    try {
        const book = await Book.findById(id)
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
        console.log(err)
        res.status(400).json({
            Error: true,
            Error_Message: "Book Not Found",
        })
    }
}

module.exports.mybooks = async function(req,res,next){
    const user = req.user;
    const user_detail = await User.findById(user)

    const mybooks = user_detail.books
    const books = []
    for(  i=0;i<mybooks.length; i++){
        const book_detail = await Book.findById(mybooks[i]);
        if(book_detail){
            books.push(book_detail)
        }
        if(i==mybooks.length-1){
                res.status(200).json({
                user : user.name,
                books: books
            })
        }
    }
}

module.exports.mylikes = async function(req,res,nex){
    const user = req.user;
    const user_detail = await User.findById(user)

    const mybooks = user_detail.likes
    const books = []
    for(  i=0;i<mybooks.length; i++){
        const book_detail = await Book.findById(mybooks[i]);
        if(book_detail){
            books.push(book_detail)
        }
        if(i==mybooks.length-1){
                res.status(200).json({
                user : user.name,
                books: books
            })
        }
    }
}