exports.up = async function (knex) {
    // users table
    await knex.schema.createTable('users', (t) => {
        t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        t.string('name').notNullable();
        t.string('email').notNullable().unique();
        t.string('password').notNullable();
        t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    // profile table
    await knex.schema.createTable('profile', (t) => {
        t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        t.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE');
        t.jsonb('data').nullable();
        t.timestamp('created_at').defaultTo(knex.fn.now());
        t.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('profile');
    await knex.schema.dropTableIfExists('users');
};



