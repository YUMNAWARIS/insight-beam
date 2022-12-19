const mongoose = require('mongoose')
const {isEmail} = require('validator');
const hashed = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required : [true, "Please Enter your name."]
    },
    email : {
        type : String,
        required : [true, "Please Enter your email."],
        unique : [true, "Email already exist."],
        lowerCase : true,
        validate : [isEmail, "Please Enter a valid Email"]
    },
    bio : String,
    password: {
        type:String ,
        required : [true,"Please enter a Password."],
        minLength : [8,"Password should be 8 character long."]
    },
    books:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'books'
        }
    ],
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'books'
        }
    ]
})


// userSchema.pre('save',async function(next){
//     const salt = await hashed.genSalt();
//     this.password = await hashed.hash(this.password, salt);
//     next();
// })

// Static methods on UserSchema
userSchema.statics.login = async function(email,pass){
    const user = await this.findOne({email})
    if(user){
        // const IsAuth = await hashed.compare(pass,user.password);
        if(pass == user.password){
            return user;
        }else{
            throw Error("Password Incorrect...");
        }
    }else{
        throw Error("Email Not Found...");
    }
}

const User = mongoose.model("users",userSchema);
module.exports = User;