-- =====================================================================
--  Delta Conception — إحصائيات الزوار والمسجَّلين
--  شغّل هذا الملف مرة واحدة في: SQL Editor › New query › Run  (آمن للتشغيل أكثر من مرة)
--
--  ما يُسجَّل: نوع الحدث (زيارة صفحة / طلب تسجيل / تحميل كتاب)، الصفحة، مصدر الزيارة (اسم الموقع فقط)،
--  اللغة، نوع الجهاز، المنطقة الزمنية للجهاز، وهل الزائر عضو مسجَّل الدخول.
--  لا يُسجَّل: الاسم، البريد، عنوان IP، ولا أي بيانات شخصية. كل زائر يُعرَف برقم عشوائي محفوظ في متصفحه فقط.
-- =====================================================================

create table if not exists public.site_events (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  kind       text not null default 'view' check (kind in ('view', 'register', 'download')),
  visitor    text not null check (char_length(visitor) between 8 and 64),
  session    text check (char_length(session) <= 64),
  path       text check (char_length(path) <= 200),
  item       text check (char_length(item) <= 200),
  ref_host   text check (char_length(ref_host) <= 120),
  lang       text check (char_length(lang) <= 8),
  device     text check (device in ('mobile', 'tablet', 'desktop')),
  tz         text check (char_length(tz) <= 64),
  member     boolean not null default false
);
create index if not exists site_events_created_idx on public.site_events (created_at);
create index if not exists site_events_visitor_idx on public.site_events (visitor, created_at);
alter table public.site_events enable row level security;

-- أي زائر يستطيع إضافة حدث (بدون قراءة أي شيء)؛ الأدمن وحده يقرأ ويحذف
drop policy if exists "site_events: anyone insert" on public.site_events;
create policy "site_events: anyone insert" on public.site_events
  for insert to anon, authenticated with check (true);

drop policy if exists "site_events: admin read" on public.site_events;
create policy "site_events: admin read" on public.site_events
  for select to authenticated using (public.is_admin());

drop policy if exists "site_events: admin delete" on public.site_events;
create policy "site_events: admin delete" on public.site_events
  for delete to authenticated using (public.is_admin());

revoke all on public.site_events from anon, authenticated;
-- الإضافة محصورة في هذه الأعمدة: لا يستطيع الزائر تزوير التاريخ (created_at) أو الرقم (id)
grant insert (kind, visitor, session, path, item, ref_host, lang, device, tz, member)
  on public.site_events to anon, authenticated;
grant select, delete on public.site_events to authenticated;

-- حماية بسيطة من الإغراق: أكثر من 30 حدثاً في الدقيقة من الزائر نفسه تُهمَل بصمت
create or replace function public.site_events_guard()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.site_events
      where visitor = new.visitor and created_at > now() - interval '1 minute') >= 30 then
    return null;
  end if;
  return new;
end $$;
revoke execute on function public.site_events_guard() from public, anon, authenticated;

drop trigger if exists site_events_guard on public.site_events;
create trigger site_events_guard before insert on public.site_events
  for each row execute function public.site_events_guard();

-- تقرير الإحصائيات للوحة الإدارة (للأدمن فقط): p_days = عدد الأيام، p_tz = المنطقة الزمنية لحساب الأيام
create or replace function public.site_stats(p_days int default 30, p_tz text default 'UTC')
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  v_tz    text := case when exists (select 1 from pg_catalog.pg_timezone_names where name = p_tz) then p_tz else 'UTC' end;
  v_days  int  := greatest(1, least(coalesce(p_days, 30), 730));
  v_today date;
  v_from  date;
  v_since timestamptz;
  res     jsonb;
