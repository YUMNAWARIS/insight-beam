// seed.js

const axios = require('axios');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'insight-beam-db',
  password: process.env.PG_PASS || 'insight-beam-password',
  database: process.env.DB_NAME || 'insight-beam'
});

async function fetchBooks(limit = 100, page = 1) {
  const resp = await axios.get('https://openlibrary.org/search.json', {
    params: {
      q: 'the',       // generic query to retrieve many books; you could vary this
      page: page,
      limit: Math.min(limit, 100),
    },
    headers: {
      'User-Agent': 'InsightBeamSeedScript/1.0 (your.email@example.com)'
    }
  });
  return resp.data.docs;
}

async function fetchAuthor(authorKey) {
  const resp = await axios.get(`https://openlibrary.org${authorKey}.json`, {
    headers: {
      'User-Agent': 'InsightBeamSeedScript/1.0 (your.email@example.com)'
    }
  });
  return resp.data;
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // You might want to clear old data
    // await client.query('TRUNCATE book_authors, books, authors, publications CASCADE');

    const books = await fetchBooks(100, 1);

    const authorMap = new Map();      // key: authorKey, value: author_id
    const publicationMap = new Map(); // key: publisherName, value: publication_id
    let nextAuthorId = 1;
    let nextPubId = 1;

    for (const b of books) {
      const title = b.title;
      const description = b.first_sentence ? (typeof b.first_sentence === 'string' ? b.first_sentence : b.first_sentence.join(' ')) : null;
      const published_year = b.first_publish_year || null;
      const isbn = (b.isbn && b.isbn[0]) || null;
      const language = (b.language && b.language[0]) || null;
      const publisherList = b.publisher || [];
      const authorsList = b.author_key || [];

      // Pick first publisher for simplicity
      const publisherName = publisherList[0] || 'Unknown Publisher';

      // Insert or reuse publication
      let pubId;
      if (publicationMap.has(publisherName)) {
        pubId = publicationMap.get(publisherName);
      } else {
        const insertPub = await client.query(
          `INSERT INTO publications (name, created_at, updated_at) VALUES ($1, NOW(), NOW()) RETURNING publication_id`,
          [publisherName]
        );
        pubId = insertPub.rows[0].publication_id;
        publicationMap.set(publisherName, pubId);
      }

      // Insert book
      const insertBook = await client.query(
        `INSERT INTO books (title, description, published_year, isbn, genre, language, publication_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         RETURNING book_id`,
        [title, description, published_year, isbn, null, language, pubId]
      );
      const bookId = insertBook.rows[0].book_id;

      // For each author
      for (const authKey of authorsList) {
        let authId;
        if (authorMap.has(authKey)) {
          authId = authorMap.get(authKey);
        } else {
          // Fetch author details
          try {
            const authData = await fetchAuthor(`/authors/${authKey}`);
            const name = authData.name;
            const bio = authData.bio ? (typeof authData.bio === 'string' ? authData.bio : authData.bio.value) : null;
            const birth_date = authData.birth_date || null;
            const nationality = null; // OpenLibrary may not provide direct nationality

            const insertAuth = await client.query(
              `INSERT INTO authors (name, bio, birth_date, nationality, created_at, updated_at)
               VALUES ($1, $2, $3, $4, NOW(), NOW())
               RETURNING author_id`,
              [name, bio, birth_date, nationality]
            );
            authId = insertAuth.rows[0].author_id;
            authorMap.set(authKey, authId);
          } catch (err) {
            console.error('Error fetching author', authKey, err);
            continue;
          }
        }

        // Insert into join table
        await client.query(
          `INSERT INTO book_authors (book_id, author_id)
           VALUES ($1, $2)`,
          [bookId, authId]
        );
      }
    }

    await client.query('COMMIT');
    console.log('Seed complete: inserted', books.length, 'books');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

main().catch(err => console.error('Unexpected error', err));
