const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title : {
        type:String,
        required : [true, "Please Enter a title."]
    },
    author : {
        type:String,
        required : [true,"Please Enter an Author."]
    },
    description : {
        type:String,
        required : [true, "Please Enter a description."]
    },
    publisher : {
        type:String,
        required : [true, "Please Enter a publisher."]
    },
    ISBN : {
        type:String,
        required : [true, "Please Enter an ISBN."],
        unique  : [true,"Book is already registered."]
    },
    like_count : {
        type:Number,
    },
    reviews : [
        {
            user_id : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "users"
            },
            review_message : String
        }
    ],
    creator : String,
    purchase_link : String,
    imaged_link : String
})

module.exports = mongoose.model('books',bookSchema)