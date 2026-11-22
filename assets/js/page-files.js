/* صفحة «ملفاتي وحسابي»: الدخول، تحميل الملفات المحمية، تغيير كلمة المرور */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  function tr(k, fb) { return window.I18N ? window.I18N.t(k, fb) : fb; }
  var S = window.SITE || {};

  function setForgot() { if (S.email) $('forgot').href = 'mailto:' + S.email + '?subject=' + encodeURIComponent(tr('files_forgot_subject')); }
  setForgot();
  window.addEventListener('deltalangchange', function () { setForgot(); if (rows) renderAll(); if (me) renderWho(); });

  if (!SB.configured()) { $('off').hidden = false; return; }

  // بعد الدخول من صفحة أخرى نعود إليها (صفحات الموقع فقط)
  var next = new URLSearchParams(location.search).get('next') || '';
  if (!/^(lesson|resources|program|index|books|courses)\.html(\?u=\d+)?(#[a-z-]+)?$/.test(next)) next = '';

  var me = null, rows = null;
  function showLogin() { $('login').hidden = false; $('area').hidden = true; }

  function renderList(el, empty, list) {
    empty.hidden = list.length > 0;
    el.innerHTML = list.map(function (f) {
      var ext = (f.path.split('.').pop() || '').toUpperCase();
      return '<li><div><b>' + txt(f.title) + '</b><span class="meta"><span class="ltr">' + esc(ext) + '</span> · <span class="ltr">' + fmtSize(f.size) + '</span></span></div>' +
        '<button class="btn small" type="button" data-path="' + esc(f.path) + '">' + esc(tr('files_download')) + '</button></li>';
    }).join('');
  }
  function renderAll() {
    renderList($('list-guide'), $('empty-guide'), rows.filter(function (r) { return r.folder === 'guide'; }));
    renderList($('list-materials'), $('empty-materials'), rows.filter(function (r) { return r.folder !== 'guide'; }));
  }
  function loadFiles() {
    $('files-msg').textContent = '';
    return SB.files().then(function (r) { rows = r || []; renderAll(); }, function (e) { $('files-msg').textContent = e.message; });
  }
  function renderWho() {
    $('who').textContent = me.full_name || me.email;
    $('who-mail').textContent = me.full_name ? me.email : '';
  }

  function enter() {
    return SB.profile().then(function (p) {
      if (!p) { SB.signOut(); showLogin(); return; }
      me = p;
      $('login').hidden = true; $('area').hidden = false;
      renderWho();
      $('to-admin').hidden = p.role !== 'admin';
      $('inactive').hidden = p.active;
      $('lists').hidden = !p.active;
      if (p.active && next) { location.href = next; return; }
      if (p.active) return loadFiles();
    }, function () { SB.signOut(); showLogin(); });
  }

  $('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var m = $('login-msg'), b = this.querySelector('button');
    var email = $('l-email').value.trim(), pw = $('l-pw').value;
    if (!email || !pw) { m.textContent = tr('files_need_both'); return; }
    m.textContent = ''; b.disabled = true; b.textContent = tr('files_signing_in');
    SB.signIn(email, pw).then(function () { $('l-pw').value = ''; return enter(); })
      .catch(function (err) { m.textContent = err.message; })
      .then(function () { b.disabled = false; b.textContent = tr('files_login_btn'); });
  });

  $('logout').addEventListener('click', function () { SB.signOut().then(function () { me = null; showLogin(); }); });
  $('show-pw').addEventListener('click', function () { $('pw-box').hidden = !$('pw-box').hidden; if (!$('pw-box').hidden) $('pw1').focus(); });

  $('pw-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var m = $('pw-msg'), a = $('pw1').value, c = $('pw2').value;
    m.classList.remove('ok');
    if (a.length < 8) { m.textContent = tr('files_pw_short'); return; }
    if (a !== c) { m.textContent = tr('files_pw_mismatch'); return; }
    SB.changePassword(a).then(function () {
      m.classList.add('ok'); m.textContent = tr('files_pw_saved'); $('pw1').value = $('pw2').value = '';
    }, function (err) { m.textContent = err.message; });
  });

  document.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-path]'); if (!b) return;
    var t = b.textContent; b.disabled = true; b.textContent = tr('files_preparing');
    SB.link(b.getAttribute('data-path')).then(function (u) { window.location.href = u; },
      function (err) { $('files-msg').textContent = err.message; })
      .then(function () { setTimeout(function () { b.disabled = false; b.textContent = t; }, 1500); });
  });

  SB.session().then(function (s) { if (s) enter(); else showLogin(); });
})();
