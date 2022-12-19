const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = (req,res,next)=>{
    const head = req.get("Authorization");
    if(!head){
        res.status(401).json({
            Error: true,
            Error_Message :"Authentication Fails"
        })
    }else{
        
    const token = head;
    let decodedToken;

    try{
        decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    }catch(err){
        res.status(401).json({
            Error: true,
            Error_Message :"Authentication Fails"
        })
    }

    if(!decodedToken){
        const error = new Error("Authentication Fails");
        error.statusCode = 404;
        res.status(401).json({
            Error: true,
            Error_Message :"Authentication Fails"
        })
    }else{
        req.user = decodedToken.id;
        next();
    }
    
    }
    
}