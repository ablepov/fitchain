create or replace function public.soft_delete_set(set_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  affected_rows integer := 0;
begin
  if current_user_id is null then
    return null;
  end if;

  update public.sets s
  set deleted_at = now()
  from public.exercises e
  where s.id = set_id
    and s.deleted_at is null
    and e.id = s.exercise_id
    and e.user_id = current_user_id;

  get diagnostics affected_rows = row_count;

  if affected_rows = 0 then
    return null;
  end if;

  return jsonb_build_object('id', set_id);
end;
$$;

grant execute on function public.soft_delete_set(uuid) to authenticated;
