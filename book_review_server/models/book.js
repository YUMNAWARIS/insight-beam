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

async function findAllBooksWithMeta(currentUserId) {
    const result = await db.raw(`
        SELECT 
            b.*, 
            COALESCE(lc.like_count, 0)::int AS like_count,
            COALESCE(sc.save_count, 0)::int AS save_count,
            (ul.user_id IS NOT NULL) AS is_liked_by_current_user,
            (uc.user_id IS NOT NULL) AS is_saved_by_current_user
        FROM books b
        LEFT JOIN (
            SELECT book_id, COUNT(*)::int AS like_count
            FROM user_like
            GROUP BY book_id
        ) lc ON lc.book_id = b.id
        LEFT JOIN (
            SELECT book_id, COUNT(*)::int AS save_count
            FROM user_collection
            GROUP BY book_id
        ) sc ON sc.book_id = b.id
        LEFT JOIN user_like ul ON ul.book_id = b.id AND ul.user_id = ?
        LEFT JOIN user_collection uc ON uc.book_id = b.id AND uc.user_id = ?
        ORDER BY b.created_at DESC
    `, [currentUserId || null, currentUserId || null])
    return result.rows
}

async function findBookById(id) {
    return db('books').where({ id }).first()
}

async function findBookByIdWithMeta(id, currentUserId) {
    const result = await db.raw(`
        SELECT 
            b.*, 
            COALESCE(lc.like_count, 0)::int AS like_count,
            COALESCE(sc.save_count, 0)::int AS save_count,
            (ul.user_id IS NOT NULL) AS is_liked_by_current_user,
            (uc.user_id IS NOT NULL) AS is_saved_by_current_user
        FROM books b
        LEFT JOIN (
            SELECT book_id, COUNT(*)::int AS like_count
            FROM user_like
            GROUP BY book_id
        ) lc ON lc.book_id = b.id
        LEFT JOIN (
            SELECT book_id, COUNT(*)::int AS save_count
            FROM user_collection
            GROUP BY book_id
        ) sc ON sc.book_id = b.id
        LEFT JOIN user_like ul ON ul.book_id = b.id AND ul.user_id = ?
        LEFT JOIN user_collection uc ON uc.book_id = b.id AND uc.user_id = ?
        WHERE b.id = ?
        LIMIT 1
    `, [currentUserId || null, currentUserId || null, id])
    return result.rows?.[0] || null
}

module.exports = {
    createBook,
    updateBook,
    findAllBooks,
    findBookById,
    findAllBooksWithMeta,
    findBookByIdWithMeta
}


