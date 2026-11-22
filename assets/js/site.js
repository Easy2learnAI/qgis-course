/* الرأس والتذييل المشتركان + أدوات صغيرة تستعملها كل الصفحات — Delta Conception */
(function () {
  var S = window.SITE || {};
  var page = document.body.getAttribute('data-page') || '';

  function lang() { return (window.I18N && window.I18N.getLang()) || 'ar'; }
  function tr(k, fb) { return window.I18N ? window.I18N.t(k, fb) : fb; }

  /* ---------- أدوات عامة ---------- */
  window.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  // يعزل الكلمات اللاتينية داخل جملة عربية حتى لا يختلط ترتيبها (يُستعمل مع العربية فقط)
  window.ltr = function (s) {
    return String(s == null ? '' : s).replace(/(\(?[A-Za-z][A-Za-z0-9 .\/()\-:,&]*[A-Za-z0-9)])/g, '<span class="ltr">$1</span>');
  };
  // نص آمن للعرض: يُهرَّب دائماً، ويُعزل اللاتيني عند العرض بالعربية
  // يُطبَّق العزل على النص الخام ثم يُهرَّب كل جزء، حتى لا يقطع العزلُ رموزاً مثل &amp; و &lt;
  var LATIN = /(\(?[A-Za-z][A-Za-z0-9 .\/()\-:,&]*[A-Za-z0-9)])/g;
  window.txt = function (s) {
    s = String(s == null ? '' : s);
    if (lang() !== 'ar') return window.esc(s);
    return s.split(LATIN).map(function (part, i) {
      return i % 2 ? '<span class="ltr">' + window.esc(part) + '</span>' : window.esc(part);
    }).join('');
  };
  window.store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  window.fmtSize = function (n) {
    if (!n && n !== 0) return '';
    if (n < 1024) return n + ' B';
    if (n < 1048576) return Math.round(n / 1024) + ' KB';
    return (n / 1048576).toFixed(1) + ' MB';
  };
  window.fmtDate = function (d) {
    if (!d) return '—';
    var loc = { ar: 'ar-DZ-u-nu-latn', en: 'en-GB', fr: 'fr-FR' }[lang()];
    try { return new Date(d).toLocaleDateString(loc, { year: 'numeric', month: 'short', day: 'numeric' }); } catch (e) { return String(d).slice(0, 10); }
  };

  /* ---------- الرأس والتذييل ---------- */
  var MARK =
    '<svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">' +
    '<rect x="1" y="1" width="38" height="38" fill="#fbfbf8" stroke="#1c2b39" stroke-width="2"/>' +
    '<path d="M2 27 C10 22 16 30 24 24 S34 17 38 19" fill="none" stroke="#a0612f" stroke-width="1.6"/>' +
    '<path d="M2 33 C11 28 17 35 26 30 S35 24 38 26" fill="none" stroke="#a0612f" stroke-width="1"/>' +
    '<path d="M2 12 C9 10 14 14 20 11 S32 6 38 8" fill="none" stroke="#2a6fb0" stroke-width="1.6"/>' +
    '<circle cx="20" cy="20" r="6" fill="none" stroke="#7a2e8c" stroke-width="2"/>' +
    '<path d="M20 10v20M10 20h20" stroke="#7a2e8c" stroke-width="2"/></svg>';

  var COLLAR =
    '<div class="scalebar">' +
    '<svg class="north" viewBox="0 0 26 40" width="26" height="40" aria-hidden="true"><path d="M13 2 L22 30 L13 24 L4 30Z" fill="#1c2b39"/><path d="M13 2 L13 24 L4 30Z" fill="#fbfbf8" stroke="#1c2b39"/><text x="13" y="39" text-anchor="middle" font-size="9" font-family="DejaVu Sans" fill="#1c2b39">N</text></svg>' +
    '<svg viewBox="0 0 190 34" width="190" height="34" aria-hidden="true"><g font-family="DejaVu Sans" font-size="9" fill="#4b5a68" text-anchor="middle">' +
    '<rect x="5" y="6" width="45" height="7" fill="#1c2b39"/><rect x="50" y="6" width="45" height="7" fill="#fbfbf8" stroke="#1c2b39"/><rect x="95" y="6" width="45" height="7" fill="#1c2b39"/><rect x="140" y="6" width="45" height="7" fill="#fbfbf8" stroke="#1c2b39"/>' +
    '<text x="5" y="27">0</text><text x="95" y="27">5</text><text x="185" y="27">10 km</text></g></svg>' +
    '</div>';

  var header = null, footer = null, skip = null;

  // الدورات في التذييل: من الكتالوج (courses-data.js) إن كان محمَّلاً
  function footerCourses(cur) {
    var CO = window.COURSES;
    if (!CO) return '<li><a href="program.html">QGIS &amp; Google Earth</a></li>';
    return CO.cached().slice(0, 4).map(function (c) {
      var l = CO.localize(c, cur);
      return '<li><a href="' + (l.builtin ? 'program.html' : 'courses.html') + '">' + esc(l.title) + '</a></li>';
    }).join('');
  }

  function renderLayout() {
    var cur = lang();
    var nav = [
      ['index.html', 'nav_home', 'home'],
      ['courses.html', 'nav_courses', 'courses'],
      ['books.html', 'nav_books', 'books'],
      ['resources.html', 'nav_resources', 'resources'],
      ['files.html', 'nav_files', 'files']
    ];
    var switcher = page === 'admin' ? '' :
      '<li class="lang-li"><div class="lang-switch" role="group" aria-label="' + esc(tr('lang_group', 'اللغة')) + '">' +
      [['ar', 'عربي', 'العربية'], ['en', 'EN', 'English'], ['fr', 'FR', 'Français']].map(function (l) {
        return '<button type="button" class="lang-btn' + (cur === l[0] ? ' active' : '') + '" data-lang="' + l[0] + '" lang="' + l[0] + '" title="' + l[2] + '" aria-pressed="' + (cur === l[0]) + '">' + l[1] + '</button>';
      }).join('') + '</div></li>';

    var h = document.createElement('header');
    h.className = 'site-header';
    h.innerHTML = '<div class="wrap">' +
      '<a class="brand" href="index.html">' + MARK + '<span><b>' + esc(S.name || 'Delta Conception') + '</b><small>' + esc(tr('brand_subtitle', 'أكاديمية الدورات والمكتبة الرقمية')) + '</small></span></a>' +
      '<button class="menu-toggle" type="button" aria-label="' + esc(tr('nav_menu', 'القائمة')) + '" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '<ul class="nav">' + nav.map(function (n) {
        return '<li><a href="' + n[0] + '"' + (page === n[2] ? ' aria-current="page"' : '') + '>' + esc(tr(n[1])) + '</a></li>';
      }).join('') +
      '<li><a class="btn small nav-cta" href="register.html">' + esc(tr('nav_join', 'انضم للمنصة')) + '</a></li>' +
      switcher + '</ul></div>';

    var y = new Date().getFullYear();
    var f = document.createElement('footer');
    f.className = 'site-footer';
    f.innerHTML = '<div class="wrap"><div class="footer-grid">' +
      '<div><h4>' + esc(S.name || 'Delta Conception') + '</h4><p>' + esc(tr('footer_about')) + '</p></div>' +
      '<div><h4>' + esc(tr('footer_courses_title')) + '</h4><ul>' +
        footerCourses(cur) +
        '<li><a href="courses.html">' + esc(tr('footer_all_courses')) + '</a></li>' +
      '</ul></div>' +
      '<div><h4>' + esc(tr('footer_library_title')) + '</h4><ul>' +
        '<li><a href="books.html">' + esc(tr('nav_books')) + '</a></li>' +
        '<li><a href="resources.html">' + esc(tr('nav_resources')) + '</a></li>' +
        '<li><a href="resources.html#glossary">' + esc(tr('footer_glossary')) + '</a></li>' +
        '<li><a href="files.html">' + esc(tr('nav_files')) + '</a></li>' +
      '</ul></div>' +
      '<div><h4>' + esc(tr('footer_contact_title')) + '</h4><ul>' +
        (S.email ? '<li><a class="ltr" href="mailto:' + esc(S.email) + '">' + esc(S.email) + '</a></li>' : '') +
        (S.phone ? '<li class="ltr">' + esc(S.phone) + '</li>' : '') +
        '<li><a href="register.html">' + esc(tr('request_subscription')) + '</a></li>' +
      '</ul></div>' +
      '</div><div class="collar-row">' + COLLAR +
      '<div>© ' + y + ' ' + esc(S.name || 'Delta Conception') + ' · <span class="ltr">EPSG:4326 — WGS 84</span> · ' + esc(tr('footer_all_rights')) + '</div>' +
      '</div></div>';

    var sk = document.createElement('a');
    sk.className = 'skip'; sk.href = '#main'; sk.textContent = tr('nav_skip', 'انتقل إلى المحتوى');

    if (header) header.replaceWith(h); else document.body.insertBefore(h, document.body.firstChild);
    if (skip) skip.replaceWith(sk); else document.body.insertBefore(sk, h);
    if (footer) footer.replaceWith(f); else document.body.appendChild(f);
    header = h; footer = f; skip = sk;
    document.body.classList.remove('menu-open');

    var t = h.querySelector('.menu-toggle');
    t.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      t.setAttribute('aria-expanded', open);
    });
    h.addEventListener('click', function (e) {
      var b = e.target.closest('.lang-btn');
      if (b && window.I18N) window.I18N.setLang(b.getAttribute('data-lang'));
    });
    fitNav();
  }

  // الروابط أطول بالفرنسية والإنجليزية: إن لم تتسع في سطر واحد نستعمل القائمة المطوية بدل تجاوز عرض الشاشة
  function fitNav() {
    var b = document.body, w = header && header.querySelector('.wrap');
    if (!w) return;
    b.classList.remove('nav-collapsed');
    if (w.scrollWidth > w.clientWidth + 1) b.classList.add('nav-collapsed');
  }
  var rz = 0;
  window.addEventListener('resize', function () { cancelAnimationFrame(rz); rz = requestAnimationFrame(fitNav); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNav);

  renderLayout();
  window.addEventListener('deltalangchange', renderLayout);
})();
