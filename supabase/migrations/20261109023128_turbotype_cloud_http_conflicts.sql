-- Keep application-level conflicts distinct from database transaction retries.
create or replace function public.turbotype_write_save(account_id uuid, expected bigint, candidate jsonb)
returns bigint language plpgsql security invoker set search_path = ''
as $$
begin
  if account_id is distinct from auth.uid() then
    raise exception 'Account changed' using errcode = '42501';
  end if;
  return turbotype_private.write_save(expected, candidate);
exception
  when serialization_failure then
    raise exception 'TurboType save revision conflict' using errcode = 'PT409';
  when program_limit_exceeded then
    raise exception 'TurboType save rate limit' using errcode = 'PT429';
end
$$;
