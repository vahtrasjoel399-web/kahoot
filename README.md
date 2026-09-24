# Summit Sprint

Summit Sprint is an original, mobile-first live classroom quiz platform. The MVP foundation uses Next.js + TypeScript, PostgreSQL/Prisma persistence, and a server-authoritative game domain designed for Redis and Socket.IO transport.

## Run locally

1. Copy `.env.example` to `.env` and start PostgreSQL (and Redis when the live gateway is enabled).
2. Run `npm install`.
3. Run `npx prisma migrate dev --name init`.
4. Run `npm run dev`, then open `http://localhost:3000`.

## Supabase setup

Create a Supabase project, then copy its Project URL and publishable key from the API settings into `.env`. Copy the Postgres connection URI from the Connect dialog into `DATABASE_URL`, run `npx prisma migrate deploy`, and verify `GET /api/health/supabase`. The browser and server clients use the official `@supabase/ssr` pattern so auth cookies can be added safely later. Never expose a service-role key in browser code.

For Supabase-native deployment, run the SQL in `supabase/migrations/0001_initial.sql` from the SQL editor. It creates the durable quiz/player tables, indexes and owner-only RLS policies. Teacher magic-link login is available at `/login`.

## Domain rules

`src/lib/game/scoring.ts` is the single scoring authority. Progress is round-based and reaches 100% for every active player; leaderboard ordering is score-first with deterministic tie breaks. `state-machine.ts` rejects invalid live-game transitions. The Prisma schema keeps completed-game data durable while active room state is intended for Redis.

The current vertical slice includes real session creation/join APIs, an authoritative room engine, question lifecycle, answer validation, scoring, progress, and leaderboard responses. Active rooms are intentionally kept in the room engine abstraction so the next deployment adapter can replace its Map with Redis without changing game rules.

API: `POST /api/sessions`, `POST /api/sessions/join`, `GET /api/sessions/:id`, and `POST /api/sessions/:id` with `action: start`, `action: next`, or an answer payload. The browser join flow uses the join endpoint and stores the reconnect-safe player credentials in session storage.
# kahoot
