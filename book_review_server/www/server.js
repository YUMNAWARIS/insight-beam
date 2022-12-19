

const http = require('http')
const mongoose = require('mongoose')
const app = require('../app')
require('dotenv').config()

const server = http.createServer(app)

mongoose.connect(process.env.DBURI)
.then( ()=>{
    console.log("Database connected...")
})
.catch(error=>{
    console.log(error)
})

server.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})