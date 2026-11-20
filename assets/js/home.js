/* Home page: interactive georeferencing sheet, objectives legend, unit traverse, study-area map, FAQ */
(function () {
  var T = window.TERRAIN, C = window.COURSE;
  var NS = 'http://www.w3.org/2000/svg';
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

  /* ---------------- sheet ---------------- */
  var lons = [5.0, 5.05, 5.1, 5.15], lats = [36.75, 36.7, 36.65];
  var tick = function (deg) { var d = Math.floor(deg), m = Math.round((deg - d) * 60); return d + '°' + String(m).padStart(2, '0') + "'"; };

  var s = '';
  s += '<svg class="map" viewBox="0 0 ' + (MW + 2 * OX) + ' ' + (MH + OY + 52) + '" role="img" aria-labelledby="sheet-t">';
  s += '<title id="sheet-t">ورقة طوبوغرافية توضيحية لساحل بجاية مع طبقات قابلة للإظهار والإخفاء</title>';
  s += '<defs><clipPath id="clipmap"><rect width="' + MW + '" height="' + MH + '"/></clipPath>' +
       '<pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#2a6fb0" stroke-width="1" opacity=".55"/></pattern></defs>';
  s += '<g class="map-body">';
  // collar
  s += '<g class="collar">';
  s += '<rect x="' + (OX - 8) + '" y="' + (OY - 8) + '" width="' + (MW + 16) + '" height="' + (MH + 16) + '" fill="none" stroke="#1c2b39" stroke-width="1"/>';
  s += '<rect x="' + OX + '" y="' + OY + '" width="' + MW + '" height="' + MH + '" fill="none" stroke="#1c2b39" stroke-width="1.6"/>';
  s += '<text class="title" x="' + (OX + MW) + '" y="' + (OY - 20) + '" text-anchor="end">بجاية — ورقة توضيحية</text>';
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
  s += '<text x="' + (OX + MW) + '" y="' + (OY + MH + 46) + '" text-anchor="end" style="font-size:9px">تمثيل توضيحي لأغراض التدريب — ليس خريطة رسمية</text>';
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
  // GCPs (printed graticule intersections, travel with the scan)
  var gcps = [[lons[0], lats[0]], [lons[3], lats[0]], [lons[3], lats[2]], [lons[0], lats[2]]];
  gcps.forEach(function (g, i) {
    var x = xOf(g[0]), y = yOf(g[1]);
    s += '<g class="gcp" id="gcp' + i + '"><circle cx="' + x + '" cy="' + y + '" r="9"/><line x1="' + (x - 15) + '" y1="' + y + '" x2="' + (x + 15) + '" y2="' + y + '"/><line x1="' + x + '" y1="' + (y - 15) + '" x2="' + x + '" y2="' + (y + 15) + '"/><text x="' + (x + 12) + '" y="' + (y - 11) + '">GCP ' + (i + 1) + '</text></g>';
  });
  s += '</g></g>';
  // target graticule (true coordinates — does not move)
  s += '<g class="graticule" transform="translate(' + OX + ',' + OY + ')">';
  lons.forEach(function (l) { s += '<line x1="' + xOf(l) + '" y1="0" x2="' + xOf(l) + '" y2="' + MH + '"/>'; });
  lats.forEach(function (l) { s += '<line x1="0" y1="' + yOf(l) + '" x2="' + MW + '" y2="' + yOf(l) + '"/>'; });
  s += '</g>';
  s += '<rect class="hit" x="' + OX + '" y="' + OY + '" width="' + MW + '" height="' + MH + '" fill="transparent"/>';
  s += '</svg>';

  var sheet = document.getElementById('sheet');
  if (sheet) {
    sheet.querySelector('.sheet-frame').innerHTML = s;
    var svg = sheet.querySelector('svg.map');
    var msg = sheet.querySelector('.statusbar .msg');
    var coords = sheet.querySelector('.statusbar .coords');
    var idle = 'حرّك المؤشر فوق الخريطة لقراءة الإحداثيات';
    var timers = [];
    function stage(n, text) { sheet.className = 'sheet s' + n; if (text) msg.textContent = text; }
    function run() {
      timers.forEach(clearTimeout); timers = [];
      for (var i = 0; i < 4; i++) document.getElementById('gcp' + i).classList.remove('on');
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { stage(4, idle); return; }
      stage(0, 'خريطة ممسوحة ضوئياً — بدون إسناد جغرافي');
      [0, 1, 2, 3].forEach(function (i) {
        timers.push(setTimeout(function () {
          stage(1, 'إضافة نقاط التحكم الأرضية ' + (i + 1) + ' / 4');
          document.getElementById('gcp' + i).classList.add('on');
        }, 700 + i * 380));
      });
      timers.push(setTimeout(function () { stage(2, 'تحويل الخريطة إلى الإحداثيات الحقيقية…'); }, 2400));
      timers.push(setTimeout(function () { stage(3, 'تم الإرجاع الجغرافي — RMS = 0.42 بكسل'); }, 3600));
      timers.push(setTimeout(function () { stage(4, 'الرقمنة: قمم (نقاط)، أنهار (خطوط)، سبخة (مضلّع)'); }, 4700));
      timers.push(setTimeout(function () { msg.textContent = idle; }, 7600));
    }
    run();
    sheet.querySelector('[data-replay]').addEventListener('click', run);

    sheet.querySelectorAll('.layers input').forEach(function (inp) {
      inp.addEventListener('change', function () {
        svg.querySelectorAll('[data-layer="' + inp.value + '"]').forEach(function (g) { g.classList.toggle('layer-off', !inp.checked); });
      });
    });

    var hit = svg.querySelector('.hit');
    hit.addEventListener('mousemove', function (e) {
      var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
      var q = p.matrixTransform(svg.getScreenCTM().inverse());
      var x = q.x - OX, y = q.y - OY;
      var lon = LON0 + x / MW * (LON1 - LON0), lat = LAT0 - y / MH * (LAT0 - LAT1);
      coords.textContent = dms(lat, 'N', 'S') + '  ' + dms(lon, 'E', 'W');
    });
    hit.addEventListener('mouseleave', function () { coords.textContent = 'EPSG:4326'; });
  }

  /* ---------------- objectives legend ---------------- */
  var SYM = {
    setup: '<rect x="4" y="5" width="36" height="24" rx="2" fill="#fbfbf8" stroke="#1c2b39" stroke-width="1.5"/><rect x="4" y="5" width="36" height="6" fill="#1c2b39"/><rect x="8" y="14" width="8" height="11" fill="#e3ecd6" stroke="#4b5a68" stroke-width=".8"/><path d="M19 22 C24 16 28 24 36 17" stroke="#a0612f" fill="none" stroke-width="1.4"/>',
    vector: '<circle cx="8" cy="22" r="3.5" fill="#1c2b39"/><path d="M14 26 L22 10 L28 20" fill="none" stroke="#2a6fb0" stroke-width="2"/><path d="M30 8 L41 12 L39 26 L30 24Z" fill="#dae8f4" stroke="#2a6fb0" stroke-width="1.5"/>',
    crs: '<circle cx="22" cy="16" r="13" fill="#fbfbf8" stroke="#1c2b39" stroke-width="1.5"/><ellipse cx="22" cy="16" rx="6" ry="13" fill="none" stroke="#a0612f"/><path d="M9 16 H35 M11 9 H33 M11 23 H33" stroke="#a0612f"/>',
    gcp: '<rect x="4" y="4" width="36" height="24" fill="#f1e5d8" stroke="#a0612f" stroke-dasharray="3 2" transform="rotate(-5 22 16)"/><circle cx="22" cy="16" r="6" fill="none" stroke="#7a2e8c" stroke-width="2"/><path d="M22 5 V27 M11 16 H33" stroke="#7a2e8c" stroke-width="2"/>',
    style: '<rect x="3" y="8" width="12" height="16" fill="#e3ecd6" stroke="#1c2b39"/><rect x="16" y="8" width="12" height="16" fill="#e6c9a3" stroke="#1c2b39"/><rect x="29" y="8" width="12" height="16" fill="#a0612f" stroke="#1c2b39"/>',
    raster: (function () { var o = '', c = ['#e3ecd6', '#d9c9a0', '#c49a73', '#a0612f']; for (var i = 0; i < 4; i++) for (var j = 0; j < 6; j++) o += '<rect x="' + (4 + j * 6) + '" y="' + (4 + i * 6) + '" width="6" height="6" fill="' + c[(i + j) % 4] + '"/>'; return o + '<rect x="4" y="4" width="36" height="24" fill="none" stroke="#1c2b39"/>'; })(),
    layout: '<rect x="6" y="2" width="32" height="28" fill="#fbfbf8" stroke="#1c2b39" stroke-width="1.5"/><rect x="9" y="7" width="20" height="16" fill="#dae8f4"/><path d="M9 19 C14 14 19 21 29 13" stroke="#a0612f" fill="none"/><rect x="31" y="7" width="4" height="3" fill="#1c2b39"/><rect x="31" y="12" width="4" height="3" fill="#a0612f"/><rect x="9" y="25" width="10" height="2" fill="#1c2b39"/><path d="M33 19 L35 25 L31 25Z" fill="#1c2b39"/>'
  };
  var legend = document.getElementById('legend');
  if (legend) legend.innerHTML = C.objectives.map(function (o) {
    return '<li><svg viewBox="0 0 44 32" aria-hidden="true">' + SYM[o.sym] + '</svg><span>' + ltr(o.t) + '</span></li>';
  }).join('');

  /* ---------------- traverse ---------------- */
  var tr = document.getElementById('traverse');
  if (tr) tr.innerHTML = C.units.map(function (u) {
    var area = u.area ? '<span class="tag ' + (u.area === 'biskra' ? 'contour' : 'water') + '">' + C.areas[u.area].name + '</span>' : '';
    return '<li><span class="station">' + u.n + '</span><div><span class="ex">' + (u.exercise ? u.exercise + ' — ' : '') + 'الوحدة ' + u.n + '</span>' +
      '<h3>' + ltr(u.axis) + area + '</h3><p>' + ltr(u.summary) + '</p></div>' +
      '<a class="textlink go" href="lesson.html?u=' + u.n + '">تفاصيل الوحدة</a></li>';
  }).join('');

  /* ---------------- tools table ---------------- */
  var tt = document.getElementById('tools-body');
  if (tt) tt.innerHTML = C.tools.map(function (t) {
    return '<tr><td><a href="' + t.url + '" target="_blank" rel="noopener">' + t.name + '</a></td><td>' + ltr(t.role) + '</td><td class="price">مجاني</td></tr>';
  }).join('');

  /* ---------------- faq ---------------- */
  var fq = document.getElementById('faq');
  if (fq) fq.innerHTML = C.faq.map(function (f) {
    return '<details><summary><span>' + ltr(f[0]) + '</span></summary><p>' + ltr(f[1]) + '</p></details>';
  }).join('');

  /* ---------------- study areas map ---------------- */
  var list = document.getElementById('area-list');
  var keys = ['bejaia', 'bejaia-mountains', 'biskra'];
  if (list) list.innerHTML = keys.map(function (k) {
    var a = C.areas[k];
    return '<li><button data-area="' + k + '"><h3>' + a.name + '<small>' + a.ex + '</small></h3><p>' + ltr(a.what) + '</p></button></li>';
  }).join('');
  var mapEl = document.getElementById('areas-map');
  if (mapEl) {
    if (typeof L === 'undefined') {
      mapEl.innerHTML = '<div class="map-fallback">الخريطة التفاعلية تحتاج اتصالاً بالإنترنت لتحميل خلفية OpenStreetMap.</div>';
    } else {
      var m = L.map(mapEl, { scrollWheelZoom: false }).setView([35.85, 5.3], 7);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 17, attribution: '&copy; OpenStreetMap' }).addTo(m);
      var icon = L.divIcon({ className: '', html: '<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="8" fill="none" stroke="#7a2e8c" stroke-width="2.5"/><path d="M13 1v24M1 13h24" stroke="#7a2e8c" stroke-width="2"/></svg>', iconSize: [26, 26], iconAnchor: [13, 13] });
      var mk = {};
      keys.forEach(function (k) { var a = C.areas[k]; mk[k] = L.marker(a.ll, { icon: icon }).addTo(m).bindPopup('<b>' + a.name + '</b><br>' + a.ex); });
      list.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-area]'); if (!b) return;
        var k = b.dataset.area; m.flyTo(C.areas[k].ll, 9, { duration: .8 }); mk[k].openPopup();
      });
    }
  }
})();
