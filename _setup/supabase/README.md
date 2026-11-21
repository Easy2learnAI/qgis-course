# تفعيل حسابات المتدرّبين والملفات المحمية (Supabase)

الموقع يبقى عاماً على GitHub Pages. المحميّ هو **الدليل ومواد التمارين** فقط:
تُرفع إلى مخزن خاص في Supabase، ولا تُحمَّل إلا بحساب مفعَّل.

| الصفحة | لمن |
|---|---|
| `files.html` — ملفات الدورة | المتدرّب: يدخل، يحمّل الملفات، يغيّر كلمة المرور |
| `admin.html` — لوحة الإدارة | الأدمن: يضيف المتدرّبين ويوقفهم ويحذفهم، ويرفع الملفات |

## خطوات التفعيل (مرة واحدة)

1. **أنشئ مشروعاً** في https://supabase.com (الخطة المجانية).
2. **قاعدة البيانات:** SQL Editor › New query › الصق محتوى `schema.sql` › Run.
3. **دالة الإدارة:** Edge Functions › Deploy a new function › Via Editor ›
   الاسم `admin-users` › الصق `functions/admin-users/index.ts` › Deploy.
4. **أغلق التسجيل الذاتي:** Authentication › Sign In / Providers › عطّل **Allow new users to sign up**
   (الحسابات يُنشئها الأدمن فقط).
5. **حساب الأدمن:** Authentication › Users › Add user › Create new user
   (بريدك + كلمة مرورك + Auto Confirm). ثم في SQL Editor:
   ```sql
   update public.profiles set role = 'admin' where email = 'hydconcept00@gmail.com';
   ```
6. **اربط الموقع:** Project Settings › API Keys › انسخ `Project URL` والمفتاح `publishable`
   إلى `assets/js/config.js` (`supabaseUrl` و `supabaseAnonKey`). لا تضع المفتاح `secret` في الموقع أبداً.
7. ادخل من `files.html` ثم افتح **لوحة الإدارة** وارفع الدليل والمواد.

## ملاحظات

- **الخطة المجانية:** 1 GB للملفات، و 50 MB للملف الواحد. المشروع يتوقف بعد أسبوع بلا نشاط؛
  الملف `.github/workflows/supabase-keepalive.yml` يرسل طلباً صغيراً مرتين في الأسبوع لمنع ذلك.
- **نسيان كلمة المرور:** لا تُرسَل رسائل بريد من Supabase (الخدمة المجانية لا ترسل إلا لأعضاء الفريق)؛
  الأدمن يضغط «كلمة مرور جديدة» في لوحة الإدارة ويرسلها للمتدرّب.
- **إيقاف حساب** يمنع الدخول وتحميل الملفات معاً، ويمكن إعادة تفعيله في أي وقت.
