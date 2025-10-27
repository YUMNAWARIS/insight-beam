exports.up = async function (knex) {
    await knex.schema.createTable('image_store', (t) => {
        t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
        t.string('image_name').notNullable()
        t.binary('image_data').notNullable()
        t.jsonb('metadata').nullable()
        t.timestamp('created_at').defaultTo(knex.fn.now())
        t.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('image_store')
}


