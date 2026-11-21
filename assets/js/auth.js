/* عميل Supabase صغير (بدون مكتبات خارجية): الدخول، الملفات المحمية، وإدارة المتدرّبين.
   يعتمد على SITE.supabaseUrl و SITE.supabaseAnonKey في config.js */
(function () {
  var S = window.SITE || {};
  var URL_ = (S.supabaseUrl || '').replace(/\/+$/, '');
  var KEY = S.supabaseAnonKey || '';
  var BUCKET = S.filesBucket || 'course-files';
  var SKEY = 'qgis-course-session';

  function configured() { return !!(URL_ && KEY); }

  function load() { try { return JSON.parse(localStorage.getItem(SKEY)) || null; } catch (e) { return null; } }
  function save(s) { try { if (s) localStorage.setItem(SKEY, JSON.stringify(s)); else localStorage.removeItem(SKEY); } catch (e) {} }

  function fromToken(d) {
    return { access_token: d.access_token, refresh_token: d.refresh_token,
      expires_at: d.expires_at || (Math.floor(Date.now() / 1000) + (d.expires_in || 3600)), user: d.user || null };
  }

  function errText(status, body) {
    var m = body && (body.error_description || body.msg || body.message || body.error) || '';
    if (/invalid login credentials/i.test(m)) return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
    if (/banned/i.test(m)) return 'هذا الحساب موقوف. تواصل مع المدرّب.';
    if (/email not confirmed/i.test(m)) return 'الحساب غير مفعَّل بعد. تواصل مع المدرّب.';
    if (/password should be|weak/i.test(m)) return 'كلمة المرور ضعيفة: استعمل 8 أحرف على الأقل.';
    if (/already been registered|already registered|already exists/i.test(m)) return 'هذا البريد مسجَّل من قبل.';
    if (status === 0) return 'تعذّر الاتصال بالخادم. تحقّق من اتصالك بالإنترنت ثم أعد المحاولة.';
    return m || ('خطأ غير متوقَّع (' + status + ').');
  }

  function req(path, opts) {
    opts = opts || {};
    var h = opts.headers || {};
    h.apikey = KEY;  // المفتاح العام يكفي في apikey؛ Authorization لرمز المستخدم فقط
    if (opts.json !== undefined) { h['Content-Type'] = 'application/json'; opts.body = JSON.stringify(opts.json); }
    return fetch(URL_ + path, { method: opts.method || 'GET', headers: h, body: opts.body })
      .then(function (r) {
        return r.text().then(function (t) {
          var b = null; try { b = t ? JSON.parse(t) : null; } catch (e) { b = t; }
          if (!r.ok) { var e2 = new Error(errText(r.status, b)); e2.status = r.status; e2.body = b; throw e2; }
          return b;
        });
      }, function () { var e3 = new Error(errText(0)); e3.status = 0; throw e3; });
  }

  var refreshing = null;
  function session() {
    var s = load();
    if (!s) return Promise.resolve(null);
    if (s.expires_at - 60 > Date.now() / 1000) return Promise.resolve(s);
    if (!refreshing) {
      refreshing = req('/auth/v1/token?grant_type=refresh_token', { method: 'POST', json: { refresh_token: s.refresh_token } })
        .then(function (d) { var n = fromToken(d); save(n); return n; }, function () { save(null); return null; })
        .then(function (x) { refreshing = null; return x; });
    }
    return refreshing;
  }

  function authed(path, opts) {
    return session().then(function (s) {
      if (!s) { var e = new Error('انتهت الجلسة. سجّل الدخول من جديد.'); e.status = 401; throw e; }
      opts = opts || {}; opts.headers = opts.headers || {};
      opts.headers.Authorization = 'Bearer ' + s.access_token;
      return req(path, opts);
    });
  }

  function enc(p) { return p.split('/').map(encodeURIComponent).join('/'); }

  window.SB = {
    configured: configured,
    bucket: BUCKET,
    session: session,

    signIn: function (email, password) {
      return req('/auth/v1/token?grant_type=password', { method: 'POST', json: { email: email, password: password } })
        .then(function (d) { var s = fromToken(d); save(s); return s; });
    },
    signOut: function () {
      var s = load(); save(null);
      if (s) req('/auth/v1/logout', { method: 'POST', headers: { Authorization: 'Bearer ' + s.access_token } }).catch(function () {});
      return Promise.resolve();
    },
    changePassword: function (pw) { return authed('/auth/v1/user', { method: 'PUT', json: { password: pw } }); },

    profile: function () {
      return session().then(function (s) {
        if (!s || !s.user) return null;
        return authed('/rest/v1/profiles?select=id,email,full_name,role,active&id=eq.' + s.user.id)
          .then(function (rows) { return rows && rows[0] || null; });
      });
    },

    // الملفات: سجلّ في جدول course_files (العنوان والمجلد) + الملف نفسه في المخزن الخاص
    files: function () {
      return authed('/rest/v1/course_files?select=path,title,folder,size,created_at&order=folder.asc,title.asc');
    },
    saveFile: function (row) {
      return authed('/rest/v1/course_files?on_conflict=path', { method: 'POST', json: row,
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' } });
    },
    deleteFile: function (path) {
      return authed('/storage/v1/object/' + BUCKET, { method: 'DELETE', json: { prefixes: [path] } })
        .then(function () { return authed('/rest/v1/course_files?path=eq.' + encodeURIComponent(path), { method: 'DELETE' }); });
    },
    link: function (path, seconds) {
      return authed('/storage/v1/object/sign/' + BUCKET + '/' + enc(path), { method: 'POST', json: { expiresIn: seconds || 120 } })
        .then(function (d) {
          var u = d.signedURL || d.signedUrl;
          u = URL_ + '/storage/v1' + (u.charAt(0) === '/' ? '' : '/') + u;
          return u + (u.indexOf('?') > -1 ? '&' : '?') + 'download=' + encodeURIComponent(path.split('/').pop());
        });
    },
    upload: function (path, file) {
      return authed('/storage/v1/object/' + BUCKET + '/' + enc(path), { method: 'POST', body: file,
        headers: { 'x-upsert': 'true', 'Content-Type': file.type || 'application/octet-stream', 'cache-control': '3600' } });
    },

    // إدارة المتدرّبين عبر الدالة admin-users (تتحقق في الخادم من أن الطالب أدمن)
    admin: function (action, data) {
      var body = data || {}; body.action = action;
      return authed('/functions/v1/admin-users', { method: 'POST', json: body });
    }
  };

  // أدوات صغيرة للعرض
  window.fmtSize = function (n) {
    if (!n && n !== 0) return '';
    if (n < 1024) return n + ' B';
    if (n < 1048576) return Math.round(n / 1024) + ' KB';
    return (n / 1048576).toFixed(1) + ' MB';
  };
  window.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  };
  window.fmtDate = function (d) {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('ar-DZ-u-nu-latn', { year: 'numeric', month: 'short', day: 'numeric' }); } catch (e) { return d.slice(0, 10); }
  };
})();
