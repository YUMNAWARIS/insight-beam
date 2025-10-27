

const http = require('http')
const app = require('../app')
const { ensureSchema } = require('../db/bootstrap')
require('dotenv').config()

const server = http.createServer(app)

async function start() {
    try {
        await ensureSchema()
        console.log('Postgres schema ready...')
        server.listen(process.env.PORT, ()=>{
            console.log(`Server is running on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error('Failed to initialize database schema:', error)
        process.exit(1)
    }
}

start()