-- Aggregated read/write helpers for low-latency personalized pages.
-- Apply in Supabase SQL editor before relying on RPC-only execution paths.

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

create or replace function public.get_training_overview(
  include_recent_history boolean default true,
  recent_limit integer default 20
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  user_timezone text := coalesce(
    (select p.timezone from public.profiles p where p.user_id = current_user_id),
    'Europe/Moscow'
  );
  capped_recent_limit integer := greatest(coalesce(recent_limit, 20), 1);
  day_start_utc timestamptz := (date_trunc('day', now() at time zone user_timezone) at time zone user_timezone);
  day_end_utc timestamptz := day_start_utc + interval '1 day';
  payload jsonb;
begin
  if current_user_id is null then
    return jsonb_build_object(
      'timezone', user_timezone,
      'total', 0,
      'summary', '[]'::jsonb,
      'exercises', '[]'::jsonb
    );
  end if;

  with user_exercises as (
    select e.id, e.type, e.goal, e.created_at
    from public.exercises e
    where e.user_id = current_user_id
  ),
  today_totals as (
    select s.exercise_id, sum(s.reps)::integer as today_total
    from public.sets s
    join user_exercises e on e.id = s.exercise_id
    where s.deleted_at is null
      and s.created_at >= day_start_utc
      and s.created_at < day_end_utc
    group by s.exercise_id
  ),
  recent_sets as (
    select
      s.exercise_id,
      s.reps,
      s.created_at,
      row_number() over (partition by s.exercise_id order by s.created_at desc) as rn
    from public.sets s
    join user_exercises e on e.id = s.exercise_id
    where s.deleted_at is null
      and include_recent_history is true
  ),
  recent_rollup as (
    select
      rs.exercise_id,
      max(rs.created_at) as last_set_time,
      coalesce(
        jsonb_agg(rs.reps order by rs.created_at asc),
        '[]'::jsonb
      ) as recent_reps
    from recent_sets rs
    where rs.rn <= capped_recent_limit
    group by rs.exercise_id
  )
  select jsonb_build_object(
    'timezone', user_timezone,
    'total', coalesce(sum(coalesce(tt.today_total, 0)), 0),
    'summary', coalesce(
      jsonb_agg(
        jsonb_build_object(
          'type', e.type,
          'total', coalesce(tt.today_total, 0)
        )
        order by e.created_at
      ),
      '[]'::jsonb
    ),
    'exercises', coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', e.id,
          'type', e.type,
          'goal', e.goal,
          'todayTotal', coalesce(tt.today_total, 0),
          'lastSetTime', rr.last_set_time,
          'recentReps', case
            when include_recent_history then coalesce(rr.recent_reps, '[]'::jsonb)
            else '[]'::jsonb
          end
        )
        order by e.created_at
      ),
      '[]'::jsonb
    )
  )
  into payload
  from user_exercises e
  left join today_totals tt on tt.exercise_id = e.id
  left join recent_rollup rr on rr.exercise_id = e.id;

  return coalesce(
    payload,
    jsonb_build_object(
      'timezone', user_timezone,
      'total', 0,
      'summary', '[]'::jsonb,
      'exercises', '[]'::jsonb
    )
  );
end;
$$;

create or replace function public.get_profile_snapshot()
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  user_timezone text := coalesce(
    (select p.timezone from public.profiles p where p.user_id = current_user_id),
    'Europe/Moscow'
  );
  payload jsonb;
begin
  if current_user_id is null then
    return jsonb_build_object(
      'timezone', user_timezone,
      'exercises', '[]'::jsonb
    );
  end if;

  select jsonb_build_object(
    'timezone', user_timezone,
    'exercises', coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', e.id,
          'type', e.type,
          'goal', e.goal
        )
        order by e.created_at
      ),
      '[]'::jsonb
    )
  )
  into payload
  from public.exercises e
  where e.user_id = current_user_id;

  return coalesce(
    payload,
    jsonb_build_object(
      'timezone', user_timezone,
      'exercises', '[]'::jsonb
    )
  );
end;
$$;

create or replace function public.create_set(
  exercise_id uuid,
  reps integer,
  note text default null,
  source text default 'quickbutton'
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  inserted_set public.sets%rowtype;
begin
  insert into public.sets (exercise_id, reps, note, source)
  values (
    exercise_id,
    reps,
    nullif(trim(note), ''),
    coalesce(nullif(trim(source), ''), 'quickbutton')
  )
  returning *
  into inserted_set;

  return jsonb_build_object(
    'id', inserted_set.id,
    'exercise_id', inserted_set.exercise_id,
    'reps', inserted_set.reps,
    'created_at', inserted_set.created_at,
    'note', inserted_set.note,
    'source', inserted_set.source
  );
end;
$$;

create or replace function public.soft_delete_set(set_id uuid)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  deleted_record record;
begin
  update public.sets
  set deleted_at = now()
  where id = set_id
    and deleted_at is null
  returning id
  into deleted_record;

  if deleted_record is null then
    return null;
  end if;

  return jsonb_build_object('id', deleted_record.id);
end;
$$;

grant execute on function public.get_training_overview(boolean, integer) to authenticated;
grant execute on function public.get_profile_snapshot() to authenticated;
grant execute on function public.create_set(uuid, integer, text, text) to authenticated;
grant execute on function public.soft_delete_set(uuid) to authenticated;
