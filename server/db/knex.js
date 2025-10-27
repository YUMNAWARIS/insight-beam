const knex = require('knex')

require('dotenv').config()

const config = {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        database: process.env.DB_NAME || 'insight-beam',
        user: process.env.DB_USER || 'insight-beam-db',
        password: process.env.DB_PASSWORD || 'insight-beam-password'
    },
    pool: { min: 0, max: 10 }
}

module.exports = knex(config)


