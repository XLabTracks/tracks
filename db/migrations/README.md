# Migrations

Schema changes are numbered SQL files here, applied **by hand** with `psql`
before the code that depends on them is deployed. PlanetScale for Postgres has
no deploy requests or safe migrations, and `prisma migrate` must never be run
against prod — `prisma/schema.prisma` is the client's view of the schema, these
files are the schema.

```
psql "<direct-5432 admin url>" -f db/migrations/<file>.sql
```

The **admin** role, not the app role: `pscale_api_*` has no DDL rights, by
design. The direct port (5432), not the pooled one.

Every file is written to be re-runnable (`CREATE TABLE IF NOT EXISTS`, guarded
`CREATE TYPE`), so applying one twice is not a mistake — and the only way to
know what a database is actually carrying is to ask it:

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

## Before you merge something that reads a new table

A green Cloudflare build proves the code compiles. It does not touch the
database: no build step signs in, so no authenticated route is exercised, and a
missing table shows up for the first time as a 500 in front of a learner.

So, in order:

1. Apply the migration with the admin role.
2. Confirm it landed (the query above).
3. Set any secret the feature needs (`wrangler secret put …`).
4. Merge, and let the deploy run.
5. Sign in on the deployed site and exercise the route once.

## What each feature needs

These are the surfaces that read a hand-applied table, and what they do while
it is absent. None of them 500 — the site keeps working without the account
and says so — but none of them *work*, either.

| Migration | Feature | Without it |
| --- | --- | --- |
| `20260805120000_verification_state.sql` | Progress / notebook / highlights / memo drafts on the account (`/api/verification/state`) | 503 with `unavailable: true`; `sync.js` stays on localStorage silently |
| `20260805150000_verification_applications.sql` | Cohort applications (`/verification/enroll`, `/verification/applications`) | The page says the table is not ready rather than pretending to have saved |
| `20260805213000_verification_capstone_signups.sql` | Capstone sign-ups (`/verification/capstone-signup`, `/verification/capstone-signups`) | Same: the sign-up says it is not ready |
| `20260812193000_grading_attempts.sql` | Reasoning-transparency LLM feedback | Grading fails closed with a database-upgrade message; no unmetered call is made |

Secrets those same features need, set with `wrangler secret put`:

- `VERIFICATION_REVIEWERS` — comma-separated emails. It **fails closed**: unset
  means nobody is a reviewer and `/verification/applications` and
  `/verification/capstone-signups` 404 for everyone, including whoever
  deployed them.

One non-database deploy prerequisite lives here so the checklist is one list:

- `/api/verification/define` (the vocabulary lookup) fans out to Wikipedia,
  Wiktionary and LessWrong for signed-out visitors, throttled only by a
  per-isolate in-memory window — on Workers, isolates multiply with load, so
  that cap is a courtesy, not a bound. Its comment names Cloudflare as the
  outer abuse boundary: put a Cloudflare rate-limiting rule on that path (the
  dashboard, not this repo) before pointing real traffic at the course, or
  the site's UA is an open fan-out proxy against Wikimedia's goodwill.
