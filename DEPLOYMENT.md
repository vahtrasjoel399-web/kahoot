# Production setup: Vercel + Supabase

## 1. Vercel environment variables

Set these for Production, Preview and Development:

```text
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
DATABASE_URL=your_supabase_postgres_connection_string
```

Never add `SUPABASE_SECRET_KEY` to browser variables or Git.

## 2. Supabase Auth

In **Authentication → URL Configuration** set:

- **Site URL**: your Vercel production URL, for example `https://your-app.vercel.app`
- **Redirect URLs**: `https://your-app.vercel.app/auth/callback` and `http://localhost:3000/auth/callback`

Email/passwordless login is already routed through `/auth/callback`, which exchanges the Supabase code for a session cookie and redirects the teacher to `/dashboard`.

## 3. File import

The current server import accepts PDF, DOCX, CSV and TXT up to 10 MB and converts deterministic CSV or pipe-delimited content into questions.

For AI extraction from arbitrary worksheets, add an `OPENAI_API_KEY` only in Vercel server environment variables, then connect an AI parser to the import route. This key must never use the `NEXT_PUBLIC_` prefix.

## 4. Multiplayer on Vercel

Vercel serverless functions cannot safely hold active rooms in process memory. Add an Upstash Redis database and set:

```text
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

The application already persists active room snapshots, PIN lookups, player joins, answers and leaderboard state through `src/lib/redis/room-store.ts` when these variables are set. Supabase persists quizzes and completed results; Redis powers the active game.
