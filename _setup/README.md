# استقبال طلبات التسجيل بعد النشر (GitHub Pages)

GitHub Pages يعرض الصفحات فقط ولا يحفظ أي بيانات. لذلك يرسل نموذج التسجيل الطلبات إلى خدمة خارجية.
هذا المجلد (`_setup`) لا يُنشر على الموقع.

## الخيار 1 (موصى به): Google Sheets + رسالة إلى بريدك — مجاني

كل تسجيل يُضاف سطراً في جدول Google خاص بك، وتصلك رسالة على بريدك فيها كل تفاصيله.

1. افتح https://sheets.new (بحساب Gmail الذي تريد استقبال الطلبات عليه). سمِّ الجدول: «تسجيلات دورة QGIS».
2. من القائمة: **Extensions ← Apps Script** (الإضافات ← برمجة التطبيقات).
3. احذف كل ما في ملف `Code.gs` والصق محتوى الملف `google-sheets-Code.gs` كاملاً. اضغط أيقونة الحفظ.
4. في الأعلى اختر الدالة **testSetup** ثم اضغط **Run**.
   ستطلب Google الإذن: Review permissions ← اختر حسابك ← Advanced ← Go to … (unsafe) ← Allow.
   (التحذير طبيعي لأن السكربت كتبته أنت ولم تراجعه Google.)
   تحقّق: ظهرت ورقة «التسجيلات» فيها سطر تجريبي، ووصلتك رسالة على بريدك.
5. **Deploy ← New deployment** ← أيقونة الترس ← **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   ثم **Deploy** وانسخ **Web app URL** (ينتهي بـ `/exec`).
6. افتح `assets/js/config.js` في الموقع وضع:
   ```js
   formProvider: "google",
   formEndpoint: "https://script.google.com/macros/s/……/exec"
   ```
7. ارفع `config.js` المعدَّل إلى مستودع GitHub، ثم جرّب التسجيل من الموقع المنشور.

**أين أرى التسجيلات؟** في جدول Google (يمكن تنزيله Excel: File ← Download ← xlsx)، ورسالة لكل تسجيل على بريدك.

**إذا عدّلت السكربت لاحقاً:** Deploy ← Manage deployments ← أيقونة القلم ← Version: **New version** ← Deploy. يبقى الرابط نفسه.

**رسالة تأكيد للمتدرّب:** غيّر `SEND_CONFIRMATION` إلى `true` في السكربت. حساب Gmail المجاني يرسل إلى 100 مستلم يومياً كحد أقصى (رسائلك + رسائل التأكيد).

## الخيار 2: Formspree — رسالة إلى البريد فقط

1. أنشئ حساباً على https://formspree.io ثم **New form**، وانسخ رابطه (`https://formspree.io/f/xxxx`).
2. في `config.js`: `formProvider: "formspree"` و `formEndpoint: "https://formspree.io/f/xxxx"`.
3. الخطة المجانية: 50 تسجيلاً في الشهر، وتُحفظ في لوحة Formspree لمدة 30 يوماً.
