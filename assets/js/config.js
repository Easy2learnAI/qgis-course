/* إعدادات منصة Delta Conception — متعددة اللغات (العربية / English / Français) */
window.SITE = {
  name: "Delta Conception",            // اسم المنصة / الأكاديمية
  platformTitle: "Delta Conception — Academy & Digital Library",
  titles: {
    ar: "Delta Conception — أكاديمية نظم المعلومات الجغرافية والمكتبة الرقمية",
    en: "Delta Conception — GIS Academy & Digital Library",
    fr: "Delta Conception — Académie SIG & Bibliothèque Numérique"
  },
  course: "منصة الدورات التدريبية في نظم المعلومات الجغرافية والمكتبة الرقمية",
  email: "hydconcept00@gmail.com",     // بريد التواصل
  phone: "",                            // اختياري

  // استقبال طلبات التسجيل بعد النشر على الإنترنت (انظر _setup/README.md)
  formProvider: "google",
  formEndpoint: "https://script.google.com/macros/s/AKfycby76RtELrMAcMWBx7i4SQDmLfA03zy1aFAeOJsNzmLIjdokhN7TsC5i4ShyeMzqThN8/exec",

  // ملفات الدورة المحمية (الدليل والمواد والكتب) — Supabase
  supabaseUrl: "https://cuyexrllyckeqpobxdze.supabase.co",
  supabaseAnonKey: "sb_publishable_yXqnAd_IAMWhGVRIfKB6ew_be3VSwfb",
  filesBucket: "course-files"
};
