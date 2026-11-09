-- Run as the database owner against the TurboType development project.
-- Everything, including both synthetic auth identities, rolls back.
begin;
insert into auth.users (id, email, email_confirmed_at)
values
  ('c67da45c-fb98-4477-8422-5d1f7104df01', 'fixture-one@turbotype.invalid', now()),
  ('c67da45c-fb98-4477-8422-5d1f7104df02', 'fixture-two@turbotype.invalid', now());
insert into auth.identities (id, provider_id, user_id, identity_data, provider)
values
  (gen_random_uuid(), 'turbotype-fixture-one', 'c67da45c-fb98-4477-8422-5d1f7104df01', '{"sub":"turbotype-fixture-one","email":"fixture-one@turbotype.invalid"}', 'google'),
  (gen_random_uuid(), 'turbotype-fixture-two', 'c67da45c-fb98-4477-8422-5d1f7104df02', '{"sub":"turbotype-fixture-two","email":"fixture-two@turbotype.invalid"}', 'google');
insert into turbotype_private.approved_players(email)
values ('fixture-one@turbotype.invalid'), ('fixture-two@turbotype.invalid');

set local role authenticated;
select set_config('request.jwt.claim.sub', 'c67da45c-fb98-4477-8422-5d1f7104df01', true);
do $$
declare
  a uuid := 'c67da45c-fb98-4477-8422-5d1f7104df01';
  b uuid := 'c67da45c-fb98-4477-8422-5d1f7104df02';
  candidate jsonb := '{"schemaVersion":1,"rulesVersion":3,"contentVersion":3,"campaign":{"schemaVersion":2,"rulesVersion":3,"clears":{"easy-001":{"revision":1,"stars":7,"bestAccuracy":100}},"bonuses":{}},"history":[],"records":{}}';
begin
  if not public.turbotype_account_approved() then raise exception 'Fixture A approval failed'; end if;
  if public.turbotype_write_save(a, 0, candidate) <> 1 then raise exception 'Save write failed'; end if;
  if public.turbotype_write_save(a, 0, candidate) <> 1 then raise exception 'Retry created duplicate'; end if;
  if (select milestone_xp from public.turbotype_saves where owner = a) <> 45 then
    raise exception 'Milestone reward did not derive from campaign';
  end if;
  begin
    perform public.turbotype_write_save(a, 0, candidate || '{"revision":2}');
    raise exception 'Stale write succeeded';
  exception when sqlstate 'PT409' then null;
  end;
  begin
    perform public.turbotype_write_save(b, 0, candidate);
    raise exception 'Cross-account write succeeded';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.turbotype_saves set milestone_xp = 99999;
    raise exception 'Direct reward mutation succeeded';
  exception when insufficient_privilege then null;
  end;
  perform set_config('request.jwt.claim.sub', b::text, true);
  if exists (select 1 from public.turbotype_saves where owner = a) then
    raise exception 'Cross-account read succeeded';
  end if;
  begin
    perform public.turbotype_delete_save(a);
    raise exception 'Cross-account deletion succeeded';
  exception when insufficient_privilege then null;
  end;
end
$$;

reset role;
delete from turbotype_private.approved_players where email = 'fixture-one@turbotype.invalid';
set local role authenticated;
select set_config('request.jwt.claim.sub', 'c67da45c-fb98-4477-8422-5d1f7104df01', true);
do $$
begin
  if public.turbotype_account_approved() or exists (select 1 from public.turbotype_saves) then
    raise exception 'Removed player retained read access';
  end if;
  perform public.turbotype_delete_save('c67da45c-fb98-4477-8422-5d1f7104df01');
end
$$;
reset role;
set local role anon;
do $$
begin
  begin
    perform public.turbotype_account_approved();
    raise exception 'Anonymous RPC succeeded';
  exception when insufficient_privilege then null;
  end;
end
$$;
reset role;
do $$
begin
  if exists (select 1 from public.turbotype_saves where owner = 'c67da45c-fb98-4477-8422-5d1f7104df01') then
    raise exception 'Owner deletion failed';
  end if;
end
$$;
select 'passed: owner, cross-account, anonymous, removed account, stale revision, retry, deletion' as result;
rollback;