begin
  if not public.is_admin() then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  v_today := (now() at time zone v_tz)::date;
  v_from  := v_today - (v_days - 1);
  v_since := v_from::timestamp at time zone v_tz;

  with ev as (
    select e.kind, e.visitor, e.session, e.path, e.item, e.ref_host, e.lang, e.device, e.tz, e.member,
           (e.created_at at time zone v_tz)::date as day
    from public.site_events e where e.created_at >= v_since
  ),
  firsts as (
    select visitor, (min(created_at) at time zone v_tz)::date as first_day
    from public.site_events where kind = 'view' group by visitor
  ),
  trainees as (
    select active, created_at, (created_at at time zone v_tz)::date as day
    from public.profiles where role <> 'admin'
  ),
  days as (
    select g::date as day from generate_series(v_from::timestamp, v_today::timestamp, interval '1 day') g
  ),
  per_day as (
    select day,
           count(distinct visitor) filter (where kind = 'view') as visitors,
           count(*) filter (where kind = 'view') as views,
           count(*) filter (where kind = 'register') as registers,
           count(*) filter (where kind = 'download') as downloads
    from ev group by day
  ),
  new_per_day as (select first_day as day, count(*) as c from firsts where first_day >= v_from group by 1),
  mem_per_day as (select day, count(*) as c from trainees where day >= v_from group by 1)
  select jsonb_build_object(
    'range', jsonb_build_object('days', v_days, 'from', v_from, 'to', v_today, 'tz', v_tz),
    'totals', (select jsonb_build_object(
        'visitors',  count(distinct visitor) filter (where kind = 'view'),
        'views',     count(*) filter (where kind = 'view'),
        'sessions',  count(distinct session) filter (where kind = 'view'),
        'member_visitors', count(distinct visitor) filter (where kind = 'view' and member),
        'registers', count(*) filter (where kind = 'register'),
        'downloads', count(*) filter (where kind = 'download')) from ev),
    'today', (select jsonb_build_object('visitors', count(distinct visitor), 'views', count(*))
              from ev where kind = 'view' and day = v_today),
    'online', (select count(distinct visitor) from public.site_events where created_at > now() - interval '5 minutes'),
    'new_visitors', (select count(*) from firsts where first_day >= v_from),
    'all_time', (select jsonb_build_object('visitors', count(distinct visitor), 'views', count(*),
                                            'since', (min(created_at) at time zone v_tz)::date)
                 from public.site_events where kind = 'view'),
    'members', (select jsonb_build_object(
        'total',  count(*),
        'active', count(*) filter (where active),
        'new',    count(*) filter (where created_at >= v_since),
        'before', count(*) filter (where created_at < v_since)) from trainees),
    'daily', (select coalesce(jsonb_agg(jsonb_build_object(
        'day', d.day,
        'visitors',  coalesce(p.visitors, 0),
        'views',     coalesce(p.views, 0),
        'new',       coalesce(n.c, 0),
        'registers', coalesce(p.registers, 0),
        'downloads', coalesce(p.downloads, 0),
        'members',   coalesce(m.c, 0)
      ) order by d.day), '[]'::jsonb)
      from days d left join per_day p on p.day = d.day
                  left join new_per_day n on n.day = d.day
                  left join mem_per_day m on m.day = d.day),
    'pages', (select coalesce(jsonb_agg(jsonb_build_object('k', k, 'n', n, 'v', v) order by n desc), '[]'::jsonb) from (
        select coalesce(path, '') as k, count(*) as n, count(distinct visitor) as v
        from ev where kind = 'view' group by 1 order by 2 desc limit 15) t),
    'sources', (select coalesce(jsonb_agg(jsonb_build_object('k', k, 'n', n, 'v', v) order by v desc), '[]'::jsonb) from (
        select coalesce(ref_host, '') as k, count(*) as n, count(distinct visitor) as v
        from ev where kind = 'view' group by 1 order by 3 desc limit 12) t),
    'devices', (select coalesce(jsonb_agg(jsonb_build_object('k', k, 'v', v) order by v desc), '[]'::jsonb) from (
        select coalesce(device, '') as k, count(distinct visitor) as v
        from ev where kind = 'view' group by 1) t),
    'langs', (select coalesce(jsonb_agg(jsonb_build_object('k', k, 'v', v) order by v desc), '[]'::jsonb) from (
        select coalesce(lang, '') as k, count(distinct visitor) as v
        from ev where kind = 'view' group by 1) t),
    'zones', (select coalesce(jsonb_agg(jsonb_build_object('k', k, 'v', v) order by v desc), '[]'::jsonb) from (
        select coalesce(tz, '') as k, count(distinct visitor) as v
        from ev where kind = 'view' group by 1 order by 2 desc limit 12) t),
    'books', (select coalesce(jsonb_agg(jsonb_build_object('k', k, 'n', n) order by n desc), '[]'::jsonb) from (
        select coalesce(item, '') as k, count(*) as n
        from ev where kind = 'download' group by 1 order by 2 desc limit 10) t),
    'reg_courses', (select coalesce(jsonb_agg(jsonb_build_object('k', k, 'n', n) order by n desc), '[]'::jsonb) from (
        select coalesce(item, '') as k, count(*) as n
        from ev where kind = 'register' group by 1 order by 2 desc limit 10) t)
  ) into res;
  return res;
end $$;

revoke execute on function public.site_stats(int, text) from public, anon;
grant execute on function public.site_stats(int, text) to authenticated;
