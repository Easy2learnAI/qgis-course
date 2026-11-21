-- =====================================================================
--  دورة QGIS — حسابات المتدرّبين والملفات المحمية (Supabase)
--  شغّل هذا الملف مرة واحدة في: SQL Editor › New query › Run
-- =====================================================================

-- 1) ملف تعريف لكل حساب: الاسم، الدور (admin / trainee)، والحالة (مفعَّل / موقوف)
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  role       text not null default 'trainee' check (role in ('admin', 'trainee')),
  active     boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- ينشأ ملف التعريف تلقائياً مع كل حساب جديد
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- دوال مساعدة تستعملها قواعد الحماية
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles
                 where id = (select auth.uid()) and role = 'admin' and active);
$$;

create or replace function public.is_active_member()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles
                 where id = (select auth.uid()) and active);
$$;

revoke execute on function public.is_admin(), public.is_active_member() from public, anon;

-- قواعد جدول profiles: كل شخص يرى ملفه فقط، والأدمن يرى الجميع ويعدّل
drop policy if exists "profiles: read own or admin" on public.profiles;
create policy "profiles: read own or admin" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());

drop policy if exists "profiles: admin update" on public.profiles;
create policy "profiles: admin update" on public.profiles
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 2) سجلّ الملفات: العنوان الظاهر والقسم (guide / materials)
create table if not exists public.course_files (
  path       text primary key,
  title      text not null,
  folder     text not null default 'materials' check (folder in ('guide', 'materials')),
  size       bigint,
  created_at timestamptz not null default now()
);
alter table public.course_files enable row level security;

drop policy if exists "files: members read" on public.course_files;
create policy "files: members read" on public.course_files
  for select to authenticated using (public.is_active_member());

drop policy if exists "files: admin write" on public.course_files;
create policy "files: admin write" on public.course_files
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 3) المخزن الخاص للملفات (غير عام: لا يُفتح إلا برابط موقَّع مؤقت)
insert into storage.buckets (id, name, public, file_size_limit)
values ('course-files', 'course-files', false, 52428800)
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit;

drop policy if exists "course-files: members read" on storage.objects;
create policy "course-files: members read" on storage.objects
  for select to authenticated
  using (bucket_id = 'course-files' and public.is_active_member());

drop policy if exists "course-files: admin insert" on storage.objects;
create policy "course-files: admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'course-files' and public.is_admin());

drop policy if exists "course-files: admin update" on storage.objects;
create policy "course-files: admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'course-files' and public.is_admin())
  with check (bucket_id = 'course-files' and public.is_admin());

drop policy if exists "course-files: admin delete" on storage.objects;
create policy "course-files: admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'course-files' and public.is_admin());

-- صلاحيات واجهة البيانات (المشروع لا يمنحها تلقائياً للجداول الجديدة)
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.course_files to authenticated;
grant execute on function public.is_admin(), public.is_active_member() to authenticated;

-- 4) نبضة نشاط: يستدعيها GitHub مرتين في الأسبوع حتى لا يتوقف المشروع المجاني
create or replace function public.keepalive()
returns text language sql stable as $$ select 'ok'::text $$;
grant execute on function public.keepalive() to anon;

-- =====================================================================
--  بعد إنشاء حسابك من: Authentication › Users › Add user
--  اجعله أدمن بتشغيل السطر التالي (ضع بريدك):
--    update public.profiles set role = 'admin' where email = 'hydconcept00@gmail.com';
-- =====================================================================
