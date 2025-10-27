exports.up = async function (knex) {
    // user_like table (replaces prior generic likes usage)
    await knex.schema.createTable('user_like', (t) => {
        t.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE');
        t.uuid('book_id').notNullable().references('books.id').onDelete('CASCADE');
        t.primary(['user_id', 'book_id']);
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });

    // user_collection table
    await knex.schema.createTable('user_collection', (t) => {
        t.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE');
        t.uuid('book_id').notNullable().references('books.id').onDelete('CASCADE');
        t.primary(['user_id', 'book_id']);
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('user_collection');
    await knex.schema.dropTableIfExists('user_like');
};




