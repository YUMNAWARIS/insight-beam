const Contact = require('../models/contact')

module.exports.post_contact = async function (req, res) {
    const { name, email, message } = req.body
    try{
        await Contact.createContact({ name, email, message })
        res.status(200).json({
            message: "Thank you so much for your message, we will respond you soon..."
        })
    }catch (err) {
        res.status(400).json({
            Error: true,
            Error_message: err.message
        })
    }
}