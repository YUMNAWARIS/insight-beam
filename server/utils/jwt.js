const jwt = require('jsonwebtoken')
require('dotenv').config()

const maxAge = 5 * 24 * 60 * 60
function createToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    })
}

module.exports.GetToken = createToken