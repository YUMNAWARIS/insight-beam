const mongoose = require('mongoose')
const {isEmail} = require('validator');

const contactSchema = new mongoose.Schema({
    name : {
        type:String,
        require:true,
    },
    email : {
        type : String,
        required : [true, "Please Enter your email."],
        lowerCase : true,
        validate : [isEmail, "Please Enter a valid Email"]
    },
    message : {
        type : String,
        required : [true, "Please Enter your email."],
    }
})

const Contact = mongoose.model("Contacts", contactSchema);
module.exports = Contact;