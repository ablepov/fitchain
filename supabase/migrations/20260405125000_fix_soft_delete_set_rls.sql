create or replace function public.soft_delete_set(set_id uuid)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  affected_rows integer := 0;
begin
  update public.sets
  set deleted_at = now()
  where id = set_id
    and deleted_at is null;

  get diagnostics affected_rows = row_count;

  if affected_rows = 0 then
    return null;
  end if;

  return jsonb_build_object('id', set_id);
end;
$$;

grant execute on function public.soft_delete_set(uuid) to authenticated;
