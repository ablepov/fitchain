# CURRENT_STATE

_Last updated: 2026-03-31_

## Repo status
- Branch: `main`
- Working tree: clean
- Local changes pending: none at the time of snapshot

## What is confirmed working in codebase
- Next.js app scaffold is present and structured
- Auth page exists: `app/auth/page.tsx`
- Dashboard page exists: `app/dashboard/page.tsx`
- Profile page exists: `app/profile/page.tsx`
- Header component exists: `components/Header.tsx`
- Quick buttons component exists: `components/QuickButtons.tsx`
- Mini chart component exists: `components/MiniChart.tsx`
- Summary panel exists: `components/SummaryPanel.tsx`
- Supabase client/env helpers exist:
  - `lib/supabaseClient.ts`
  - `lib/supabaseEnv.ts`
  - `lib/env-check.ts`
  - `lib/types.ts`

## Important reality check
The implementation appears to be ahead of `DEVELOPMENT_PLAN.md` in a few places:
- `MiniChart.tsx` already exists, while the plan still marks mini-chart work as incomplete.
- `SummaryPanel.tsx` already exists, while the plan still marks summary work as incomplete.

This means the plan is useful, but it is no longer a perfect reflection of the actual codebase state.

## Environment status
No local env files were found in the repository snapshot:
- no `.env.local`
- no `.env.example`

The code currently expects:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Known risks / unknowns
- Current functionality has not yet been re-verified in a fresh local run during this session.
- `SummaryPanel.tsx` performs multiple Supabase queries in a loop; this may be acceptable for MVP but is not ideal long-term.
- The development plan and codebase are partially out of sync.
- No explicit env template exists yet for handoff/recovery.

## Recommended next step
1. Add `.env.example`
2. Verify local run/build with current codebase
3. Set up Codex MCP config skeleton
4. Connect MCP in this order:
   - Context7
   - Supabase
   - Vercel
   - Playwright later

## Working agreement for development
For new work on `fitchain`, use this cycle:
1. define the task
2. implement in a coding runtime
3. verify
4. commit
5. record the next step
