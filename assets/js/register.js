(function () {
  var form = document.getElementById('reg');
  var KEY = 'qgis-course-registrations';
  var local = !SITE.formEndpoint;
  var msgs = {
    name: 'اكتب اسمك الكامل.',
    email: 'اكتب بريداً إلكترونياً صحيحاً، مثل name@gmail.com.',
    city: 'اكتب ولايتك أو مدينتك.',
    profile: 'اختر صفتك.',
    level: 'اختر مستواك.'
  };

  function setErr(el, text) {
    var f = el.closest('.field'); f.classList.toggle('invalid', !!text);
    f.querySelector('.err').textContent = text || '';
  }
  function validate() {
    var ok = true, first = null;
    ['name', 'email', 'city', 'level'].forEach(function (id) {
      var el = form.elements[id], bad = !el.value.trim() || (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
      setErr(el, bad ? msgs[id] : ''); if (bad) { ok = false; first = first || el; }
    });
    var r = form.querySelector('input[name=profile]'), checked = form.querySelector('input[name=profile]:checked');
    setErr(r, checked ? '' : msgs.profile); if (!checked) { ok = false; first = first || r; }
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
    if (!validate()) return;
    var d = {}; new FormData(form).forEach(function (v, k) { d[k] = String(v).trim(); });
    if (d.website) { showDone(d); return; }   // spam bot filled the hidden field
    delete d.website;
    d.date = new Date().toISOString();
    if (local) {
      var list = store.get(KEY, []); list.push(d); store.set(KEY, list); showDone(d); return;
    }
    var btn = form.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'جارٍ الإرسال…';
    var req = SITE.formProvider === 'google'
      // Google Apps Script: plain-text body avoids a CORS preflight; the reply is opaque, so a completed request counts as sent
      ? fetch(SITE.formEndpoint, { method: 'POST', mode: 'no-cors', body: JSON.stringify(d) }).then(function () {})
      : fetch(SITE.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(d) })
          .then(function (r) { if (!r.ok) throw 0; });
    req.then(function () { showDone(d); })
      .catch(function () {
        btn.disabled = false; btn.textContent = 'إرسال طلب التسجيل';
        alert('لم يُرسَل الطلب. تحقّق من اتصالك بالإنترنت ثم أعد المحاولة، أو راسلنا على ' + SITE.email);
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
    var cols = ['date', 'name', 'email', 'phone', 'city', 'profile', 'level', 'message'];
    var csv = '﻿' + cols.join(',') + '\n' + list.map(function (r) {
      return cols.map(function (c) { return '"' + String(r[c] || '').replace(/"/g, '""') + '"'; }).join(',');
    }).join('\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'registrations.csv'; a.click();
  });
  refreshAdmin();
})();
