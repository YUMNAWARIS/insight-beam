const db = require('../db/knex')

async function createUser({ name, email, password }) {
    const existing = await db('users').where({ email }).first()
    if (existing) {
        throw new Error('Email already exist.')
    }
    const [user] = await db('users')
        .insert({ name, email, password })
        .returning(['id', 'name', 'email'])
    const [profile] = await db('profile').insert({ user_id: user.id }).returning(['id', 'user_id', 'data'])
    return {
        ...user,
        profile: profile || null
    }
}

async function getUserProfile(userId) {
    const profile = await db('profile').where({ user_id: userId }).first()
    return profile
}

async function upsertUserProfile(userId, profileData) {
    const existing = await db('profile').where({ user_id: userId }).first()
    if (existing) {
        const [updated] = await db('profile')
            .where({ user_id: userId })
            .update({ data: { ...existing.data, ...profileData }, updated_at: db.fn.now() })
            .returning(['id', 'user_id', 'data', 'updated_at'])
        return updated
    }
    const [created] = await db('profile')
        .insert({ user_id: userId, data: profileData })
        .returning(['id', 'user_id', 'data', 'updated_at'])
    return created
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

async function changePassword(userId, oldPassword, newPassword) {
    const user = await findUserById(userId)
    if (!user) {
        throw new Error('User not found')
    }
    if (user.password !== oldPassword) {
        throw new Error('Old password is incorrect')
    }
    await db('users').where({ id: userId }).update({ password: newPassword })
    return true
}

async function updateUserProfile(userId, profileData) {
    const existing = await db('profile').where({ user_id: userId }).first()
    if (!existing) {
        const [created] = await db('profile')
            .insert({ user_id: userId, data: profileData })
            .returning(['id', 'user_id', 'data', 'updated_at'])
        return created
    }
    const [updated] = await db('profile')
        .where({ user_id: userId })
        .update({ data: { ...existing.data, ...profileData }, updated_at: db.fn.now() })
        .returning(['id', 'user_id', 'data', 'updated_at'])
    return updated
}

module.exports = {
    createUser,
    getUserProfile,
    upsertUserProfile,
    findUserByEmail,
    findUserById,
    login,
    getUserCreatedBooks,
    getUserLikedBooks,
    addLike,
    removeLike,
    changePassword,
    updateUserProfile
}


