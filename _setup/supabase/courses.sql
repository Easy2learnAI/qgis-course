-- =====================================================================
--  Delta Conception — الدورات الإضافية (Supabase)
--  شغّل هذا الملف مرة واحدة في: SQL Editor › New query › Run  (آمن للتشغيل أكثر من مرة)
--
--  دورة QGIS الأولى مكتوبة في الموقع نفسه (assets/js/courses-data.js).
--  هذا الجدول للدورات التي تضيفها لاحقاً من لوحة الإدارة › «الدورات».
-- =====================================================================

create table if not exists public.courses (
  id           text primary key,
  title        text not null,          -- العنوان بالعربية (إلزامي)
  title_en     text,  title_fr     text,
  tagline      text,  tagline_en   text,  tagline_fr   text,
  summary      text,  summary_en   text,  summary_fr   text,
  level        text,  level_en     text,  level_fr     text,
  duration     text,  duration_en  text,  duration_fr  text,
  features     text[] not null default '{}',
  features_en  text[] not null default '{}',
  features_fr  text[] not null default '{}',
  software     text[] not null default '{}',
  category     text not null default 'gis',
  status       text not null default 'open' check (status in ('open', 'soon')),
  details_url  text,
  sort_order   integer not null default 10,
  active       boolean not null default true,   -- false = مخفية عن الزوار
  created_at   timestamptz not null default now()
);
alter table public.courses enable row level security;

drop policy if exists "courses: anon read" on public.courses;
create policy "courses: anon read" on public.courses
  for select to anon using (active);
drop policy if exists "courses: member read" on public.courses;
create policy "courses: member read" on public.courses
  for select to authenticated using (active or public.is_admin());
drop policy if exists "courses: admin write" on public.courses;
create policy "courses: admin write" on public.courses
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.courses to anon, authenticated;
grant insert, update, delete on public.courses to authenticated;
grant select, insert, update, delete on public.courses to service_role;

notify pgrst, 'reload schema';
