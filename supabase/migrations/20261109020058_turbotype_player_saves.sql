create schema turbotype_private;
revoke all on schema turbotype_private from public, anon, authenticated;
grant usage on schema turbotype_private to authenticated;

create table turbotype_private.approved_players (
  email text primary key check (email = lower(trim(email)) and length(email) between 3 and 254)
);
alter table turbotype_private.approved_players enable row level security;
revoke all on turbotype_private.approved_players from public, anon, authenticated;

create table public.turbotype_saves (
  owner uuid primary key references auth.users(id) on delete cascade,
  revision bigint not null check (revision > 0),
  updated_at timestamptz not null default statement_timestamp(),
  save jsonb not null check (octet_length(save::text) <= 1048576),
  milestone_xp integer not null check (milestone_xp >= 0),
  milestone_credits integer not null check (milestone_credits >= 0)
);
alter table public.turbotype_saves enable row level security;
revoke all on public.turbotype_saves from public, anon, authenticated;
grant select on public.turbotype_saves to authenticated;

create function turbotype_private.approved_player()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from auth.users u
    join turbotype_private.approved_players a on a.email = lower(u.email)
    join auth.identities i on i.user_id = u.id and i.provider = 'google'
    where u.id = auth.uid() and u.email_confirmed_at is not null
      and lower(i.identity_data->>'email') = a.email
  )
$$;
revoke all on function turbotype_private.approved_player() from public, anon, authenticated;
grant execute on function turbotype_private.approved_player() to authenticated;

create policy turbotype_select_own_save on public.turbotype_saves
  for select to authenticated
  using (owner = (select auth.uid()) and (select turbotype_private.approved_player()));

create function turbotype_private.write_save(expected bigint, candidate jsonb)
returns bigint language plpgsql security definer set search_path = ''
as $$
declare
  player uuid := auth.uid();
  current_save public.turbotype_saves%rowtype;
  category text;
  level_no integer;
  key text;
  entry jsonb;
  star_mask integer;
  stars integer;
  gap boolean;
  count_clears integer := 0;
  count_bonuses integer := 0;
  bonus_key text;
  xp integer := 0;
  credits integer := 0;
