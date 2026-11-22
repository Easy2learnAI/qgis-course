/* صفحة التسجيل: التحقق من الحقول وإرسال الطلب (Google Sheets أو Formspree، أو حفظ محلي) */
(function () {
  var form = document.getElementById('reg');
  function tr(k, fb) { return window.I18N ? window.I18N.t(k, fb) : fb; }

  // قائمة الدورات: من الكتالوج (دورة QGIS + ما يضيفه الأدمن)، ثم خيار العضوية الشاملة
  var sel = document.getElementById('course-select'), CO = window.COURSES;
  var pc = new URLSearchParams(location.search).get('course');
  var courses = CO ? CO.cached() : [];
  function fillCourses() {
    if (!CO) return;
    var cur = window.I18N.getLang(), chosen = wanted || sel.value || (courses[0] && courses[0].id);
    sel.innerHTML = courses.map(function (c) {
      var l = CO.localize(c, cur);
      return '<option value="' + esc(c.id) + '">' + esc(l.title + ' — ' + l.badge) + '</option>';
    }).join('') + '<option value="all-access">' + esc(tr('reg_course_opt_all')) + '</option>';
    sel.value = chosen;
    if (sel.selectedIndex < 0) sel.selectedIndex = 0;
  }
  // الدورة المطلوبة في الرابط قد تصل من الخادم بعد لحظة: نحتفظ بها حتى يغيّر الزائر اختياره
  var wanted = pc;
  sel.addEventListener('change', function () { wanted = null; });
  fillCourses();
  if (CO) CO.load().then(function (rows) { courses = rows; fillCourses(); });
  window.addEventListener('deltalangchange', fillCourses);
  // في جدول التسجيلات نحفظ اسم الدورة بالعربية (أوضح من المعرّف)
  function courseLabel(id) {
    var c = CO && CO.byId(courses, id);
    return c ? c.title : id === 'all-access' ? (window.I18N.dict.reg_course_opt_all || {}).ar || id : id;
  }

  var KEY = 'qgis-course-registrations';
  var local = !SITE.formEndpoint;
  var msgs = { name: 'reg_err_name', email: 'reg_err_email', city: 'reg_err_city', profile: 'reg_err_profile', level: 'reg_err_level' };

  function setErr(el, text) {
    var f = el.closest('.field'); f.classList.toggle('invalid', !!text);
    f.querySelector('.err').textContent = text || '';
  }
  function validate() {
    var ok = true, first = null;
    ['name', 'email', 'city', 'level'].forEach(function (id) {
      var el = form.elements[id], bad = !el.value.trim() || (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
      setErr(el, bad ? tr(msgs[id]) : ''); if (bad) { ok = false; first = first || el; }
    });
    var r = form.querySelector('input[name=profile]'), checked = form.querySelector('input[name=profile]:checked');
    setErr(r, checked ? '' : tr(msgs.profile)); if (!checked) { ok = false; first = first || r; }
    if (first) first.focus();
    return ok;
  }
  form.addEventListener('input', function (e) { if (e.target.closest('.field.invalid')) setErr(e.target, ''); });

  function showDone(d) {
    form.hidden = true;
    document.getElementById('done-name').textContent = d.name;
    document.getElementById('done-mail').textContent = d.email;
    var box = document.getElementById('done'); box.hidden = false; box.focus();
    refreshAdmin();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('reg-error').hidden = true;
    if (!validate()) return;
    var d = {}; new FormData(form).forEach(function (v, k) { d[k] = String(v).trim(); });
    if (d.website) { showDone(d); return; }   // spam bot filled the hidden field
    delete d.website;
    d.course = courseLabel(d.course);
    d.date = new Date().toISOString();
    if (local) {
      var list = store.get(KEY, []); list.push(d); store.set(KEY, list); showDone(d); return;
    }
    var btn = form.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = tr('reg_sending');
    var req = SITE.formProvider === 'google'
      // Google Apps Script: plain-text body avoids a CORS preflight; the reply is opaque, so a completed request counts as sent
      ? fetch(SITE.formEndpoint, { method: 'POST', mode: 'no-cors', body: JSON.stringify(d) }).then(function () {})
      : fetch(SITE.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(d) })
          .then(function (r) { if (!r.ok) throw 0; });
    req.then(function () { showDone(d); })
      .catch(function () {
        btn.disabled = false; btn.textContent = tr('reg_submit_btn');
        var em = document.getElementById('reg-error');
        em.textContent = tr('reg_send_failed') + ' ' + SITE.email; em.hidden = false; em.focus();
      });
  });

  function refreshAdmin() {
    var isLocal = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
    var list = store.get(KEY, []);
    var a = document.getElementById('admin');
    a.hidden = !(local && isLocal && list.length);
    document.getElementById('count').textContent = list.length;
  }
  document.getElementById('csv').addEventListener('click', function () {
    var list = store.get(KEY, []);
    var cols = ['date', 'course', 'name', 'email', 'phone', 'city', 'profile', 'level', 'message'];
    var csv = '﻿' + cols.join(',') + '\n' + list.map(function (r) {
      return cols.map(function (c) { return '"' + String(r[c] || '').replace(/"/g, '""') + '"'; }).join(',');
    }).join('\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'registrations.csv'; a.click();
  });
  refreshAdmin();
})();
