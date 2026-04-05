# Agent Instructions

Use the repo-scoped MCP servers for infrastructure work in this repository:

- Use `supabase_fitchain` for database schema, generated types, project keys, and Supabase logs.
- `supabase_fitchain` is scoped to project `urlyouruvipktczhaflt` and runs in `read_only=true` mode. Do not rely on it for migrations or other write operations.
- Use `vercel_fitchain` for deployments, runtime/build logs, domains, and environment configuration for Vercel project `ablepovs-projects/fitchain`.
- Prefer these MCP servers over manual dashboard browsing when the task touches Supabase or Vercel.
