const Book = require('../models/book')
const User = require('../models/user')
const jwtToken = require('../utils/jwt')

module.exports.login = async function (req, res, next) {
    const { email, password } = req.body
    try {
        const user = await User.login(email, password)
        const jwt = jwtToken.GetToken(user.id)

        const created_books = await User.getUserCreatedBooks(user.id)
        const liked_books = await User.getUserLikedBooks(user.id)

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
        const user = await User.createUser({ name, email, password, bio })
        const token = jwtToken.GetToken(user.id);
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
