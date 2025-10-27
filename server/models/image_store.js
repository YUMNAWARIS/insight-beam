const db = require('../db/knex')

async function saveImage({ imageName, imageBuffer, metadata }) {
    const [row] = await db('image_store')
        .insert({ image_name: imageName, image_data: imageBuffer, metadata })
        .returning(['id', 'image_name', 'metadata', 'created_at', 'updated_at'])
    return row
}

async function getImageById(id) {
    return db('image_store').where({ id }).first()
}

module.exports = {
    saveImage,
    getImageById
}


