/* الصفحة الرئيسية: الورقة التفاعلية، بطاقات الدورات والكتب، الأهداف، مسار الوحدات، الأدوات، الأسئلة، وخريطة مناطق الدراسة */
(function () {
  var T = window.TERRAIN, C = window.COURSE;
  var OX = 40, OY = 40, MW = T.W, MH = T.H;
  var LON0 = 4.95, LON1 = 5.17, LAT0 = 36.80, LAT1 = 36.62;
  function xOf(lon) { return (lon - LON0) / (LON1 - LON0) * MW; }
  function yOf(lat) { return (LAT0 - lat) / (LAT0 - LAT1) * MH; }
  function dms(v, pos, neg) {
    var h = v >= 0 ? pos : neg; v = Math.abs(v);
    var d = Math.floor(v), m = Math.floor((v - d) * 60), s = Math.round(((v - d) * 60 - m) * 60);
    if (s === 60) { s = 0; m++; }
    return d + '°' + String(m).padStart(2, '0') + "'" + String(s).padStart(2, '0') + '" ' + h;
  }
  function getLang() { return (window.I18N && window.I18N.getLang()) || 'ar'; }
  function tr(k, fb) { return window.I18N ? window.I18N.t(k, fb) : fb; }
  var $ = function (id) { return document.getElementById(id); };

  /* ---------------- الورقة الطوبوغرافية التفاعلية ---------------- */
  var lons = [5.0, 5.05, 5.1, 5.15], lats = [36.75, 36.7, 36.65];
  var tick = function (deg) { var d = Math.floor(deg), m = Math.round((deg - d) * 60); return d + '°' + String(m).padStart(2, '0') + "'"; };

  var s = '';
  s += '<svg class="map" viewBox="0 0 ' + (MW + 2 * OX) + ' ' + (MH + OY + 52) + '" role="img" aria-labelledby="sheet-t">';
  s += '<title id="sheet-t">' + esc(tr('sheet_svg_title')) + '</title>';
  s += '<defs><clipPath id="clipmap"><rect width="' + MW + '" height="' + MH + '"/></clipPath>' +
       '<pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#2a6fb0" stroke-width="1" opacity=".55"/></pattern></defs>';
  s += '<g class="map-body">';
  // collar
  s += '<g class="collar">';
  s += '<rect x="' + (OX - 8) + '" y="' + (OY - 8) + '" width="' + (MW + 16) + '" height="' + (MH + 16) + '" fill="none" stroke="#1c2b39" stroke-width="1"/>';
  s += '<rect x="' + OX + '" y="' + OY + '" width="' + MW + '" height="' + MH + '" fill="none" stroke="#1c2b39" stroke-width="1.6"/>';
  s += '<text class="title" x="' + (OX + MW) + '" y="' + (OY - 20) + '" text-anchor="end" id="sheet-title">' + esc(tr('sheet_title')) + '</text>';
  s += '<text x="' + OX + '" y="' + (OY - 20) + '">1:50 000</text>';
  lons.forEach(function (l) {
    var x = OX + xOf(l);
    s += '<line x1="' + x + '" y1="' + (OY - 8) + '" x2="' + x + '" y2="' + OY + '" stroke="#1c2b39"/><line x1="' + x + '" y1="' + (OY + MH) + '" x2="' + x + '" y2="' + (OY + MH + 8) + '" stroke="#1c2b39"/>';
    s += '<text x="' + x + '" y="' + (OY + MH + 22) + '" text-anchor="middle">' + tick(l) + ' E</text>';
  });
  lats.forEach(function (l) {
    var y = OY + yOf(l);
    s += '<line x1="' + (OX - 8) + '" y1="' + y + '" x2="' + OX + '" y2="' + y + '" stroke="#1c2b39"/><line x1="' + (OX + MW) + '" y1="' + y + '" x2="' + (OX + MW + 8) + '" y2="' + y + '" stroke="#1c2b39"/>';
    s += '<text x="' + (OX - 12) + '" y="' + (y + 3) + '" text-anchor="end">' + tick(l) + '</text>';
  });
  s += '<g transform="translate(' + OX + ',' + (OY + MH + 34) + ')"><rect width="41" height="5" fill="#1c2b39"/><rect x="41" width="41" height="5" fill="#fff" stroke="#1c2b39" stroke-width=".8"/><rect x="82" width="41" height="5" fill="#1c2b39"/><rect x="123" width="41" height="5" fill="#fff" stroke="#1c2b39" stroke-width=".8"/>' +
       '<text x="0" y="16">0</text><text x="164" y="16" text-anchor="middle">5 km</text></g>';
  s += '<text x="' + (OX + MW) + '" y="' + (OY + MH + 46) + '" text-anchor="end" style="font-size:9px" id="sheet-note">' + esc(tr('sheet_note')) + '</text>';
  s += '</g>';
  // map content
  s += '<g transform="translate(' + OX + ',' + OY + ')" clip-path="url(#clipmap)">';
  s += '<rect width="' + MW + '" height="' + MH + '" fill="#fbfbf8"/>';
  s += '<image data-layer="dem" href="assets/img/dem.webp" width="' + MW + '" height="' + MH + '" preserveAspectRatio="none"/>';
  s += '<image data-layer="hillshade" href="assets/img/hillshade.webp" width="' + MW + '" height="' + MH + '" preserveAspectRatio="none" opacity=".85"/>';
  s += '<path d="' + T.sea + '" fill="#d6e6f3"/>';
  s += '<g class="contours" data-layer="contours">' + T.contours.map(function (c) {
    return '<path class="' + (c.index ? 'idx' : '') + '" d="' + c.d + '"/>'; }).join('') + '</g>';
  s += '<path class="coast" d="' + T.coast + '"/>';
  s += '<g class="vec">';
  s += '<g data-layer="sebkha"><path class="sebkha" d="' + T.sebkha + '"/><path d="' + T.sebkha + '" fill="url(#hatch)"/></g>';
  s += '<g data-layer="rivers"><path class="river" d="' + T.river + '"/><path class="river" style="stroke-width:1.6" d="' + T.trib + '"/></g>';
  s += '<g data-layer="peaks">' + T.peaks.map(function (p) {
    return '<g class="peak"><path d="M' + (p.x - 6) + ',' + (p.y + 5) + ' L' + p.x + ',' + (p.y - 6) + ' L' + (p.x + 6) + ',' + (p.y + 5) + 'Z"/>' +
      '<text x="' + (p.x + 9) + '" y="' + (p.y + 4) + '">' + p.h + '</text></g>'; }).join('') + '</g>';
  s += '</g>';
  // GCPs (printed graticule intersections)
  var gcps = [[lons[0], lats[0]], [lons[3], lats[0]], [lons[3], lats[2]], [lons[0], lats[2]]];
  gcps.forEach(function (g, i) {
    var x = xOf(g[0]), y = yOf(g[1]);
    s += '<g class="gcp" id="gcp' + i + '"><circle cx="' + x + '" cy="' + y + '" r="9"/><line x1="' + (x - 15) + '" y1="' + y + '" x2="' + (x + 15) + '" y2="' + y + '"/><line x1="' + x + '" y1="' + (y - 15) + '" x2="' + x + '" y2="' + (y + 15) + '"/><text x="' + (x + 12) + '" y="' + (y - 11) + '">GCP ' + (i + 1) + '</text></g>';
  });
  s += '</g></g>';
  // target graticule
  s += '<g class="graticule" transform="translate(' + OX + ',' + OY + ')">';
  lons.forEach(function (l) { s += '<line x1="' + xOf(l) + '" y1="0" x2="' + xOf(l) + '" y2="' + MH + '"/>'; });
  lats.forEach(function (l) { s += '<line x1="0" y1="' + yOf(l) + '" x2="' + MW + '" y2="' + yOf(l) + '"/>'; });
  s += '</g>';
  s += '<rect class="hit" x="' + OX + '" y="' + OY + '" width="' + MW + '" height="' + MH + '" fill="transparent"/>';
  s += '</svg>';


  var sheet = $('sheet');
  if (sheet) {
    sheet.querySelector('.sheet-frame').innerHTML = s;
    var svg = sheet.querySelector('svg.map');
    var msg = sheet.querySelector('.statusbar .msg');
    var coords = sheet.querySelector('.statusbar .coords');
    var timers = [], stageKey = 'sheet_idle', gcpN = 0;
    var gcpEls = [0, 1, 2, 3].map(function (i) { return $('gcp' + i); });

    function say(k) { stageKey = k; msg.textContent = tr(k) + (k === 'sheet_s1' ? ' ' + gcpN + ' / 4' : ''); }
    function stage(n, k) { sheet.className = 'sheet s' + n; if (k) say(k); }
    function run() {
      timers.forEach(clearTimeout); timers = [];
      gcpEls.forEach(function (g) { g.classList.remove('on'); });
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { stage(4, 'sheet_idle'); return; }
      stage(0, 'sheet_s0');
      [0, 1, 2, 3].forEach(function (i) {
        timers.push(setTimeout(function () { gcpN = i + 1; stage(1, 'sheet_s1'); gcpEls[i].classList.add('on'); }, 700 + i * 380));
      });
      timers.push(setTimeout(function () { stage(2, 'sheet_s2'); }, 2400));
      timers.push(setTimeout(function () { stage(3, 'sheet_s3'); }, 3600));
      timers.push(setTimeout(function () { stage(4, 'sheet_s4'); }, 4700));
      timers.push(setTimeout(function () { say('sheet_idle'); }, 7600));
    }
    // لا تبدأ الحركة إلا عندما تكون الورقة ظاهرة (توفير للمعالج على الهواتف)
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); run(); } });
      io.observe(sheet);
    } else run();
    sheet.querySelector('[data-replay]').addEventListener('click', run);

    sheet.querySelector('.layers').addEventListener('change', function (e) {
      var inp = e.target; if (!inp.value) return;
      svg.querySelectorAll('[data-layer="' + inp.value + '"]').forEach(function (g) { g.classList.toggle('layer-off', !inp.checked); });
    });

    var hit = svg.querySelector('.hit'), raf = 0, last = null;
    hit.addEventListener('mousemove', function (e) {
      last = e; if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var p = svg.createSVGPoint(); p.x = last.clientX; p.y = last.clientY;
        var q = p.matrixTransform(svg.getScreenCTM().inverse());
        var lon = LON0 + (q.x - OX) / MW * (LON1 - LON0), lat = LAT0 - (q.y - OY) / MH * (LAT0 - LAT1);
        coords.textContent = dms(lat, 'N', 'S') + '  ' + dms(lon, 'E', 'W');
      });
    });
    hit.addEventListener('mouseleave', function () { coords.textContent = 'EPSG:4326'; });

    window.addEventListener('deltalangchange', function () {
      say(stageKey);
      $('sheet-title').textContent = tr('sheet_title');
      $('sheet-note').textContent = tr('sheet_note');
      $('sheet-t').textContent = tr('sheet_svg_title');
    });
  }

  /* ---------------- رموز الأهداف ---------------- */
  var SYM = {
    setup: '<rect x="4" y="5" width="36" height="24" rx="2" fill="#fbfbf8" stroke="#1c2b39" stroke-width="1.5"/><rect x="4" y="5" width="36" height="6" fill="#1c2b39"/><rect x="8" y="14" width="8" height="11" fill="#e3ecd6" stroke="#4b5a68" stroke-width=".8"/><path d="M19 22 C24 16 28 24 36 17" stroke="#a0612f" fill="none" stroke-width="1.4"/>',
    vector: '<circle cx="8" cy="22" r="3.5" fill="#1c2b39"/><path d="M14 26 L22 10 L28 20" fill="none" stroke="#2a6fb0" stroke-width="2"/><path d="M30 8 L41 12 L39 26 L30 24Z" fill="#dae8f4" stroke="#2a6fb0" stroke-width="1.5"/>',
    crs: '<circle cx="22" cy="16" r="13" fill="#fbfbf8" stroke="#1c2b39" stroke-width="1.5"/><ellipse cx="22" cy="16" rx="6" ry="13" fill="none" stroke="#a0612f"/><path d="M9 16 H35 M11 9 H33 M11 23 H33" stroke="#a0612f"/>',
    gcp: '<rect x="4" y="4" width="36" height="24" fill="#f1e5d8" stroke="#a0612f" stroke-dasharray="3 2" transform="rotate(-5 22 16)"/><circle cx="22" cy="16" r="6" fill="none" stroke="#7a2e8c" stroke-width="2"/><path d="M22 5 V27 M11 16 H33" stroke="#7a2e8c" stroke-width="2"/>',
    style: '<rect x="3" y="8" width="12" height="16" fill="#e3ecd6" stroke="#1c2b39"/><rect x="16" y="8" width="12" height="16" fill="#e6c9a3" stroke="#1c2b39"/><rect x="29" y="8" width="12" height="16" fill="#a0612f" stroke="#1c2b39"/>',
    raster: (function () { var o = '', c = ['#e3ecd6', '#d9c9a0', '#c49a73', '#a0612f']; for (var i = 0; i < 4; i++) for (var j = 0; j < 6; j++) o += '<rect x="' + (4 + j * 6) + '" y="' + (4 + i * 6) + '" width="6" height="6" fill="' + c[(i + j) % 4] + '"/>'; return o + '<rect x="4" y="4" width="36" height="24" fill="none" stroke="#1c2b39"/>'; })(),
    layout: '<rect x="6" y="2" width="32" height="28" fill="#fbfbf8" stroke="#1c2b39" stroke-width="1.5"/><rect x="9" y="7" width="20" height="16" fill="#dae8f4"/><path d="M9 19 C14 14 19 21 29 13" stroke="#a0612f" fill="none"/><rect x="31" y="7" width="4" height="3" fill="#1c2b39"/><rect x="31" y="12" width="4" height="3" fill="#a0612f"/><rect x="9" y="25" width="10" height="2" fill="#1c2b39"/><path d="M33 19 L35 25 L31 25Z" fill="#1c2b39"/>'
  };

  /* ---------------- بطاقات الدورات: QGIS + ما يضيفه الأدمن ---------------- */
  var CO = window.COURSES, courses = CO.cached();
  function renderCourses(cur) {
    var grid = $('home-courses-grid');
    if (!grid) return;
    grid.innerHTML = courses.slice(0, 3).map(function (c) { return CO.cardHtml(CO.localize(c, cur)); }).join('');
  }
  CO.load().then(function (rows) { courses = rows; renderCourses(getLang()); });

  /* ---------------- أحدث الكتب (من قاعدة البيانات، مع نسخة مخزّنة تظهر فوراً) ---------------- */
  var books = (window.BOOKS && window.BOOKS.cached()) || [];
  function renderBooks(cur) {
    var sec = $('featured-books'), grid = $('home-books-grid');
    if (!sec || !grid) return;
    sec.hidden = !books.length;
    grid.innerHTML = books.slice(0, 4).map(function (raw) {
      var b = window.BOOKS.localize(raw, cur);
      return '<article class="book-card">' + window.BOOKS.coverHtml(b) +
        '<div class="book-info"><h3 class="book-title">' + txt(b.title) + '</h3>' +
        '<p class="book-author">' + txt(b.author || '—') + '</p>' +
        '<div class="book-action">' + (/^https?:\/\//i.test(b.drive_url)
          ? '<a class="btn small book-dl-btn" href="' + esc(b.drive_url) + '" target="_blank" rel="noopener noreferrer">' + esc(tr('btn_download_drive')) + '</a>'
          : '<a class="btn small quiet book-dl-btn" href="books.html">' + esc(tr('btn_view_book_details')) + '</a>') + '</div>' +
        '</div></article>';
    }).join('');
  }
  if (window.BOOKS) window.BOOKS.load().then(function (rows) { books = rows || []; renderBooks(getLang()); }, function () {});

  /* ---------------- الأهداف، المسار، الأدوات، الأسئلة، المناطق ---------------- */
  var AREA_KEYS = ['bejaia', 'blida-mountains', 'eloued'];
  function renderAll() {
    var cur = getLang();
    renderCourses(cur);
    renderBooks(cur);

    var legend = $('legend');
    if (legend) legend.innerHTML = C.objectives.map(function (raw) {
      var o = C.getLocalizedObjective(raw, cur);
      return '<li><svg viewBox="0 0 44 32" width="44" height="32" aria-hidden="true">' + SYM[o.sym] + '</svg><span>' + txt(o.t) + '</span></li>';
    }).join('');

    var trv = $('traverse');
    if (trv) trv.innerHTML = C.units.map(function (raw) {
      var u = C.getLocalizedUnit(raw, cur);
      var area = '';
      if (u.area) area = '<span class="tag ' + (u.area === 'eloued' ? 'contour' : 'water') + '">' + esc(C.getLocalizedArea(u.area, cur).name) + '</span>';
      return '<li><span class="station">' + u.n + '</span><div><span class="ex">' + (u.exercise ? esc(u.exercise) + ' — ' : '') + esc(tr('unit_badge_pfx')) + u.n + '</span>' +
        '<h3>' + txt(u.axis) + area + '</h3><p>' + txt(u.summary) + '</p></div>' +
        '<a class="textlink go" href="lesson.html?u=' + u.n + '">' + esc(tr('unit_details_btn')) + '</a></li>';
    }).join('');

    var tt = $('tools-body');
    if (tt) tt.innerHTML = C.tools.map(function (raw) {
      var t = C.getLocalizedTool(raw, cur);
      return '<tr><td><a class="ltr" href="' + t.url + '" target="_blank" rel="noopener">' + esc(t.name) + '</a></td><td>' + txt(t.role) + '</td><td class="price">' + esc(t.price) + '</td></tr>';
    }).join('');

    var fq = $('faq');
    if (fq) {
      var open = [].map.call(fq.querySelectorAll('details'), function (d) { return d.open; });
      fq.innerHTML = C.getLocalizedFaq(cur).map(function (f, i) {
        return '<details' + (open[i] ? ' open' : '') + '><summary><span>' + txt(f.q) + '</span></summary><p>' + txt(f.a) + '</p></details>';
      }).join('');
    }

    var list = $('area-list');
    if (list) list.innerHTML = AREA_KEYS.map(function (k) {
      var a = C.getLocalizedArea(k, cur);
      return '<li><button type="button" data-area="' + k + '"><h3>' + esc(a.name) + '<small>' + esc(a.ex) + '</small></h3><p>' + txt(a.what) + '</p></button></li>';
    }).join('');
  }
  renderAll();
  window.addEventListener('deltalangchange', function () { renderAll(); if (map) updatePopups(); });

  /* ---------------- خريطة مناطق الدراسة: تُحمَّل Leaflet فقط عند الاقتراب من القسم ---------------- */
  var mapEl = $('areas-map'), map = null, markers = {};
  var LEAFLET = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.';
  function popupHtml(k) { var a = C.getLocalizedArea(k); return '<b>' + esc(a.name) + '</b><br>' + esc(a.ex); }
  function updatePopups() { AREA_KEYS.forEach(function (k) { markers[k].setPopupContent(popupHtml(k)); }); }
  function fail() { mapEl.innerHTML = '<div class="map-fallback">' + esc(tr('map_offline')) + '</div>'; }
  function initMap() {
    if (typeof L === 'undefined') return fail();
    map = L.map(mapEl, { scrollWheelZoom: false }).setView([35.85, 5.3], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 17, attribution: '&copy; OpenStreetMap' }).addTo(map);
    var icon = L.divIcon({ className: '', html: '<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="8" fill="none" stroke="#7a2e8c" stroke-width="2.5"/><path d="M13 1v24M1 13h24" stroke="#7a2e8c" stroke-width="2"/></svg>', iconSize: [26, 26], iconAnchor: [13, 13] });
    AREA_KEYS.forEach(function (k) { markers[k] = L.marker(C.areas[k].ll, { icon: icon }).addTo(map).bindPopup(popupHtml(k)); });
  }
  function loadLeaflet() {
    var css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = LEAFLET + 'css';
    document.head.appendChild(css);
    var js = document.createElement('script');
    js.src = LEAFLET + 'js'; js.async = true;
    js.onload = initMap; js.onerror = fail;
    document.head.appendChild(js);
  }
  if (mapEl) {
    if ('IntersectionObserver' in window) {
      var mo = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { mo.disconnect(); loadLeaflet(); } }, { rootMargin: '400px' });
      mo.observe(mapEl);
    } else loadLeaflet();
    $('area-list').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-area]'); if (!b || !map) return;
      var k = b.getAttribute('data-area');
      map.flyTo(C.areas[k].ll, 9, { duration: .8 }); markers[k].openPopup();
    });
  }
})();
