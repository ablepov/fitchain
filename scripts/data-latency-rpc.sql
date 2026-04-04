-- Mobile-first training data helpers.
-- Apply in the Supabase SQL editor before relying on RPC-only execution paths.

create extension if not exists pgcrypto;

create table if not exists public.exercise_schedule (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  position integer not null default 0,
  created_at timestamptz not null default now()
);

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

create index if not exists idx_exercise_schedule_user_weekday_position
  on public.exercise_schedule (user_id, weekday, position, created_at);

create index if not exists idx_exercise_schedule_exercise_id
  on public.exercise_schedule (exercise_id);

create unique index if not exists idx_exercise_schedule_user_weekday_exercise_unique
  on public.exercise_schedule (user_id, weekday, exercise_id);

alter table public.exercise_schedule enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'exercise_schedule'
      and policyname = 'exercise_schedule_select_own'
  ) then
    create policy exercise_schedule_select_own
      on public.exercise_schedule
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'exercise_schedule'
      and policyname = 'exercise_schedule_insert_own'
  ) then
    create policy exercise_schedule_insert_own
      on public.exercise_schedule
      for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'exercise_schedule'
      and policyname = 'exercise_schedule_update_own'
  ) then
    create policy exercise_schedule_update_own
      on public.exercise_schedule
      for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'exercise_schedule'
      and policyname = 'exercise_schedule_delete_own'
  ) then
    create policy exercise_schedule_delete_own
      on public.exercise_schedule
      for delete
      using (auth.uid() = user_id);
  end if;
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
begin
  return jsonb_build_object(
    'timezone', user_timezone
  );
end;
$$;

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
  local_today date := (now() at time zone user_timezone)::date;
  local_chart_start date := local_today - 6;
  today_start_utc timestamptz := (local_today::timestamp at time zone user_timezone);
  tomorrow_start_utc timestamptz := ((local_today + 1)::timestamp at time zone user_timezone);
  chart_start_utc timestamptz := (local_chart_start::timestamp at time zone user_timezone);
  today_weekday smallint := extract(dow from local_today)::smallint;
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
  schedule_today as (
    select es.exercise_id, es.position
    from public.exercise_schedule es
    where es.user_id = current_user_id
      and es.weekday = today_weekday
  ),
  schedule_weekdays as (
    select
      es.exercise_id,
      array_agg(es.weekday order by es.weekday) as weekdays
    from public.exercise_schedule es
    where es.user_id = current_user_id
    group by es.exercise_id
  ),
  today_totals as (
    select s.exercise_id, sum(s.reps)::integer as today_total
    from public.sets s
    join user_exercises e on e.id = s.exercise_id
    where s.deleted_at is null
      and s.created_at >= today_start_utc
      and s.created_at < tomorrow_start_utc
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
      coalesce(jsonb_agg(rs.reps order by rs.created_at asc), '[]'::jsonb) as recent_reps
    from recent_sets rs
    where rs.rn <= capped_recent_limit
    group by rs.exercise_id
  ),
  chart_days as (
    select generate_series(local_chart_start, local_today, interval '1 day')::date as local_day
  ),
  chart_totals as (
    select
      s.exercise_id,
      (s.created_at at time zone user_timezone)::date as local_day,
      sum(s.reps)::integer as total
    from public.sets s
    join user_exercises e on e.id = s.exercise_id
    where s.deleted_at is null
      and s.created_at >= chart_start_utc
      and s.created_at < tomorrow_start_utc
    group by s.exercise_id, (s.created_at at time zone user_timezone)::date
  ),
  chart_rollup as (
    select
      e.id as exercise_id,
      jsonb_agg(coalesce(ct.total, 0) order by d.local_day) as chart
    from user_exercises e
    cross join chart_days d
    left join chart_totals ct
      on ct.exercise_id = e.id
     and ct.local_day = d.local_day
    group by e.id
  ),
  exercise_rows as (
    select
      e.id,
      e.type,
      e.goal,
      e.created_at,
      coalesce(tt.today_total, 0) as today_total,
      rr.last_set_time,
      case
        when include_recent_history then coalesce(rr.recent_reps, '[]'::jsonb)
        else '[]'::jsonb
      end as recent_reps,
      coalesce(cr.chart, '[]'::jsonb) as chart,
      to_jsonb(coalesce(sw.weekdays, array[]::smallint[])) as scheduled_weekdays,
      case when st.exercise_id is null then 1 else 0 end as sort_group,
      coalesce(st.position, 999999) as sort_position
    from user_exercises e
    left join today_totals tt on tt.exercise_id = e.id
    left join recent_rollup rr on rr.exercise_id = e.id
    left join chart_rollup cr on cr.exercise_id = e.id
    left join schedule_weekdays sw on sw.exercise_id = e.id
    left join schedule_today st on st.exercise_id = e.id
  )
  select jsonb_build_object(
    'timezone', user_timezone,
    'total', coalesce((select sum(er.today_total) from exercise_rows er), 0),
    'summary', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'type', er.type,
            'total', er.today_total
          )
          order by er.sort_group, er.sort_position, er.created_at
        )
        from exercise_rows er
      ),
      '[]'::jsonb
    ),
    'exercises', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', er.id,
            'type', er.type,
            'goal', er.goal,
            'todayTotal', er.today_total,
            'lastSetTime', er.last_set_time,
            'recentReps', er.recent_reps,
            'chart', er.chart,
            'scheduledWeekdays', er.scheduled_weekdays
          )
          order by er.sort_group, er.sort_position, er.created_at
        )
        from exercise_rows er
      ),
      '[]'::jsonb
    )
  )
  into payload;

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

