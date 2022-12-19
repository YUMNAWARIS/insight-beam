const Book = require('../models/book')
const User = require('../models/user')
const jwtToken = require('../utils/jwt')

module.exports.login = async function (req, res, next) {
    const { email, password } = req.body
    try {
        const user = await User.login(email, password)
        const jwt = jwtToken.GetToken(user._id)

        const liked_books = [];
        const created_books = [];
        
        for(let i=0;i<user.books.length;i++){
            let book = await Book.findById(user.books[i]);
            if(book){
                created_books.push(book)
            }else{
                user.books.pop(user.books[i])
            }
        }
        for(let i=0;i<user.likes.length;i++){
            let book = await Book.findById(user.books[i]);
            console.log(book)
            if(book){
                liked_books.push(book)
            }else{
                user.likes.pop(user.books[i])
            }
        }
        user.save()
        res.status(200).json({
            Authentication_Token: jwt,
            user: {
                user_name: user.name,
                user_email: user.email,
                user_bio: user.bio,
                liked_books,
                created_books
            },

        })
        
    } catch (error) {
        res.status(400).json({
            Error: true,
            Error_Message: error.message
        })
    }

}

module.exports.signup = async function (req, res, next) {
    const { name, email, password, bio } = req.body;
    try {
        const checked = await User.find({ email })
        if (checked.length != 0) {
            throw new Error("Email already exists.... Please Login for further details.");
        }
        const user = await User.create({
            name, email, password, bio,
            books: [],
            likes: []
        });
        const token = jwtToken.GetToken(user._id);
        res.status(200).json({
            Authentication_Token: token,
            user: {
                user_name: user.name,
                user_email: user.email,
                user_bio: user.bio,
                created_books: [],
                liked_books: []
            }
        })
    } catch (error) {
        res.status(400).json({
            Error: true,
            Error_Message: error.message
        })
    }

}
