exports.up = async function (knex) {
    // authors table
    await knex.schema.createTable('authors', (t) => {
        t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        t.string('name').notNullable();
        t.text('bio');
        t.date('birth_date');
        t.string('nationality');
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        t.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    });

    // publications table
    await knex.schema.createTable('publications', (t) => {
        t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        t.string('name').notNullable();
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        t.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    });

    // books table
    await knex.schema.createTable('books', (t) => {
        t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        t.string('title').notNullable();
        t.text('description').notNullable();
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        t.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        t.string('isbn').notNullable().unique();
        t.string('genre').notNullable();
        t.string('language').notNullable();
    });

    // book_authors table
    await knex.schema.createTable('book_authors', (t) => {
        t.uuid('book_id').notNullable().references('books.id').onDelete('CASCADE');
        t.uuid('author_id').notNullable().references('authors.id').onDelete('CASCADE');
        t.primary(['book_id', 'author_id']);
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        t.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    });

    // book_publications table
    await knex.schema.createTable('book_publications', (t) => {
        t.uuid('book_id').notNullable().references('books.id').onDelete('CASCADE');
        t.uuid('publication_id').notNullable().references('publications.id').onDelete('CASCADE');
        t.primary(['book_id', 'publication_id']);
        t.string('publication_date').notNullable();
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        t.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('book_publications');
    await knex.schema.dropTableIfExists('book_authors');
    await knex.schema.dropTableIfExists('books');
    await knex.schema.dropTableIfExists('publications');    
    await knex.schema.dropTableIfExists('authors');
};



