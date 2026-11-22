-- =====================================================================
--  Delta Conception — ملف واحد للتشغيل مرة واحدة: مكتبة الكتب + صور الأغلفة + الدورات
--  (محتوى books.sql ثم courses.sql). آمن للتشغيل أكثر من مرة ولا يحذف أي بيانات.
-- =====================================================================

-- =====================================================================
--  Delta Conception — مكتبة الكتب الرقمية (Supabase)
--  شغّل هذا الملف مرة واحدة في: SQL Editor › New query › Run
--  آمن للتشغيل أكثر من مرة، ويصحّح النسخة السابقة من جدول الكتب إن كانت موجودة.
--
--  الكتب متاحة للجميع: العنوان والغلاف والوصف ورابط التحميل (drive_url).
--  الإضافة والتعديل والحذف للأدمن فقط.
-- =====================================================================

create table if not exists public.books (
  id              text primary key,
  title           text not null,
  author          text,
  category        text not null default 'gis',
  category_name   text,
  pages           text,
  year            text,
  description     text,
  cover_url       text,
  drive_url       text not null,
  featured        boolean not null default false,
  active          boolean not null default true,
  created_at      timestamptz not null default now()
);
alter table public.books enable row level security;

-- قراءة الصفوف: الزوار يرون الكتب المنشورة فقط، والأدمن يرى الكل
-- (قاعدتان منفصلتان لأن الدالة is_admin() غير متاحة للزوار)
drop policy if exists "books: public read" on public.books;
drop policy if exists "books: anon read" on public.books;
create policy "books: anon read" on public.books
  for select to anon using (active);
drop policy if exists "books: member read" on public.books;
create policy "books: member read" on public.books
  for select to authenticated using (active or public.is_admin());

-- الكتابة: الأدمن فقط
drop policy if exists "books: admin write" on public.books;
create policy "books: admin write" on public.books
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- القراءة للجميع (ومنها رابط التحميل)
revoke all on public.books from anon, authenticated;
grant select on public.books to anon, authenticated;
grant insert, update, delete on public.books to authenticated;
grant select, insert, update, delete on public.books to service_role;

-- (قديمة، لم يعد الموقع يستعملها) روابط التحميل عبر دالة
create or replace function public.book_links()
returns table (id text, drive_url text)
language sql stable security definer set search_path = '' as $$
  select b.id, b.drive_url
  from public.books b
  where public.is_active_member() and (b.active or public.is_admin());
$$;
revoke execute on function public.book_links() from public, anon;
grant execute on function public.book_links() to authenticated;

-- صور الأغلفة: مخزن عام (يراه الجميع، والرفع والحذف للأدمن فقط)، 2 MB للصورة كحد أقصى
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('book-covers', 'book-covers', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "book-covers: admin insert" on storage.objects;
create policy "book-covers: admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'book-covers' and public.is_admin());
drop policy if exists "book-covers: admin update" on storage.objects;
create policy "book-covers: admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'book-covers' and public.is_admin()) with check (bucket_id = 'book-covers' and public.is_admin());
drop policy if exists "book-covers: admin delete" on storage.objects;
create policy "book-covers: admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'book-covers' and public.is_admin());
-- الرفع مع الاستبدال (x-upsert) يحتاج قراءة الملف القديم
drop policy if exists "book-covers: admin read" on storage.objects;
create policy "book-covers: admin read" on storage.objects
  for select to authenticated using (bucket_id = 'book-covers' and public.is_admin());

-- تحديث واجهة البيانات فوراً
notify pgrst, 'reload schema';


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
