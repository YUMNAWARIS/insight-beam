const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req, res, next) => {
    const head = req.get('Authorization')
    if (!head) return next()
    try {
        const token = head.startsWith('Bearer ') ? head.slice(7) : head
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded && decoded.id) {
            req.user = decoded.id
        }
    } catch (_) {
        // ignore invalid tokens in optional auth
    }
    next()
}


