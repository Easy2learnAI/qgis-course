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

  function tr(k, fb) { return window.I18N ? window.I18N.t(k, fb) : fb; }
  function errText(status, body) {
    var m = body && (body.error_description || body.msg || body.message || body.error) || '';
    if (/invalid login credentials/i.test(m)) return tr('err_login', 'البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    if (/banned/i.test(m)) return tr('err_banned', 'هذا الحساب موقوف. تواصل مع المدرّب.');
    if (/email not confirmed/i.test(m)) return tr('err_unconfirmed', 'الحساب غير مفعَّل بعد. تواصل مع المدرّب.');
    if (/password should be|weak/i.test(m)) return tr('err_weak', 'كلمة المرور ضعيفة: استعمل 8 أحرف على الأقل.');
    if (/already been registered|already registered|already exists/i.test(m)) return tr('err_exists', 'هذا البريد مسجَّل من قبل.');
    if (status === 0) return tr('err_network', 'تعذّر الاتصال بالخادم. تحقّق من اتصالك بالإنترنت ثم أعد المحاولة.');
    return m || (tr('err_unexpected', 'خطأ غير متوقَّع') + ' (' + status + ').');
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
      if (!s) { var e = new Error(tr('err_session', 'انتهت الجلسة. سجّل الدخول من جديد.')); e.status = 401; throw e; }
      opts = opts || {}; opts.headers = opts.headers || {};
      opts.headers.Authorization = 'Bearer ' + s.access_token;
      return req(path, opts);
    });
  }

  function enc(p) { return p.split('/').map(encodeURIComponent).join('/'); }

  // ذاكرة مؤقتة قصيرة لكل جلسة: تمنع إعادة طلب الملف الشخصي والمحتوى عند كل تنقّل بين الصفحات
  var CK = 'delta_cache:';
  function cget(k, maxAge) {
    try { var v = JSON.parse(sessionStorage.getItem(CK + k)); if (v && Date.now() - v.t < maxAge) return v.d; } catch (e) {}
    return undefined;
  }
  function cset(k, d) { try { sessionStorage.setItem(CK + k, JSON.stringify({ t: Date.now(), d: d })); } catch (e) {} }
  function cclear() {
    try { Object.keys(sessionStorage).forEach(function (k) { if (k.indexOf(CK) === 0) sessionStorage.removeItem(k); }); } catch (e) {}
  }
  var inflight = {};
  function once(key, maxAge, fn) {
    var hit = cget(key, maxAge);
    if (hit !== undefined) return Promise.resolve(hit);
    if (!inflight[key]) {
      inflight[key] = fn().then(function (d) { cset(key, d); delete inflight[key]; return d; },
                                function (e) { delete inflight[key]; throw e; });
    }
    return inflight[key];
  }
  var BOOK_COLS = 'id,title,author,category,category_name,pages,year,description,cover_url,drive_url,active,created_at';
  var COVERS = 'book-covers';   // مخزن عام لصور أغلفة الكتب

  window.SB = {
    configured: configured,
    bucket: BUCKET,
    session: session,

    signIn: function (email, password) {
      return req('/auth/v1/token?grant_type=password', { method: 'POST', json: { email: email, password: password } })
        .then(function (d) { var s = fromToken(d); cclear(); save(s); return s; });
    },
    signOut: function () {
      var s = load(); save(null); cclear();
      if (s) req('/auth/v1/logout', { method: 'POST', headers: { Authorization: 'Bearer ' + s.access_token } }).catch(function () {});
      return Promise.resolve();
    },
    changePassword: function (pw) { return authed('/auth/v1/user', { method: 'PUT', json: { password: pw } }); },

    profile: function () {
      return session().then(function (s) {
        if (!s || !s.user) return null;
        return once('profile:' + s.user.id, 5 * 60000, function () {
          return authed('/rest/v1/profiles?select=id,email,full_name,role,active&id=eq.' + s.user.id)
            .then(function (rows) { return rows && rows[0] || null; });
        });
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

    // محتوى الدروس (طرق التنفيذ والشروحات): ملف site/guide.json في المخزن الخاص، للمتدرّبين المفعَّلين فقط.
    // يُرجع null إذا لم يكن الزائر مسجَّلاً أو كان حسابه موقوفاً.
    CONTENT_PATH: 'site/guide.json',
    content: function () {
      if (!configured()) return Promise.resolve(null);
      return session().then(function (s) {
        if (!s) return null;
        return once('content:' + (s.user && s.user.id), 10 * 60000, function () {
          return authed('/storage/v1/object/authenticated/' + BUCKET + '/' + enc(window.SB.CONTENT_PATH), { headers: { 'cache-control': 'no-cache' } })
            .then(function (d) { return typeof d === 'string' ? JSON.parse(d) : d; },
                  function (e) { if (e.status === 400 || e.status === 401 || e.status === 403 || e.status === 404) return null; throw e; });
        });
      });
    },
    uploadContent: function (file) {
      cclear();
      return authed('/storage/v1/object/' + BUCKET + '/' + enc(window.SB.CONTENT_PATH), { method: 'POST', body: file,
        headers: { 'x-upsert': 'true', 'Content-Type': 'application/json', 'cache-control': '60' } });
    },

    // إدارة المتدرّبين عبر الدالة admin-users (تتحقق في الخادم من أن الطالب أدمن)
    admin: function (action, data) {
      var body = data || {}; body.action = action;
      return authed('/functions/v1/admin-users', { method: 'POST', json: body });
    },

    // مكتبة الكتب: القائمة مع روابط التحميل — متاحة للجميع
    getBooks: function () {
      if (!configured()) return Promise.resolve([]);
      var path = '/rest/v1/books?select=' + BOOK_COLS + '&order=created_at.desc';
      return session().then(function (s) { return s ? authed(path) : req(path); });
    },
    saveBook: function (book) {
      cclear();
      return authed('/rest/v1/books', { method: 'POST', json: book, headers: { Prefer: 'return=minimal' } })
        .catch(function (e) { throw tableErr(e, 'books'); });
    },
    updateBook: function (id, patch) {
      cclear();
      return authed('/rest/v1/books?id=eq.' + encodeURIComponent(id), { method: 'PATCH', json: patch, headers: { Prefer: 'return=minimal' } })
        .catch(function (e) { throw tableErr(e, 'books'); });
    },
    deleteBook: function (id) {
      cclear();
      return authed('/rest/v1/books?id=eq.' + encodeURIComponent(id), { method: 'DELETE', headers: { Prefer: 'return=minimal' } })
        .catch(function (e) { throw tableErr(e, 'books'); });
    },
    // صورة الغلاف: تُرفع إلى المخزن العام book-covers وتُرجع رابطها الدائم
    uploadCover: function (path, blob) {
      return authed('/storage/v1/object/' + COVERS + '/' + enc(path), { method: 'POST', body: blob,
        headers: { 'x-upsert': 'true', 'Content-Type': blob.type || 'image/jpeg', 'cache-control': '31536000' } })
        .then(function () { return URL_ + '/storage/v1/object/public/' + COVERS + '/' + enc(path); })
        .catch(function (e) { throw tableErr(e, 'covers'); });
    },
    deleteCover: function (url) {
      var pre = URL_ + '/storage/v1/object/public/' + COVERS + '/';
      if (!url || url.indexOf(pre) !== 0) return Promise.resolve();
      var path = decodeURIComponent(url.slice(pre.length).split('?')[0]);
      return authed('/storage/v1/object/' + COVERS, { method: 'DELETE', json: { prefixes: [path] } }).catch(function () {});
    },

    // الدورات المضافة من لوحة الإدارة (دورة QGIS الأولى مكتوبة في courses-data.js)
    getCourses: function () {
      if (!configured()) return Promise.resolve([]);
      var path = '/rest/v1/courses?select=*&order=sort_order.asc,created_at.asc';
      return session().then(function (s) { return s ? authed(path) : req(path); });
    },
    saveCourse: function (row, id) {
      return (id
        ? authed('/rest/v1/courses?id=eq.' + encodeURIComponent(id), { method: 'PATCH', json: row, headers: { Prefer: 'return=minimal' } })
        : authed('/rest/v1/courses', { method: 'POST', json: row, headers: { Prefer: 'return=minimal' } })
      ).catch(function (e) { throw tableErr(e, 'courses'); });
    },
    // إحصائيات الزوار والمسجَّلين (للأدمن فقط) — الدالة site_stats في _setup/supabase/stats.sql
    stats: function (days, tz) {
      return authed('/rest/v1/rpc/site_stats', { method: 'POST', json: { p_days: days, p_tz: tz || 'UTC' } })
        .catch(function (e) { throw tableErr(e, 'stats'); });
    },

    deleteCourse: function (id) {
      return authed('/rest/v1/courses?id=eq.' + encodeURIComponent(id), { method: 'DELETE', headers: { Prefer: 'return=minimal' } })
        .catch(function (e) { throw tableErr(e, 'courses'); });
    }
  };

  // رسالة واضحة إذا لم يُنشأ الجدول أو المخزن بعد في Supabase
  function tableErr(e, what) {
    var b = e.body || {}, m = String(b.message || b.error || '');
    var missing = e.status === 404 || b.code === '42P01' || b.code === 'PGRST205' || b.code === 'PGRST202' || /not find|does not exist|not found/i.test(m);
    if (missing) e.message = what === 'stats' ? 'الإحصائيات غير مفعَّلة بعد: شغّل الملف _setup/supabase/stats.sql مرة واحدة في SQL Editor.'
      : tr(what === 'courses' ? 'err_courses_table' : what === 'covers' ? 'err_covers_bucket' : 'err_books_table');
    return e;
  }

})();
