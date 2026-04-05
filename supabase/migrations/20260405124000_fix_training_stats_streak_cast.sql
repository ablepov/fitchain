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
  select coalesce(
    count(*) filter (where rd.local_day = (local_today - ((rd.rn - 1)::integer))),
    0
  )::integer
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

grant execute on function public.get_training_stats() to authenticated;
