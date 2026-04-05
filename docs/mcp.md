# Infrastructure Setup For This Repository

This repository is wired to:

- Supabase project `urlyouruvipktczhaflt`
- Vercel project `ablepovs-projects/fitchain`

## What to use for what

- Use `supabase_fitchain` MCP for schema inspection, generated types, logs, advisors, and read-side debugging.
- Use the Supabase CLI for migrations and remote schema changes.
- Use `vercel_fitchain` MCP for deployments, runtime/build logs, domains, and environment inspection.

The practical reason: MCP wiring in some clients may still be mounted read-only even when the repo config changes. The CLI is the reliable path for write operations.

## Installed CLI workflow

The repo now includes the official Supabase CLI as a dev dependency, so all commands can be run with `npx supabase` or the npm scripts below.

Available scripts in `package.json`:

- `npm run db:link`
- `npm run db:status`
- `npm run db:push`
- `npm run db:push:all`

The initial migration for this project now lives at:

- `supabase/migrations/20260405090349_mobile_training_data_helpers.sql`

## What I still need from you to run remote migrations

I only need 2 secrets:

1. `SUPABASE_ACCESS_TOKEN`
2. The project's Postgres database password

I do not need your publishable key or anon key for migrations.

## Where to get `SUPABASE_ACCESS_TOKEN`

Official CLI reference: https://supabase.com/docs/reference/cli/supabase-snippets-list

Supabase says you can generate an access token here:

- https://supabase.com/dashboard/account/tokens

Steps:

1. Open the link above while logged into the Supabase account that owns this project.
2. Create a new personal access token.
3. Copy the token value. It usually starts with `sbp_`.

## Where to get the database password

Official docs:

- CLI reference: https://supabase.com/docs/reference/cli/supabase-snippets-list
- Password reset guide: https://supabase.com/docs/guides/troubleshooting/how-do-i-reset-my-supabase-database-password-oTs5sB

Supabase documents that the database password is managed from the project's Database Settings page.

Steps:

1. Open your project dashboard.
2. Go to `Database`.
3. Open `Settings`.
4. Find the database password section.
5. If you do not know the current password, reset it there and save the new one.

## Recommended way to give me access on this machine

Best option: set the secrets as user-level environment variables, then restart the agent session.

PowerShell:

```powershell
[Environment]::SetEnvironmentVariable("SUPABASE_ACCESS_TOKEN", "your_sbp_token", "User")
[Environment]::SetEnvironmentVariable("SUPABASE_DB_PASSWORD", "your_database_password", "User")
```

Then restart Codex.

Why this is preferable:

- no secrets go into the repo
- the CLI can use them directly
- `supabase link` and `supabase db push` become scriptable

## Alternative: give me the values directly

If you prefer, you can paste me:

- `SUPABASE_ACCESS_TOKEN`
- database password

Then I can run:

```powershell
npx supabase link --project-ref urlyouruvipktczhaflt
npx supabase db push
```

The CLI docs note that `SUPABASE_DB_PASSWORD` can be supplied via environment variable, which avoids interactive prompts.

## Current status

Already done:

- installed `supabase` CLI locally in the repo
- ran `supabase init`
- created the standard `supabase/` directory
- created the first migration file under `supabase/migrations/`
- added npm scripts for link/status/push

Still blocked:

- remote `supabase link`
- remote `supabase db push`

Both are blocked only by missing auth secrets, not by repo setup anymore.