begin
  if player is null or not turbotype_private.approved_player() then
    raise exception 'TurboType account is not approved' using errcode = '42501';
  end if;
  if expected is null or expected < 0 or candidate is null or octet_length(candidate::text) > 1048576
    or jsonb_typeof(candidate) is distinct from 'object'
    or candidate->'schemaVersion' is distinct from '1'::jsonb
    or candidate->'rulesVersion' is distinct from '3'::jsonb
    or candidate->'contentVersion' is distinct from '3'::jsonb
    or candidate#>'{campaign,schemaVersion}' is distinct from '2'::jsonb
    or candidate#>'{campaign,rulesVersion}' is distinct from '3'::jsonb
    or jsonb_typeof(candidate#>'{campaign,clears}') is distinct from 'object'
    or jsonb_typeof(candidate#>'{campaign,bonuses}') is distinct from 'object'
    or jsonb_typeof(candidate->'history') is distinct from 'array'
    or jsonb_typeof(candidate->'records') is distinct from 'object'
  then
    raise exception 'Invalid TurboType save' using errcode = '22023';
  end if;
  if jsonb_array_length(candidate->'history') > 100 then
    raise exception 'Invalid TurboType history' using errcode = '22023';
  end if;

  -- Every write for a player, including their first save, shares one lock.
  perform pg_advisory_xact_lock(hashtextextended(player::text, 109));
  select * into current_save from public.turbotype_saves where owner = player;
  if current_save.save = candidate then return current_save.revision; end if;
  if coalesce(current_save.revision, 0) <> expected then
    raise exception 'TurboType save revision conflict' using errcode = '40001';
  end if;
  if current_save.updated_at > statement_timestamp() - interval '2 seconds' then
    raise exception 'TurboType save rate limit' using errcode = '54000';
  end if;

  foreach category in array array['easy', 'medium', 'hard'] loop
    stars := 0;
    gap := false;
    for level_no in 1..100 loop
      key := category || '-' || lpad(level_no::text, 3, '0');
      entry := candidate#>array['campaign','clears',key];
      if entry is null then
        gap := true;
        continue;
      end if;
      if gap or jsonb_typeof(entry) is distinct from 'object'
        or entry->'revision' is distinct from '1'::jsonb
        or coalesce(entry->>'stars', '') not in ('1','3','5','7') then
        raise exception 'Invalid TurboType campaign clear' using errcode = '22023';
      end if;
      star_mask := (entry->>'stars')::int;
      stars := stars + 1 + ((star_mask & 2) / 2) + ((star_mask & 4) / 4);
      count_clears := count_clears + 1;
      xp := xp + 20;
      credits := credits + 5;
      if entry->'bestAccuracy' = '100'::jsonb then xp := xp + 25; end if;
      if level_no % 10 = 5 then xp := xp + 50; credits := credits + 20; end if;
      if level_no % 10 = 0 then
        xp := xp + 100;
        credits := credits + 40;
        bonus_key := category || '-bonus-' || lpad((level_no / 10)::text, 2, '0');
        entry := candidate#>array['campaign','bonuses',bonus_key];
        if entry is not null then
          if entry->'revision' is distinct from '1'::jsonb
            or coalesce(entry->>'stars', '') not in ('1','3','5','7') then
            raise exception 'Invalid TurboType bonus clear' using errcode = '22023';
          end if;
          count_bonuses := count_bonuses + 1;
          xp := xp + 50;
          credits := credits + 10;
        end if;
      end if;
      if level_no = 100 then xp := xp + 500; credits := credits + 100; end if;
    end loop;
    xp := xp + stars / 30 * 100;
    credits := credits + stars / 30 * 25;
  end loop;
  if count_clears <> (select count(*) from jsonb_object_keys(candidate#>'{campaign,clears}'))
    or count_bonuses <> (select count(*) from jsonb_object_keys(candidate#>'{campaign,bonuses}')) then
    raise exception 'Unknown TurboType campaign entry' using errcode = '22023';
  end if;

  insert into public.turbotype_saves(owner, revision, save, milestone_xp, milestone_credits)
    values (player, expected + 1, candidate, xp, credits)
  on conflict (owner) do update set revision = excluded.revision, save = excluded.save,
    milestone_xp = excluded.milestone_xp, milestone_credits = excluded.milestone_credits,
    updated_at = statement_timestamp();
  return expected + 1;
end
$$;
revoke all on function turbotype_private.write_save(bigint, jsonb) from public, anon, authenticated;
grant execute on function turbotype_private.write_save(bigint, jsonb) to authenticated;

create function public.turbotype_write_save(expected bigint, candidate jsonb)
returns bigint language sql security invoker set search_path = ''
as $$ select turbotype_private.write_save(expected, candidate) $$;
revoke all on function public.turbotype_write_save(bigint, jsonb) from public, anon, authenticated;
grant execute on function public.turbotype_write_save(bigint, jsonb) to authenticated;

create function turbotype_private.delete_save()
returns void language plpgsql security definer set search_path = ''
as $$
declare player uuid := auth.uid();
begin
  if player is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  perform pg_advisory_xact_lock(hashtextextended(player::text, 109));
  delete from public.turbotype_saves where owner = player;
end
$$;
revoke all on function turbotype_private.delete_save() from public, anon, authenticated;
grant execute on function turbotype_private.delete_save() to authenticated;

create function public.turbotype_delete_save()
returns void language sql security invoker set search_path = ''
as $$ select turbotype_private.delete_save() $$;
revoke all on function public.turbotype_delete_save() from public, anon, authenticated;
grant execute on function public.turbotype_delete_save() to authenticated;
