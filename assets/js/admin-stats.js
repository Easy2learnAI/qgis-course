/* لوحة الإدارة — قسم الإحصائيات: الزوار (حتى غير المسجَّلين) والأعضاء وتطوّرهم يومياً.
   البيانات من الدالة site_stats في Supabase (_setup/supabase/stats.sql). الرسوم SVG بدون مكتبات. */
window.ADMIN_STATS = (function () {
  var $ = function (id) { return document.getElementById(id); };
  var TZ = (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) { return 'UTC'; } })();
  var data = null, busy = false;

  var PAGES = { 'index.html': 'الرئيسية', 'courses.html': 'الدورات', 'books.html': 'مكتبة الكتب', 'program.html': 'برنامج الدورة',
    'lesson.html': 'صفحة وحدة', 'resources.html': 'الموارد والمعجم', 'register.html': 'التسجيل', 'files.html': 'ملفاتي وحسابي' };
  var DEVICES = { mobile: 'هاتف', tablet: 'جهاز لوحي', desktop: 'حاسوب' };
  var LANGS = { ar: 'العربية', en: 'English', fr: 'Français' };
  var ZONES = { 'Africa/Algiers': 'الجزائر', 'Africa/Casablanca': 'المغرب', 'Africa/El_Aaiun': 'المغرب', 'Africa/Tunis': 'تونس',
    'Africa/Tripoli': 'ليبيا', 'Africa/Cairo': 'مصر', 'Africa/Nouakchott': 'موريتانيا', 'Africa/Khartoum': 'السودان',
    'Asia/Riyadh': 'السعودية', 'Asia/Dubai': 'الإمارات', 'Asia/Qatar': 'قطر', 'Asia/Kuwait': 'الكويت', 'Asia/Bahrain': 'البحرين',
    'Asia/Muscat': 'عُمان', 'Asia/Baghdad': 'العراق', 'Asia/Amman': 'الأردن', 'Asia/Damascus': 'سوريا', 'Asia/Beirut': 'لبنان',
    'Asia/Gaza': 'فلسطين', 'Asia/Hebron': 'فلسطين', 'Asia/Aden': 'اليمن', 'Europe/Paris': 'فرنسا', 'Europe/Brussels': 'بلجيكا',
    'Europe/Madrid': 'إسبانيا', 'Europe/Berlin': 'ألمانيا', 'Europe/London': 'بريطانيا', 'Europe/Rome': 'إيطاليا',
    'Europe/Istanbul': 'تركيا', 'America/Montreal': 'كندا', 'America/Toronto': 'كندا', 'America/New_York': 'الولايات المتحدة' };
  var SOURCES = { 'google': 'Google', 'facebook.com': 'Facebook', 'instagram.com': 'Instagram', 'youtube.com': 'YouTube',
    't.co': 'X (Twitter)', 'x.com': 'X (Twitter)', 'linkedin.com': 'LinkedIn', 'bing.com': 'Bing', 'github.com': 'GitHub',
    'web.whatsapp.com': 'WhatsApp', 'whatsapp': 'WhatsApp', 'telegram': 'Telegram', 'web.telegram.org': 'Telegram' };

  function n(x) { return Number(x || 0).toLocaleString('en-US'); }
  function day(s, full) { var p = String(s).split('-'); return full ? p[2] + '/' + p[1] + '/' + p[0] : p[2] + '/' + p[1]; }
  function pct(a, b) { return b ? Math.round(a * 100 / b) : 0; }

  function pageName(k) {
    if (!k) return '—';
    var m = k.split('?'), base = PAGES[m[0]] || m[0], q = new URLSearchParams(m[1] || '');
    if (q.get('u')) return 'الوحدة ' + q.get('u');
    if (q.get('course')) return base + ' — ' + courseName(q.get('course'));
    return base;
  }
  function courseName(id) {
    var C = window.COURSES; if (!id) return '—';
    if (C && C.BUILTIN && C.BUILTIN.id === id) return C.BUILTIN.title;
    var hit = C && C.cached ? C.byId(C.cached(), id) : null;
    return hit ? hit.title : id === 'all' ? 'عضوية المنصة' : id;
  }
  function sourceName(k) {
    if (!k) return 'دخول مباشر (رابط محفوظ، رسالة، أو كتابة العنوان)';
    if (/(^|\.)google\./.test(k)) return 'Google';
    return SOURCES[k] || k;
  }

  // ---------------- البطاقات ----------------
  function kpi(label, val, sub) {
    return '<div class="kpi"><span class="kpi-label">' + label + '</span><b class="kpi-val">' + val + '</b>' +
      (sub ? '<span class="kpi-sub">' + sub + '</span>' : '') + '</div>';
  }
  function renderKpis(d) {
    var t = d.totals, m = d.members, per = t.visitors ? (t.views / t.visitors).toFixed(1) : '0';
    var range = d.range.days === 1 ? 'اليوم' : 'آخر ' + d.range.days + ' يوماً';
    $('st-kpis').innerHTML =
      kpi('زوار اليوم', n(d.today.visitors), n(d.today.views) + ' مشاهدة صفحة') +
      kpi('متصلون الآن', n(d.online), 'خلال آخر 5 دقائق') +
      kpi('الزوار — ' + range, n(t.visitors), n(d.new_visitors) + ' زائر جديد · ' + n(t.member_visitors) + ' عضو') +
      kpi('مشاهدات الصفحات', n(t.views), per + ' صفحة لكل زائر') +
      kpi('الأعضاء المسجَّلون', n(m.total), '+' + n(m.new) + ' خلال الفترة · ' + n(m.active) + ' مفعَّل') +
      kpi('طلبات التسجيل', n(t.registers), 'من نموذج التسجيل خلال الفترة') +
      kpi('تحميلات الكتب', n(t.downloads), 'نقرات «تحميل» خلال الفترة') +
      kpi('كل الزوار منذ البداية', n(d.all_time.visitors), d.all_time.since ? 'منذ ' + day(d.all_time.since, true) : 'لا زيارات بعد');
    $('nav-s').textContent = n(d.today.visitors);
  }

  // ---------------- الرسوم ----------------
  function niceTop(max) {
    var raw = Math.max(max, 1) / 4, mag = Math.pow(10, Math.floor(Math.log10(raw))), step = 1;
    [1, 2, 5, 10].some(function (f) { step = f * mag; return step >= raw; });
    return Math.max(1, Math.round(step)) * 4;
  }
  function draw(el, pts, o) {
    if (!el) return;
    var W = Math.max(280, el.clientWidth || 600), H = 230, L = 44, R = 12, T = 12, B = 28;
    var iw = W - L - R, ih = H - T - B, cnt = pts.length, stepX = iw / cnt;
    var top = niceTop(Math.max.apply(null, pts.map(function (p) { return p.y; }).concat([0])));
    function X(i) { return L + stepX * i + stepX / 2; }
    function Y(v) { return T + ih - v / top * ih; }
    var s = '<svg class="chart-svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + o.label + '" direction="ltr">';
    for (var g = 0; g <= 4; g++) {
      var v = top * g / 4, y = Y(v);
      s += '<line class="grid' + (g ? '' : ' base') + '" x1="' + L + '" x2="' + (W - R) + '" y1="' + y + '" y2="' + y + '"/>' +
           '<text class="ytick" x="' + (L - 8) + '" y="' + (y + 4) + '">' + n(v) + '</text>';
    }
    if (o.mode === 'bar') {
      var bw = Math.max(1, Math.min(26, stepX - 2));
      pts.forEach(function (p, i) {
        if (!p.y) return;
        var x = X(i) - bw / 2, y0 = Y(0), y1 = Y(p.y), r = Math.min(4, bw / 2, y0 - y1);
        s += '<path class="bar" data-i="' + i + '" fill="' + o.color + '" d="M' + x + ' ' + y0 + 'V' + (y1 + r) + 'Q' + x + ' ' + y1 + ' ' + (x + r) + ' ' + y1 +
             'H' + (x + bw - r) + 'Q' + (x + bw) + ' ' + y1 + ' ' + (x + bw) + ' ' + (y1 + r) + 'V' + y0 + 'Z"/>';
      });
    } else {
      var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(p.y).toFixed(1); }).join('');
      s += '<path class="area" fill="' + o.color + '" d="' + d + 'L' + X(cnt - 1).toFixed(1) + ' ' + Y(0) + 'L' + X(0).toFixed(1) + ' ' + Y(0) + 'Z"/>' +
           '<path class="line" stroke="' + o.color + '" d="' + d + '"/>' +
           '<circle class="end" fill="' + o.color + '" cx="' + X(cnt - 1) + '" cy="' + Y(pts[cnt - 1].y) + '" r="4.5"/>';
    }
    var every = Math.max(1, Math.ceil(cnt / Math.max(2, Math.floor(iw / 64))));
    pts.forEach(function (p, i) {
      if ((cnt - 1 - i) % every === 0) s += '<text class="xtick" x="' + X(i) + '" y="' + (H - 8) + '">' + day(p.x) + '</text>';
    });
    s += '<line class="cross" x1="0" x2="0" y1="' + T + '" y2="' + (T + ih) + '" visibility="hidden"/>';
    s += '<rect class="hit" x="' + L + '" y="' + T + '" width="' + iw + '" height="' + ih + '" fill="transparent"/>';
    s += '</svg><div class="chart-tip" hidden></div>';
    el.innerHTML = s;

    var svg = el.firstChild, tip = el.lastChild, cross = svg.querySelector('.cross'), last = -1;
    function at(ev) {
      var r = svg.getBoundingClientRect(), i = Math.floor((ev.clientX - r.left - L) / stepX);
      i = Math.max(0, Math.min(cnt - 1, i));
      if (i === last) return; last = i;
      svg.querySelectorAll('.bar.on').forEach(function (b) { b.classList.remove('on'); });
      var b = svg.querySelector('.bar[data-i="' + i + '"]'); if (b) b.classList.add('on');
      cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.setAttribute('visibility', o.mode === 'bar' ? 'hidden' : 'visible');
      tip.innerHTML = pts[i].tip; tip.hidden = false;
      var tw = tip.offsetWidth, left = Math.max(0, Math.min(W - tw, X(i) - tw / 2));
      tip.style.left = left + 'px'; tip.style.top = Math.max(0, Y(pts[i].y) - tip.offsetHeight - 10) + 'px';
    }
    function leave() { last = -1; tip.hidden = true; cross.setAttribute('visibility', 'hidden'); svg.querySelectorAll('.bar.on').forEach(function (b) { b.classList.remove('on'); }); }
    svg.addEventListener('pointermove', at); svg.addEventListener('pointerdown', at); svg.addEventListener('pointerleave', leave);
  }

  function renderCharts(d) {
    var daily = d.daily || [];
    draw($('st-chart-visitors'), daily.map(function (r) {
      return { x: r.day, y: r.visitors, tip: '<b>' + day(r.day, true) + '</b><span>الزوار: <b>' + n(r.visitors) + '</b></span>' +
        '<span>منهم جدد: ' + n(r['new']) + '</span><span>مشاهدات الصفحات: ' + n(r.views) + '</span>' +
        (r.registers ? '<span>طلبات التسجيل: ' + n(r.registers) + '</span>' : '') + (r.downloads ? '<span>تحميل كتب: ' + n(r.downloads) + '</span>' : '') };
    }), { mode: daily.length > 95 ? 'line' : 'bar', color: '#2a6fb0', label: 'الزوار يومياً' });

    var total = d.members.before || 0;
    draw($('st-chart-members'), daily.map(function (r) {
      total += r.members;
      return { x: r.day, y: total, tip: '<b>' + day(r.day, true) + '</b><span>إجمالي الأعضاء: <b>' + n(total) + '</b></span>' +
        (r.members ? '<span>حسابات جديدة: +' + n(r.members) + '</span>' : '') };
    }), { mode: 'line', color: '#7a2e8c', label: 'الأعضاء المسجَّلون' });
  }

  // ---------------- القوائم ----------------
  function list(title, rows, name, val, unit, note) {
    var max = rows.reduce(function (a, r) { return Math.max(a, val(r)); }, 0), sum = rows.reduce(function (a, r) { return a + val(r); }, 0);
    var body = rows.length ? rows.map(function (r) {
      var v = val(r);
      return '<li><span class="sl-k" dir="auto">' + esc(name(r)) + '</span><span class="sl-v">' + n(v) +
        ' <small>' + pct(v, sum) + '%</small></span><span class="sl-bar" style="width:' + (max ? Math.max(2, v * 100 / max) : 0) + '%"></span></li>';
    }).join('') : '<li class="empty">لا بيانات خلال هذه الفترة.</li>';
    return '<section class="stat-list"><h3>' + title + '</h3><p class="small-note">' + (note || unit) + '</p><ol>' + body + '</ol></section>';
  }
  function renderLists(d) {
    var V = function (r) { return r.v; }, N = function (r) { return r.n; };
    $('st-lists').innerHTML =
      list('أكثر الصفحات زيارة', d.pages, function (r) { return pageName(r.k); }, N, 'عدد المشاهدات') +
      list('من أين يأتي الزوار', d.sources, function (r) { return sourceName(r.k); }, V, 'عدد الزوار حسب المصدر') +
      list('البلد / المنطقة', d.zones, function (r) { return ZONES[r.k] || r.k || 'غير معروف'; }, V, 'حسب توقيت جهاز الزائر (تقريبي)') +
      list('نوع الجهاز', d.devices, function (r) { return DEVICES[r.k] || 'غير معروف'; }, V, 'عدد الزوار') +
      list('لغة التصفّح في الموقع', d.langs, function (r) { return LANGS[r.k] || r.k || 'غير معروف'; }, V, 'عدد الزوار') +
      list('أكثر الكتب تحميلاً', d.books, function (r) { return r.k || '—'; }, N, 'نقرات زر التحميل') +
      list('طلبات التسجيل حسب الدورة', d.reg_courses, function (r) { return courseName(r.k); }, N, 'من نموذج التسجيل');
  }
  function renderTable(d) {
    $('st-daily').innerHTML = (d.daily || []).slice().reverse().map(function (r) {
      return '<tr><td>' + day(r.day, true) + '</td><td>' + n(r.visitors) + '</td><td>' + n(r['new']) + '</td><td>' + n(r.views) + '</td><td>' +
        n(r.registers) + '</td><td>' + n(r.downloads) + '</td><td>' + n(r.members) + '</td></tr>';
    }).join('');
  }

  function render() {
    if (!data) return;
    renderKpis(data); renderCharts(data); renderLists(data); renderTable(data);
    $('st-msg').textContent = data.all_time.views ? '' :
      'لم تُسجَّل أي زيارة بعد. تبدأ الأرقام بالظهور بعد نشر النسخة الجديدة من الموقع وزيارته من الإنترنت (الزيارات من النسخة المحلية على جهازك لا تُحتسب).';
    $('st-msg').classList.toggle('info', !data.all_time.views);
  }

  function days() { var c = document.querySelector('input[name="st-range"]:checked'); return c ? +c.value : 30; }

  function load() {
    if (busy) return Promise.resolve(); busy = true;
    $('st-refresh').disabled = true;
    if (!data) $('st-kpis').innerHTML = '<p class="small-note">جاري تحميل الإحصائيات…</p>';
    return SB.stats(days(), TZ).then(function (d) {
      if (!d || !d.totals || !d.daily) throw new Error('الإحصائيات غير مفعَّلة بعد: شغّل الملف _setup/supabase/stats.sql مرة واحدة في SQL Editor.');
      data = d; $('st-msg').classList.remove('info'); render();
    }).catch(function (e) {
      // خطأ في الإحصائيات لا يوقف بقية لوحة الإدارة
      $('st-kpis').innerHTML = ''; $('st-msg').classList.remove('info'); $('st-msg').textContent = e && e.message || String(e);
    }).then(function () { busy = false; $('st-refresh').disabled = false; });
  }

  function init() {
    // أوّل مرة يفتح فيها الأدمن اللوحة من متصفح ما: لا تُحتسب زياراته منه (يمكن تغيير ذلك من المربّع)
    var cb = $('st-notrack');
    try {
      if (localStorage.getItem('delta_no_track') === null) localStorage.setItem('delta_no_track', '1');
      cb.checked = localStorage.getItem('delta_no_track') === '1';
    } catch (e) { cb.disabled = true; }
    cb.addEventListener('change', function () { try { localStorage.setItem('delta_no_track', cb.checked ? '1' : '0'); } catch (e) {} });
    $('st-range').addEventListener('change', load);
    $('st-refresh').addEventListener('click', load);
    var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { if (data) renderCharts(data); }, 150); });
    return load();
  }

  return { init: init, load: load };
})();
