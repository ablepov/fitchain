# MCP setup for this repository

This repository includes project-scoped MCP configuration for:

- `supabase_fitchain`
- `vercel_fitchain`

## Project binding

- Supabase project ref: `urlyouruvipktczhaflt`
- Vercel team/project: `ablepovs-projects/fitchain`

## Where the config lives

- Cursor-style workspace config: `mcp.json`
- Optional local VS Code workspace config: `.vscode/mcp.json` (ignored by git)
- Agent usage instructions: `AGENTS.md`

## Authorization

### Vercel

`vercel_fitchain` uses the official Vercel MCP endpoint and will ask for OAuth authorization on first use.

### Supabase

The repo-level Supabase MCP URL is project-scoped and read-only.

For IDE clients that support Supabase MCP OAuth, authorize in the browser on first use.

For Codex CLI, set a personal access token before starting Codex:

```powershell
$env:SUPABASE_ACCESS_TOKEN = "your_supabase_pat"
```

To persist it for your Windows user profile:

```powershell
[Environment]::SetEnvironmentVariable("SUPABASE_ACCESS_TOKEN", "your_supabase_pat", "User")
```

After setting the token, restart Codex and use `supabase_fitchain`.

## Safety

- Supabase MCP is pinned to this project's ref and uses `read_only=true`.
- The enabled Supabase feature groups are limited to `database`, `debugging`, `development`, and `docs`.
- Vercel MCP is project-specific and currently read-only on the Vercel side.
