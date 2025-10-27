const db = require('../db/knex')

async function createUser({ name, email, password, bio }) {
    const existing = await db('users').where({ email }).first()
    if (existing) {
        throw new Error('Email already exist.')
    }
    const [user] = await db('users')
        .insert({ name, email, password, bio })
        .returning(['id', 'name', 'email', 'bio'])
    return user
}

async function findUserByEmail(email) {
    return db('users').where({ email }).first()
}

async function findUserById(id) {
    return db('users').where({ id }).first()
}

async function login(email, password) {
    const user = await findUserByEmail(email)
    if (!user) throw new Error('Email Not Found...')
    if (password !== user.password) throw new Error('Password Incorrect...')
    return user
}

async function getUserCreatedBooks(userId) {
    return db('books').where({ creator: userId }).select('*')
}

async function getUserLikedBooks(userId) {
    return db('books')
        .join('likes', 'books.id', 'likes.book_id')
        .where('likes.user_id', userId)
        .select('books.*')
}

async function addLike(userId, bookId) {
    const exists = await db('likes').where({ user_id: userId, book_id: bookId }).first()
    if (exists) throw new Error('Book is already liked by you.')
    await db('likes').insert({ user_id: userId, book_id: bookId })
    await db('books').where({ id: bookId }).increment('like_count', 1)
}

async function removeLike(userId, bookId) {
    const exists = await db('likes').where({ user_id: userId, book_id: bookId }).first()
    if (!exists) return false
    await db('likes').where({ user_id: userId, book_id: bookId }).del()
    await db('books').where({ id: bookId }).decrement('like_count', 1)
    return true
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    login,
    getUserCreatedBooks,
    getUserLikedBooks,
    addLike,
    removeLike
}


