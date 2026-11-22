-- =====================================================================
--  Delta Conception — روابط صفحة الموارد (Supabase)
--  شغّل هذا الملف مرة واحدة في: SQL Editor › New query › Run  (آمن للتشغيل أكثر من مرة)
--
--  الروابط التي تضيفها من لوحة الإدارة › «روابط الموارد» وتظهر في صفحة
--  «الموارد والمعجم» تحت عنوان «روابط مفيدة». الزوار يقرؤون الروابط الظاهرة فقط،
--  والأدمن وحده يضيف ويعدّل ويحذف.
-- =====================================================================

create table if not exists public.resource_links (
  id             text primary key,
  title          text not null check (length(title) between 1 and 200),   -- العنوان بالعربية (إلزامي)
  title_en       text,  title_fr       text,
  description    text,  description_en text,  description_fr text,
  url            text not null check (url ~* '^https?://[^[:space:]]+$' and length(url) <= 2000),
  category       text not null default 'learning'
                 check (category in ('software', 'data', 'learning', 'tools', 'other')),
  sort_order     integer not null default 10,
  active         boolean not null default true,   -- false = مخفي عن الزوار
  created_at     timestamptz not null default now()
);
alter table public.resource_links enable row level security;

drop policy if exists "links: anon read" on public.resource_links;
create policy "links: anon read" on public.resource_links
  for select to anon using (active);
drop policy if exists "links: member read" on public.resource_links;
create policy "links: member read" on public.resource_links
  for select to authenticated using (active or public.is_admin());
drop policy if exists "links: admin write" on public.resource_links;
create policy "links: admin write" on public.resource_links
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

revoke all on public.resource_links from anon, authenticated;
grant select on public.resource_links to anon, authenticated;
grant insert, update, delete on public.resource_links to authenticated;
grant select, insert, update, delete on public.resource_links to service_role;

notify pgrst, 'reload schema';
