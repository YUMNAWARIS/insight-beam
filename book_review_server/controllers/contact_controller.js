const Contact = require('../models/contact')

module.exports.post_contact = async function (req, res) {
    const { name, email, message } = req.body
    try{
        const contact = await Contact.create({ name, email, message })
        if (contact) {
                res.status(200).json({
                message: "Thank you so much for your message, we will respond you soon..."
            })
        }
        else {
            res.status(400).json({
                Error: true,
                Error_message: "Something went wrong. Please try again later..."
            })
        }
    }catch (err) {
        res.status(400).json({
            Error: true,
            Error_message: err.message
        })
    }
}