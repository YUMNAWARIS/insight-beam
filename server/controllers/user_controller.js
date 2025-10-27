const Book = require('../models/book')
const User = require('../models/user')
const jwtToken = require('../utils/jwt')

module.exports.login = async function (req, res, next) {
    const { email, password } = req.body
    try {
        const user = await User.login(email, password)
        const jwt = jwtToken.GetToken(user.id)

        const profile = await User.getUserProfile(user.id)
        
        res.status(200).json({
            Authentication_Token: jwt,
            user: {
                user_name: user.name,
                user_email: user.email,
                user_profile: profile
            }
        })
        
    } catch (error) {
        res.status(400).json({
            Error: true,
            Error_Message: error.message
        })
    }

}

module.exports.signup = async function (req, res, next) {
    const { name, email, password } = req.body;
    try {
        const user = await User.createUser({ name, email, password })
        const token = jwtToken.GetToken(user.id);
        res.status(200).json({
            Authentication_Token: token,
            user: {
                user_name: user.name,
                user_email: user.email,
                user_profile: user.profile
            }
        })
    } catch (error) {
        res.status(400).json({
            Error: true,
            Error_Message: error.message
        })
    }

}

module.exports.updateProfile = async function (req, res) {
    try {
        const userId = req.user
        if (!userId) {
            return res.status(401).json({ Error: true, Error_Message: 'Unauthorized' })
        }
        const profileData = req.body || {}
        const updated = await User.upsertUserProfile(userId, profileData)
        res.status(200).json({
            success: true,
            profile: updated
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            Error: true,
            Error_Message: error.message
        })
    }
}

module.exports.changePassword = async function (req, res) {
    try {
        const userId = req.user
        const { oldPassword, newPassword } = req.body
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                Error: true,
                Error_Message: 'oldPassword and newPassword are required'
            })
        }
        await User.changePassword(userId, oldPassword, newPassword)
        res.status(200).json({ success: true })
    } catch (error) {
        res.status(400).json({
            Error: true,
            Error_Message: error.message
        })
    }
}
