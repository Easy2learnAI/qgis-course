/* إحصائيات الزوار — يسجّل زيارة كل صفحة في جدول site_events على Supabase (انظر _setup/supabase/stats.sql).
   لا يُرسَل أي اسم أو بريد أو عنوان IP: كل زائر يُعرَف برقم عشوائي محفوظ في متصفحه فقط.
   يُرسَل الطلب بعد اكتمال تحميل الصفحة حتى لا يؤثّر على سرعتها. */
(function () {
  var S = window.SITE || {};
  var URL_ = (S.supabaseUrl || '').replace(/\/+$/, ''), KEY = S.supabaseAnonKey || '';

  function get(st, k) { try { return st.getItem(k); } catch (e) { return null; } }
  function put(st, k, v) { try { st.setItem(k, v); } catch (e) {} }
  function uid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    var a = new Uint8Array(16); (window.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : a.forEach(function (_, i) { a[i] = Math.random() * 256; });
    return Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }

  var host = location.hostname, ua = navigator.userAgent || '';
  // لا تُحتسب: النسخة المحلية، الروبوتات، المتصفحات الآلية، والمتصفح الذي اختار صاحبه «لا تحتسب زياراتي» (لوحة الإدارة)
  function off() {
    return !URL_ || !KEY || location.protocol === 'file:' ||
      /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(host) || /\.(local|localhost)$/.test(host) ||
      navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|whatsapp/i.test(ua) ||
      get(localStorage, 'delta_no_track') === '1';
  }

  var LS = window.localStorage, SS = window.sessionStorage;
  var vid = get(LS, 'delta_vid'); if (!vid) { vid = uid(); put(LS, 'delta_vid', vid); }
  var sid = get(SS, 'delta_sid'); if (!sid) { sid = uid(); put(SS, 'delta_sid', sid); }

  function page() {
    var p = decodeURIComponent(location.pathname.split('/').pop() || '') || 'index.html';
    var q = new URLSearchParams(location.search), keep = [];
    ['u', 'course'].forEach(function (k) { if (q.get(k)) keep.push(k + '=' + q.get(k)); });
    return (p + (keep.length ? '?' + keep.join('&') : '')).slice(0, 200);
  }
  function source() {
    var q = new URLSearchParams(location.search), u = q.get('utm_source') || q.get('ref');
    if (u) return u.toLowerCase().slice(0, 120);
    try {
      var r = document.referrer ? new URL(document.referrer) : null;
      if (r && r.hostname && r.hostname !== host) return r.hostname.replace(/^(www|m|l|lm)\./, '').slice(0, 120);
    } catch (e) {}
    return null;   // دخول مباشر أو تنقّل داخل الموقع
  }
  function device() {
    if (/iPad|Tablet|PlayBook|Silk|Android(?!.*Mobile)/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'tablet';
    if (/Mobi|iPhone|iPod|Android|Windows Phone/i.test(ua)) return 'mobile';
    return 'desktop';
  }
  function zone() { try { return (Intl.DateTimeFormat().resolvedOptions().timeZone || '').slice(0, 64) || null; } catch (e) { return null; } }

  function send(kind, item) {
    if (off()) return;
    var row = {
      kind: kind, visitor: vid, session: sid, path: page(), ref_host: kind === 'view' ? source() : null,
      lang: (get(LS, 'delta_lang') || document.documentElement.lang || 'ar').slice(0, 8),
      device: device(), tz: zone(), member: !!get(LS, 'qgis-course-session'),
      item: item ? String(item).slice(0, 200) : null
    };
    try {
      fetch(URL_ + '/rest/v1/site_events', {
        method: 'POST', keepalive: true, credentials: 'omit',
        headers: { apikey: KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify(row)
      }).catch(function () {});
    } catch (e) {}
  }

  // زيارة الصفحة: بعد اكتمال التحميل وفي وقت فراغ المتصفح
  function later() { (window.requestIdleCallback || function (f) { setTimeout(f, 300); })(function () { send('view'); }, { timeout: 3000 }); }
  if (document.readyState === 'complete') later(); else window.addEventListener('load', later);

  // تحميل كتاب (زر Google Drive في المكتبة أو الصفحة الرئيسية)
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a.book-dl-btn[href^="http"]');
    if (a) send('download', a.getAttribute('data-book') || a.href);
  }, true);

  window.TRACK = { event: send };
})();
