/* Shared header + footer, injected on every page */
(function () {
  var S = window.SITE || {};
  var page = document.body.getAttribute('data-page') || '';
  var nav = [
    ['index.html', 'الرئيسية', 'home'],
    ['program.html', 'البرنامج', 'program'],
    ['lesson.html?u=1', 'الوحدات', 'lesson'],
    ['resources.html', 'الموارد', 'resources']
  ];

  var mark =
    '<svg viewBox="0 0 40 40" aria-hidden="true">' +
    '<rect x="1" y="1" width="38" height="38" fill="#fbfbf8" stroke="#1c2b39" stroke-width="2"/>' +
    '<path d="M2 27 C10 22 16 30 24 24 S34 17 38 19" fill="none" stroke="#a0612f" stroke-width="1.6"/>' +
    '<path d="M2 33 C11 28 17 35 26 30 S35 24 38 26" fill="none" stroke="#a0612f" stroke-width="1"/>' +
    '<path d="M2 12 C9 10 14 14 20 11 S32 6 38 8" fill="none" stroke="#2a6fb0" stroke-width="1.6"/>' +
    '<circle cx="20" cy="20" r="6" fill="none" stroke="#7a2e8c" stroke-width="2"/>' +
    '<path d="M20 10v20M10 20h20" stroke="#7a2e8c" stroke-width="2"/></svg>';

  var header =
    '<a class="skip" href="#main">انتقل إلى المحتوى</a>' +
    '<header class="site-header"><div class="wrap">' +
    '<a class="brand" href="index.html">' + mark + '<span><b>' + (S.name || '') + '</b><small>دورة <span class="ltr">QGIS</span> و <span class="ltr">Google Earth</span></small></span></a>' +
    '<button class="menu-toggle" aria-label="القائمة" aria-expanded="false"><span></span><span></span><span></span></button>' +
    '<ul class="nav">' + nav.map(function (n) {
      return '<li><a href="' + n[0] + '"' + (page === n[2] ? ' aria-current="page"' : '') + '>' + n[1] + '</a></li>';
    }).join('') +
    '<li><a class="btn small" href="register.html" style="color:#fff;margin-inline-start:10px">سجّل في الدورة</a></li>' +
    '</ul></div></header>';

  var units = (window.COURSE && COURSE.units) || [];
  var footer =
    '<footer class="site-footer"><div class="wrap">' +
    '<div class="footer-grid">' +
      '<div><h4>' + (S.name || '') + '</h4><p>' + (S.course || '') + '. دورة تأسيسية تطبيقية مبنية على بيانات حقيقية.</p>' +
      '</div>' +
      '<div><h4>الوحدات</h4><ul>' + units.slice(1, 6).map(function (u) {
        return '<li><a href="lesson.html?u=' + u.n + '">' + u.axis.replace('QGIS', '<span class="ltr">QGIS</span>') + '</a></li>';
      }).join('') + '</ul></div>' +
      '<div><h4>الدورة</h4><ul><li><a href="program.html">البرنامج الكامل</a></li><li><a href="resources.html">البرامج والمصطلحات</a></li><li><a href="resources.html#glossary">معجم المصطلحات</a></li><li><a href="register.html">التسجيل</a></li></ul></div>' +
      '<div><h4>تواصل معنا</h4><ul>' + (S.email ? '<li><a href="mailto:' + S.email + '">' + S.email + '</a></li>' : '') + (S.phone ? '<li class="ltr" style="text-align:right">' + S.phone + '</li>' : '') + '<li><a href="register.html">التسجيل في الدورة</a></li></ul></div>' +
    '</div>' +
    '<div class="collar-row">' +
      '<div class="scalebar">' +
        '<svg class="north" viewBox="0 0 26 40" aria-label="اتجاه الشمال"><path d="M13 2 L22 30 L13 24 L4 30Z" fill="#1c2b39"/><path d="M13 2 L13 24 L4 30Z" fill="#fbfbf8" stroke="#1c2b39"/><text x="13" y="39" text-anchor="middle" font-size="9" font-family="DejaVu Sans" fill="#1c2b39">N</text></svg>' +
        '<svg viewBox="0 0 190 34" aria-hidden="true"><g font-family="DejaVu Sans" font-size="9" fill="#4b5a68" text-anchor="middle">' +
        '<rect x="5" y="6" width="45" height="7" fill="#1c2b39"/><rect x="50" y="6" width="45" height="7" fill="#fbfbf8" stroke="#1c2b39"/><rect x="95" y="6" width="45" height="7" fill="#1c2b39"/><rect x="140" y="6" width="45" height="7" fill="#fbfbf8" stroke="#1c2b39"/>' +
        '<text x="5" y="27">0</text><text x="95" y="27">5</text><text x="185" y="27">10 km</text></g></svg>' +
      '</div>' +
      '<div>© <span id="yr"></span> ' + (S.name || '') + ' · <span class="ltr">EPSG:4326 — WGS 84</span></div>' +
    '</div></div></footer>';

  document.body.insertAdjacentHTML('afterbegin', header);
  document.body.insertAdjacentHTML('beforeend', footer);
  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  var t = document.querySelector('.menu-toggle');
  t.addEventListener('click', function () {
    var open = document.body.classList.toggle('menu-open');
    t.setAttribute('aria-expanded', open);
  });

  // helper used by several pages
  window.ltr = function (s) {
    return String(s).replace(/(\(?[A-Za-z][A-Za-z0-9 .\/()\-:,&]*[A-Za-z0-9)])/g, '<span class="ltr">$1</span>');
  };
  window.store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
})();
