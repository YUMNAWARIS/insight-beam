const User = require('../models/user')
const Book = require('../models/book')

module.exports.like = async function (req, res, next) {
    const book_id = req.params.id
    const user_id = req.user

    try {
        const user = await User.findById(user_id)
        const book = await Book.findById(book_id)
        if (book) {
            user.likes.forEach(like => {
                if (book_id == like) {
                    throw Error("Book is already liked by you.")
                }
            })
            book.like_count += 1
            user.likes.push(book_id)
            user.save()
            book.save()
            res.status(200).json({
                message : "You like a book",
                book
            })

        } else {
            res.status(400).json({
                Error: "Book not Found"
            })
        }
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
        const user = await User.findById(user_id)
        const book = await Book.findById(book_id)
        let flag = false
        if (book) {
            user.likes.forEach( (like,index) => {
                if (book_id == like) {
                    flag=true
                    book.like_count -= 1
                    book.save()
                    user.likes.pop(like)
                    user.save()
                }
            })
            if(flag){
                res.status(200).json({
                    message : "Disliked Book"
                })
            }else{
                res.status(200).json(
                    {
                        Error: "Book is not in your likes collection...."
                    }
                )
            }
            
        } else {
            res.status(400).json({
                Error: "Book not Found"
            })
        }
    } catch (err) {
        res.status(500).json({
            Error: err.message
        })
    }
}
