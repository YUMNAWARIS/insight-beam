const express =  require('express')
const cors = require('cors')
require('dotenv').config()

const user_router = require('./routers/user_router')
const book_router = require('./routers/book_router')
const like_router = require('./routers/like_router')
const collection_router = require('./routers/collection_router')
const contact_router = require('./routers/contact_router')
const image_router = require('./routers/image_router')

const app = express()

app.use(express.json())
app.use(cors())


// Routes
app.use('/user', user_router)
app.use('/book', book_router)
app.use('/like', like_router)
app.use('/collection', collection_router)
app.use('/contact', contact_router)
app.use('/image', image_router)
app.use('', (req, res)=>{
    res.json({
        server : `http://localhost:${process.env.PORT}`,
        statusCode : 200,
        message : "Hello World."
    })
})

module.exports = app