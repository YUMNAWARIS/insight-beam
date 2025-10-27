# Insight Beam
A full‑stack book review and recommendation app with a Next.js client and a Node/Express API backed by PostgreSQL.

[![Watch the video](https://raw.githubusercontent.com/YUMNAWARIS/insight-beam/main/assets/thumbnail.png)](https://raw.githubusercontent.com/YUMNAWARIS/insight-beam/main/assets/project-screening.mov)

## Project Structure
insight-beam/
├── client/        # Next.js 16 app (TypeScript, React 19, MUI)
├── server/        # Express API (Knex + PostgreSQL)
├── docker-compose.yaml  # Local Postgres + pgAdmin
└── README.md

## Tech Stack
- Client: Next.js 16, React 19, TypeScript, MUI
- Server: Node.js, Express, Knex
- Database: PostgreSQL
- Auth: JWT (Authorization header)

## Prerequisites
- Node.js 20+
- npm 10+
- Docker & Docker Compose (optional but recommended for DB)

## Environment Variables
Create a `.env` file in `server/` with:
```
PORT=4000
JWT_SECRET=replace-with-a-strong-secret
# Prefer DATABASE_URL, otherwise the discrete values below are used
DATABASE_URL=
DB_HOST=localhost
DB_PORT=5432
DB_NAME=insight-beam
DB_USER=insight-beam-db
DB_PASSWORD=insight-beam-password
BASE_URL=http://localhost:4000
```

Create a `.env.local` in `client/` with:
```
NEXT_PUBLIC_API_BASE=http://localhost:4000
```

Notes:
- The client reads `NEXT_PUBLIC_API_BASE` for calling the backend.
- The server requires `JWT_SECRET` and DB settings; it listens on `PORT` (default used in code and examples is 4000).

## Docker (Database Only)
The repo includes `docker-compose.yaml` to run Postgres and pgAdmin locally.

Start services:
```bash
docker-compose up -d
```
- Postgres: `localhost:5432`
- DB name/user/pass: `insight-beam` / `insight-beam-db` / `insight-beam-password`
- pgAdmin: `http://localhost:8888` (email: `yumnaahwaris@gmail.com`, password: `insight-beam-password`)

Stop services:
```bash
docker-compose down
```

## Install & Run (Local)
Server (API):
```bash
cd server
npm install
# optional: run latest migrations if you prefer schema via migrations instead of bootstrap
authentication_note="Schema is also created at runtime via ensureSchema()"
npm run migrate
npm run dev  # starts on PORT (4000 recommended)
```

Client (Next.js):
```bash
cd client
npm install
npm run dev  # starts Next dev server on 3000
```

- Client dev URL: http://localhost:3000
- API base URL: http://localhost:4000

## Server Details
Entry: `server/www/server.js`
- Ensures schema on boot via `ensureSchema()`.
- Starts Express on `PORT`.

Routers (mounted in `server/app.js`):
- `POST /user/login` — login
- `POST /user/signup` — register
- `PATCH /user/profile` — update profile (auth)
- `POST /user/change-password` — change password (auth)
- `POST /book` — create book (auth)
- `PUT /book/:id` — update owned book (auth)
- `GET /book` — list books (optional auth, includes like/save meta when logged in)
- `GET /book/:id` — book detail (optional auth, includes meta)
- `GET /book/mybooks` — books created by me (auth)
- `GET /book/mylikes` — books I liked (auth)
- `POST /like/:id` — like a book (auth)
- `DELETE /like/:id` — unlike a book (auth)
- `POST /collection/:id` — save a book to my collection (auth)
- `DELETE /collection/:id` — remove a book from my collection (auth)
- `GET /collection` — my collection (auth)
- `GET /collection/likes` — my liked books (auth)
- `POST /contact` — submit contact message
- `POST /image/upload_image` — upload profile image (auth, multipart field: `file`)
- `GET /image/:id` — fetch uploaded image

Auth
- Uses JWT with `Authorization` header. The server accepts either `Bearer <token>` or raw `<token>`.
- Tokens are signed with `JWT_SECRET` and read by middleware in `server/Middleware/auth.js`.

Database
- Knex configured in `server/db/knex.js` using `DATABASE_URL` or discrete vars.
- On boot, `ensureSchema()` creates core tables if absent:
  - `users`, `books`, `reviews`, `contacts`, `image_store`, `user_like`, `user_collection`
- Additional migration files exist under `server/migrations/` for a more normalized model (`authors`, `publications`, join tables, etc.). You may choose either runtime bootstrap or formal migrations.

Seeding (optional demo data)
- `server/scripts/backfill-tables.js` demonstrates fetching and inserting data from Open Library into authors/books/publications tables. Requires those tables to exist (via migrations). Run manually if desired.

## Client Details
- Next.js 16 with App Router under `client/app/`
- API proxy routes under `client/app/api/auth/`:
  - `POST /api/auth/login` → forwards to `${NEXT_PUBLIC_API_BASE}/user/login`
  - `POST /api/auth/register` → forwards to `${NEXT_PUBLIC_API_BASE}/user/signup`
  - `GET /api/auth/refresh` → stub
- Auth state stored in `localStorage` (`ib_token`, `ib_user`) via `client/context/AuthContext.tsx`
- Axios instance in `client/lib/axios.ts` uses `NEXT_PUBLIC_API_BASE`; attaches Authorization header if token is present.

## Common Workflows
- Register: `POST /api/auth/register` with `{ name, email, password }` → stores token+user, redirects to `/user/explore`.
- Login: `POST /api/auth/login` with `{ email, password }` → stores token+user, redirects to `/user/explore`.
- Like/Save: client helpers in `client/lib/api.ts` call `/like/:bookId` and `/collection/:bookId` on the server.

## Scripts
Server (`server/package.json`):
- `npm run dev` — nodemon on `www/server.js`
- `npm start` — node `www/server.js`
- `npm run migrate` — run latest knex migrations
- `npm run migrate-down` — rollback last batch
- `npm run create-migration` — create migration file

Client (`client/package.json`):
- `npm run dev` — Next dev server
- `npm run build` — Next build
- `npm start` — Next start
- `npm run lint` — ESlint

## Notes & Security
- Passwords are stored as plain text in current code; for production use, switch to bcrypt hashing in `server/models/user.js` and adjust auth logic accordingly.
- Set a strong `JWT_SECRET` in production and use HTTPS.
- Configure CORS as needed (currently permissive via `cors()` in `server/app.js`).

## License
MIT (or your preferred license)
