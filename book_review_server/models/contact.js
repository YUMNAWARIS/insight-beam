const db = require('../db/knex')

async function createContact({ name, email, message }) {
    await db('contacts').insert({ name, email, message })
    return true
}

module.exports = { createContact }


