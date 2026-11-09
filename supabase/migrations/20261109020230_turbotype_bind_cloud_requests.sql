drop function public.turbotype_write_save(bigint, jsonb);
drop function public.turbotype_delete_save();

create function public.turbotype_account_approved()
returns boolean language sql stable security invoker set search_path = ''
as $$ select turbotype_private.approved_player() $$;
revoke all on function public.turbotype_account_approved() from public, anon, authenticated;
grant execute on function public.turbotype_account_approved() to authenticated;

create function public.turbotype_write_save(account_id uuid, expected bigint, candidate jsonb)
returns bigint language plpgsql security invoker set search_path = ''
as $$
begin
  if account_id is distinct from auth.uid() then
    raise exception 'Account changed' using errcode = '42501';
  end if;
  return turbotype_private.write_save(expected, candidate);
end
$$;
revoke all on function public.turbotype_write_save(uuid, bigint, jsonb) from public, anon, authenticated;
grant execute on function public.turbotype_write_save(uuid, bigint, jsonb) to authenticated;

create function public.turbotype_delete_save(account_id uuid)
returns void language plpgsql security invoker set search_path = ''
as $$
begin
  if account_id is distinct from auth.uid() then
    raise exception 'Account changed' using errcode = '42501';
  end if;
  perform turbotype_private.delete_save();
end
$$;
revoke all on function public.turbotype_delete_save(uuid) from public, anon, authenticated;
grant execute on function public.turbotype_delete_save(uuid) to authenticated;
