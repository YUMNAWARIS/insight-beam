import axios from "axios";
import { v4 as uuidv4 } from "uuid";

/**
 * Knex seed script to populate authors, books, publications, and their relations
 * using Open Library API (openlibrary.org)
 */

export const seed = async function (knex) {
  console.log("🚀 Starting seed: books, authors, publications...");

  // Clear existing data (optional)
  await knex("book_publications").del();
  await knex("book_authors").del();
  await knex("books").del();
  await knex("authors").del();
  await knex("publications").del();

  const booksResp = await axios.get("https://openlibrary.org/search.json", {
    params: { q: "science", limit: 100 },
    headers: { "User-Agent": "InsightBeamSeeder/1.0 (your.email@example.com)" },
  });

  const books = booksResp.data.docs;
  const authorsMap = new Map(); // author_key -> id
  const pubsMap = new Map(); // publisher name -> id

  const authorRows = [];
  const publicationRows = [];
  const bookRows = [];
  const bookAuthorRows = [];
  const bookPublicationRows = [];

  for (const b of books) {
    const bookId = uuidv4();

    const title = b.title || "Untitled";
    const description =
      (Array.isArray(b.first_sentence)
        ? b.first_sentence.join(" ")
        : b.first_sentence) ||
      "No description available.";
    const isbn = (b.isbn && b.isbn[0]) || uuidv4().slice(0, 13);
    const genre = (b.subject && b.subject[0]) || "Unknown";
    const language = (b.language && b.language[0]) || "en";
    const publicationDate = b.first_publish_year
      ? b.first_publish_year.toString()
      : "Unknown";

    // --- Insert book ---
    bookRows.push({
      id: bookId,
      title,
      description,
      isbn,
      genre,
      language,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    });

    // --- Handle authors ---
    if (b.author_key && Array.isArray(b.author_key)) {
      for (let i = 0; i < b.author_key.length; i++) {
        const key = b.author_key[i];
        const name = b.author_name ? b.author_name[i] : "Unknown Author";

        if (!authorsMap.has(key)) {
          const id = uuidv4();
          authorsMap.set(key, id);
          authorRows.push({
            id,
            name,
            bio: null,
            birth_date: null,
            nationality: null,
            created_at: knex.fn.now(),
            updated_at: knex.fn.now(),
          });
        }

        bookAuthorRows.push({
          book_id: bookId,
          author_id: authorsMap.get(key),
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        });
      }
    }

    // --- Handle publications ---
    if (b.publisher && Array.isArray(b.publisher)) {
      const publisherName = b.publisher[0];
      if (!pubsMap.has(publisherName)) {
        const id = uuidv4();
        pubsMap.set(publisherName, id);
        publicationRows.push({
          id,
          name: publisherName,
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        });
      }

      bookPublicationRows.push({
        book_id: bookId,
        publication_id: pubsMap.get(publisherName),
        publication_date: publicationDate,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      });
    }
  }

  console.log(`📚 Inserting ${bookRows.length} books`);
  await knex.batchInsert("books", bookRows, 50);

  console.log(`👩‍💻 Inserting ${authorRows.length} authors`);
  await knex.batchInsert("authors", authorRows, 50);

  console.log(`🏢 Inserting ${publicationRows.length} publications`);
  await knex.batchInsert("publications", publicationRows, 50);

  console.log(`🔗 Inserting ${bookAuthorRows.length} book_authors`);
  await knex.batchInsert("book_authors", bookAuthorRows, 100);

  console.log(`📰 Inserting ${bookPublicationRows.length} book_publications`);
  await knex.batchInsert("book_publications", bookPublicationRows, 100);

  console.log("✅ Seed completed successfully!");
};
