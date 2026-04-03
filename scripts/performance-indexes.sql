-- Performance indexes for the current server-rendered home/profile/dashboard queries.
-- Run manually in Supabase SQL editor during a low-traffic window.

create index if not exists idx_exercises_user_created_at
  on public.exercises (user_id, created_at);

create unique index if not exists idx_exercises_user_lower_type_unique
  on public.exercises (user_id, lower(type));

create index if not exists idx_sets_exercise_created_at_active
  on public.sets (exercise_id, created_at desc)
  where deleted_at is null;

create index if not exists idx_sets_created_at_active
  on public.sets (created_at desc)
  where deleted_at is null;
