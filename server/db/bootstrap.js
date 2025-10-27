const db = require('./knex')

async function ensureSchema() {
    // enable pgcrypto for gen_random_uuid()
    await db.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto')
    // users table
    const hasUsers = await db.schema.hasTable('users')
    if (!hasUsers) {
        await db.schema.createTable('users', (t) => {
            t.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'))
            t.string('name').notNullable()
            t.string('email').notNullable().unique()
            t.text('bio')
            t.string('password').notNullable()
            t.timestamp('created_at').defaultTo(db.fn.now())
        })
    }

    // books table
    const hasBooks = await db.schema.hasTable('books')
    if (!hasBooks) {
        await db.schema.createTable('books', (t) => {
            t.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'))
            t.string('title').notNullable()
            t.string('author').notNullable()
            t.text('description').notNullable()
            t.string('publisher').notNullable()
            t.string('isbn').notNullable().unique()
            t.integer('like_count').notNullable().defaultTo(0)
            t.uuid('creator').references('users.id').onDelete('SET NULL')
            t.string('purchase_link')
            t.string('imaged_link')
            t.timestamp('created_at').defaultTo(db.fn.now())
        })
    }

    // likes join table
    const hasLikes = await db.schema.hasTable('likes')
    if (!hasLikes) {
        await db.schema.createTable('likes', (t) => {
            t.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE')
            t.uuid('book_id').notNullable().references('books.id').onDelete('CASCADE')
            t.primary(['user_id', 'book_id'])
            t.timestamp('created_at').defaultTo(db.fn.now())
        })
    }

    // reviews table (was embedded in Mongo)
    const hasReviews = await db.schema.hasTable('reviews')
    if (!hasReviews) {
        await db.schema.createTable('reviews', (t) => {
            t.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'))
            t.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE')
            t.uuid('book_id').notNullable().references('books.id').onDelete('CASCADE')
            t.text('review_message')
            t.timestamp('created_at').defaultTo(db.fn.now())
        })
    }

    // contacts table
    const hasContacts = await db.schema.hasTable('contacts')
    if (!hasContacts) {
        await db.schema.createTable('contacts', (t) => {
            t.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'))
            t.string('name').notNullable()
            t.string('email').notNullable()
            t.text('message').notNullable()
            t.timestamp('created_at').defaultTo(db.fn.now())
        })
    }
}

module.exports = { ensureSchema }


