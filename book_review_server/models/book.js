const db = require('../db/knex')

async function createBook({ title, author, description, publisher, ISBN, creator, purchase_link, imaged_link }) {
    const existing = await db('books').where({ isbn: ISBN }).first()
    if (existing) {
        throw new Error('Book is already registered.')
    }
    const [book] = await db('books')
        .insert({
            title,
            author,
            description,
            publisher,
            isbn: ISBN,
            like_count: 0,
            creator,
            purchase_link,
            imaged_link
        })
        .returning('*')
    return book
}

async function updateBook(id, { title, author, description, publisher, ISBN }) {
    const [updated] = await db('books')
        .where({ id })
        .update({ title, author, description, publisher, isbn: ISBN })
        .returning('*')
    return updated
}

async function findAllBooks() {
    return db('books').select('*').orderBy('created_at', 'desc')
}

async function findBookById(id) {
    return db('books').where({ id }).first()
}

module.exports = {
    createBook,
    updateBook,
    findAllBooks,
    findBookById
}


