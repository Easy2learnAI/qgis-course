/**
 * استقبال طلبات التسجيل من موقع الدورة
 * كل تسجيل: يُضاف سطراً في ورقة «التسجيلات» + رسالة إلى بريدك.
 * يعمل كمشروع Apps Script مستقل (script.google.com) مرتبط بالجدول عبر SHEET_ID.
 */

// معرّف جدول Google الذي تُحفظ فيه التسجيلات (من رابط الجدول: /spreadsheets/d/<المعرّف>/edit)
const SHEET_ID = '1y8FIW3aR1eb2gqaxlx_VoxuO7HgW45k6sD5ExmWQVbc';

// بريد استقبال الإشعارات. اتركه فارغاً لاستعمال بريد حساب Google الذي ينشر السكربت.
const NOTIFY_EMAIL = '';

// أرسل رسالة تأكيد تلقائية إلى المتدرّب أيضاً؟ (حساب Gmail المجاني: 100 مستلم يومياً لكل الرسائل)
const SEND_CONFIRMATION = false;

const SHEET_NAME = 'التسجيلات';
const TIME_ZONE  = 'Africa/Algiers';   // توقيت عرض التواريخ في الجدول
// «course» أُضيف في آخر الأعمدة حتى لا تتغيّر أعمدة الجدول الموجود
const FIELDS  = ['date', 'name', 'email', 'phone', 'city', 'profile', 'level', 'message', 'course'];
const HEADERS = ['التاريخ', 'الاسم', 'البريد الإلكتروني', 'الهاتف', 'الولاية / المدينة', 'الصفة', 'المستوى', 'الهدف من الدورة', 'الدورة المطلوبة'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (d.website) return reply({ ok: true });                 // spam trap
    if (!d.name || !d.email) return reply({ ok: false, error: 'missing fields' });

    const sheet = getSheet();
    const row = FIELDS.map(function (k) { return k === 'date' ? new Date() : clean(d[k]); });
    sheet.appendRow(row);

    try {
      const to = NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
      MailApp.sendEmail({
        to: to,
        replyTo: String(d.email),
        subject: 'تسجيل جديد في الدورة: ' + clean(d.name),
        body: HEADERS.map(function (h, i) { return h + ': ' + row[i]; }).join('\n') +
              '\n\nكل التسجيلات: ' + SpreadsheetApp.openById(SHEET_ID).getUrl()
      });
      if (SEND_CONFIRMATION) {
        MailApp.sendEmail({
          to: String(d.email),
          subject: 'تم استلام طلب تسجيلك في دورة QGIS',
          body: 'مرحباً ' + clean(d.name) + '،\n\nاستلمنا طلب تسجيلك وسنراسلك قريباً بتفاصيل الانطلاق.\n'
        });
      }
    } catch (mailError) {
      console.error(mailError);   // the row is already saved even if email fails
    }
    return reply({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  if (ss.getSpreadsheetTimeZone() !== TIME_ZONE) ss.setSpreadsheetTimeZone(TIME_ZONE);
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.setRightToLeft(true);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  } else if (sh.getLastColumn() < HEADERS.length) {
    // جدول قديم بلا عمود «الدورة المطلوبة»: يُضاف العنوان الناقص في الصف الأول
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  }
  return sh;
}

// Text only, max 1000 chars; neutralise values that a spreadsheet would run as formulas.
function clean(v) {
  let s = String(v == null ? '' : v).slice(0, 1000);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Run once from the editor (select testSetup > Run) to approve permissions and create the sheet.
function testSetup() {
  SpreadsheetApp.openById(SHEET_ID).rename('تسجيلات دورة QGIS');
  doPost({ postData: { contents: JSON.stringify({
    name: 'تجربة', email: Session.getEffectiveUser().getEmail(), city: 'بجاية',
    profile: 'طالب', level: 'تجربة', message: 'سطر تجريبي — يمكنك حذفه'
  }) } });
}