create or replace function public.get_weekly_plan()
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
  with days as (
    select generate_series(0, 6)::smallint as weekday
  ),
  day_items as (
    select
      d.weekday,
      coalesce(
        jsonb_agg(
          jsonb_build_object(
            'scheduleId', es.id,
            'exerciseId', e.id,
            'type', e.type,
            'goal', e.goal,
            'position', es.position
          )
          order by es.position, es.created_at, e.created_at
        ) filter (where es.id is not null),
        '[]'::jsonb
      ) as items
    from days d
    left join public.exercise_schedule es
      on es.weekday = d.weekday
     and es.user_id = current_user_id
    left join public.exercises e
      on e.id = es.exercise_id
    group by d.weekday
  )
  select jsonb_build_object(
    'timezone', user_timezone,
    'days', coalesce(
      jsonb_agg(
        jsonb_build_object(
          'weekday', di.weekday,
          'items', di.items
        )
        order by di.weekday
      ),
      '[]'::jsonb
    )
  )
  into payload
  from day_items di;

  return coalesce(
    payload,
    jsonb_build_object(
      'timezone', user_timezone,
      'days', '[]'::jsonb
    )
  );
end;
$$;

create or replace function public.build_training_stats_period(
  target_user_id uuid,
  user_timezone text,
  period_start timestamptz default null,
  period_end timestamptz default null
)
returns jsonb
language sql
security invoker
set search_path = public
as $$
  with period_rows as (
    select
      s.exercise_id,
      s.reps,
      s.created_at,
      e.type
    from public.sets s
    join public.exercises e on e.id = s.exercise_id
    where e.user_id = target_user_id
      and s.deleted_at is null
      and (period_start is null or s.created_at >= period_start)
      and (period_end is null or s.created_at < period_end)
  ),
  exercise_totals as (
    select
      pr.exercise_id,
      min(pr.type) as type,
      sum(pr.reps)::integer as total
    from period_rows pr
    group by pr.exercise_id
  ),
  top_exercise as (
    select et.type, et.total
    from exercise_totals et
    order by et.total desc, et.type asc
    limit 1
  )
  select jsonb_build_object(
    'totalReps', coalesce((select sum(pr.reps)::integer from period_rows pr), 0),
    'totalSets', coalesce((select count(*)::integer from period_rows pr), 0),
    'activeDays', coalesce(
      (
        select count(distinct ((pr.created_at at time zone user_timezone)::date))::integer
        from period_rows pr
      ),
      0
    ),
    'exerciseCount', coalesce((select count(distinct pr.exercise_id)::integer from period_rows pr), 0),
    'topExercise', coalesce(
      (
        select jsonb_build_object(
          'type', te.type,
          'total', te.total
        )
        from top_exercise te
      ),
      'null'::jsonb
    )
  );
$$;

