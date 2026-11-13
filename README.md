# Wereb Zjati API

The API serves published categories and church songs (including lyrics and Supabase Storage media URLs) and protects content management with JWT roles. JWTs are intentionally non-expiring; rotate `JWT_SECRET` to revoke all existing sessions.

## First run

Create a Supabase project, run [`supabase/schema.sql`](E:/code/Portfolio%20Project/wereb-zjati-backend/supabase/schema.sql) in the Supabase SQL editor, copy `.env.example` to `.env`, set the project URL, server-only secret key, and a strong `SUPER_ADMIN_PASSWORD`, then run:

```bash
npm install
npm run build
npm start
```

The bootstrap process creates the configured super admin once. A super admin can create additional admins with `POST /api/content/admins`.

## Content endpoints

- `GET /api/content/categories`
- `GET /api/content/songs?categoryId=<id>&search=<term>`
- Admin JWT: `POST/PATCH/DELETE /api/content/categories` and `/api/content/songs`
- Admin JWT bulk import: `POST /api/content/import` with `{ "categories": [], "songs": [] }`; songs can reference a newly imported category by `categoryName`.
- Super-admin JWT: `GET/POST /api/content/admins`

- `POST /api/content/media` (multipart field `file`, admin JWT) uploads audio/cover files to the Supabase `media` bucket and returns a public URL.

The mobile app downloads audio into its app document directory for offline playback. Never put `SUPABASE_SECRET_KEY` in the mobile app; Supabase documents this as a server-only credential.
