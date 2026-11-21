/* إعدادات الموقع — عدّل هنا فقط */
window.SITE = {
  name: "مختبر الخرائط",            // اسم الموقع / الجهة المنظِّمة
  course: "مقدمة في نظم المعلومات الجغرافية باستخدام QGIS",
  email: "hydconcept00@gmail.com",   // بريد التواصل
  phone: "",                          // اختياري

  // استقبال طلبات التسجيل بعد النشر على الإنترنت (انظر _setup/README.md)
  //   "google"    : جدول Google Sheets + رسالة إلى بريدك عن كل تسجيل (مجاني)
  //   "formspree" : رسالة إلى بريدك عبر Formspree (50 تسجيلاً في الشهر مجاناً)
  // اترك formEndpoint فارغاً أثناء العمل محلياً: تُحفظ الطلبات في المتصفح ويمكن تنزيلها CSV.
  formProvider: "google",
  formEndpoint: "https://script.google.com/macros/s/AKfycby76RtELrMAcMWBx7i4SQDmLfA03zy1aFAeOJsNzmLIjdokhN7TsC5i4ShyeMzqThN8/exec",

  // ملفات الدورة المحمية (الدليل والمواد) — Supabase
  //   supabaseUrl و supabaseAnonKey من: Project Settings › API Keys في لوحة Supabase (المفتاح publishable).
  //   المفتاح publishable عامّ بطبيعته ومصمَّم ليوضع في الموقع؛ لا تضع هنا مفتاح secret أو service_role أبداً.
  supabaseUrl: "https://cuyexrllyckeqpobxdze.supabase.co",
  supabaseAnonKey: "sb_publishable_yXqnAd_IAMWhGVRIfKB6ew_be3VSwfb",
  filesBucket: "course-files"
};