create or replace function public.get_training_stats()
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
  local_today date := (now() at time zone user_timezone)::date;
  today_start_utc timestamptz := (local_today::timestamp at time zone user_timezone);
  tomorrow_start_utc timestamptz := ((local_today + 1)::timestamp at time zone user_timezone);
  week_start_local date := date_trunc('week', local_today::timestamp)::date;
  next_week_start_local date := week_start_local + 7;
  month_start_local date := date_trunc('month', local_today::timestamp)::date;
  next_month_start_local date := (date_trunc('month', local_today::timestamp) + interval '1 month')::date;
  week_start_utc timestamptz := (week_start_local::timestamp at time zone user_timezone);
  next_week_start_utc timestamptz := (next_week_start_local::timestamp at time zone user_timezone);
  month_start_utc timestamptz := (month_start_local::timestamp at time zone user_timezone);
  next_month_start_utc timestamptz := (next_month_start_local::timestamp at time zone user_timezone);
  periods_payload jsonb;
  best_day_payload jsonb;
  current_streak_days integer := 0;
  total_exercises integer := 0;
  scheduled_this_week integer := 0;
begin
  if current_user_id is null then
    return jsonb_build_object(
      'timezone', user_timezone,
      'periods', jsonb_build_object(
        'today', jsonb_build_object('totalReps', 0, 'totalSets', 0, 'activeDays', 0, 'exerciseCount', 0, 'topExercise', null),
        'week', jsonb_build_object('totalReps', 0, 'totalSets', 0, 'activeDays', 0, 'exerciseCount', 0, 'topExercise', null),
        'month', jsonb_build_object('totalReps', 0, 'totalSets', 0, 'activeDays', 0, 'exerciseCount', 0, 'topExercise', null),
        'all', jsonb_build_object('totalReps', 0, 'totalSets', 0, 'activeDays', 0, 'exerciseCount', 0, 'topExercise', null)
      ),
      'highlights', jsonb_build_object(
        'currentStreakDays', 0,
        'bestDay', null,
        'totalExercises', 0,
        'scheduledThisWeek', 0
      )
    );
  end if;

  select jsonb_build_object(
    'today', public.build_training_stats_period(current_user_id, user_timezone, today_start_utc, tomorrow_start_utc),
    'week', public.build_training_stats_period(current_user_id, user_timezone, week_start_utc, next_week_start_utc),
    'month', public.build_training_stats_period(current_user_id, user_timezone, month_start_utc, next_month_start_utc),
    'all', public.build_training_stats_period(current_user_id, user_timezone, null, null)
  )
  into periods_payload;

  with all_rows as (
    select
      (s.created_at at time zone user_timezone)::date as local_day,
      sum(s.reps)::integer as total
    from public.sets s
    join public.exercises e on e.id = s.exercise_id
    where e.user_id = current_user_id
      and s.deleted_at is null
    group by (s.created_at at time zone user_timezone)::date
  )
  select
    jsonb_build_object('date', local_day::text, 'total', total)
  into best_day_payload
  from all_rows
  order by total desc, local_day desc
  limit 1;

  with local_days as (
    select distinct (s.created_at at time zone user_timezone)::date as local_day
    from public.sets s
    join public.exercises e on e.id = s.exercise_id
    where e.user_id = current_user_id
      and s.deleted_at is null
      and (s.created_at at time zone user_timezone)::date <= local_today
  ),
  ranked_days as (
    select
      ld.local_day,
      row_number() over (order by ld.local_day desc) as rn
    from local_days ld
  )
  select coalesce(count(*) filter (where rd.local_day = (local_today - (rd.rn - 1))), 0)::integer
  into current_streak_days
  from ranked_days rd;

  select count(*)::integer
  into total_exercises
  from public.exercises e
  where e.user_id = current_user_id;

  select count(*)::integer
  into scheduled_this_week
  from public.exercise_schedule es
  where es.user_id = current_user_id;

  return jsonb_build_object(
    'timezone', user_timezone,
    'periods', periods_payload,
    'highlights', jsonb_build_object(
      'currentStreakDays', coalesce(current_streak_days, 0),
      'bestDay', coalesce(best_day_payload, 'null'::jsonb),
      'totalExercises', coalesce(total_exercises, 0),
      'scheduledThisWeek', coalesce(scheduled_this_week, 0)
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

grant execute on function public.get_profile_snapshot() to authenticated;
grant execute on function public.get_training_overview(boolean, integer) to authenticated;
grant execute on function public.get_weekly_plan() to authenticated;
grant execute on function public.build_training_stats_period(uuid, text, timestamptz, timestamptz) to authenticated;
grant execute on function public.get_training_stats() to authenticated;
grant execute on function public.create_set(uuid, integer, text, text) to authenticated;
grant execute on function public.soft_delete_set(uuid) to authenticated;
