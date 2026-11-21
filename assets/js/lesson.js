(function () {
  var C = window.COURSE;
  var q = new URLSearchParams(location.search);
  var n = parseInt(q.get('u'), 10);
  if (isNaN(n) || n < 0 || n >= C.units.length) n = 0;
  var u = C.units[n];

  document.title = 'الوحدة ' + n + ': ' + u.axis + ' — ' + (SITE.name || '');
  document.getElementById('crumb').textContent = 'الوحدة ' + n;
  document.getElementById('title').innerHTML = ltr(u.axis);
  document.getElementById('ex-title').innerHTML = (u.exercise ? '<b>' + u.exercise + ':</b> ' : '') + ltr(u.exTitle);

  var chips = ['الوحدة ' + n + ' من ' + (C.units.length - 1)];
  if (u.area) chips.push('منطقة الدراسة: ' + C.areas[u.area].name);
  u.tools.forEach(function (t) { chips.push('<span class="ltr">' + t + '</span>'); });
  document.getElementById('chips').innerHTML = chips.map(function (c) { return '<span class="chip">' + c + '</span>'; }).join('') +
    '<a class="textlink" href="' + (C.guidePdf || '') + '">الدليل المفصّل (PDF)</a>';

  document.getElementById('toc').innerHTML = C.units.map(function (x) {
    return '<li><a href="lesson.html?u=' + x.n + '"' + (x.n === n ? ' aria-current="page"' : '') + '><span class="n">' + x.n + '</span><span>' + ltr(x.axis) + '</span></a></li>';
  }).join('');

  document.getElementById('objectives').innerHTML = u.objectives.map(function (o) { return '<li>' + ltr(o) + '</li>'; }).join('');

  // Exercise outline + detailed "how to" from the course guide (assets/js/guide.js)
  var G = (window.GUIDE && GUIDE.units && GUIDE.units[n]) || { steps: {} };
  var detailed = 0;
  document.getElementById('steps').innerHTML = u.steps.map(function (s, i) {
    var how = G.steps[String(i + 1)] || '';
    if (how) detailed++;
    var label = /^(مقدمة|الجزء النظري|أهداف التمرين|أهداف التعلّم|تقديم المقرر|المنهجية التطبيقية والأهداف|الفئة المستهدفة|إعلانات الدورة)$/.test(s.t) ? 'اقرأ الشرح' : 'طريقة التنفيذ';
    return '<li><div class="step-body"><span class="st">' + ltr(s.t) + '</span>' +
      (s.sub ? '<ul>' + s.sub.map(function (x) { return '<li>' + ltr(x) + '</li>'; }).join('') + '</ul>' : '') +
      (how ? '<details class="how"><summary>' + label + '</summary><div class="guide">' + how + '</div></details>' : '') +
      '</div></li>';
  }).join('');
  if (detailed) {
    document.getElementById('steps-hint').hidden = false;
    var tg = document.getElementById('toggle-all');
    tg.hidden = false;
    tg.addEventListener('click', function () {
      var all = document.querySelectorAll('#steps details.how');
      var open = !Array.prototype.every.call(all, function (d) { return d.open; });
      Array.prototype.forEach.call(all, function (d) { d.open = open; });
      tg.textContent = open ? 'أخفِ كل التفاصيل' : 'اعرض كل التفاصيل';
    });
  }
  if (G.extras) { document.getElementById('extras-sec').hidden = false; document.getElementById('extras').innerHTML = G.extras; }
  if (G.ge) {
    document.getElementById('ge-sec').hidden = false;
    document.getElementById('ge').innerHTML = G.ge;
    document.getElementById('ge-opt').hidden = !G.geOptional;
    document.getElementById('ge-title').innerHTML = G.geOptional
      ? 'تطبيق اختياري في <span class="ltr">Google Earth Pro</span>'
      : 'في <span class="ltr">Google Earth Pro</span>';
  }
  if (G.result) { document.getElementById('result-sec').hidden = false; document.getElementById('result').innerHTML = G.result; }

  // Materials: the section stays hidden until files are added in data.js
  var label = { pdf: 'PDF', zip: 'ZIP' };
  var desc = { pdf: 'كتاب التمرين', zip: 'مجلد البيانات' };
  if (u.materials.length) {
    document.getElementById('materials-sec').hidden = false;
    document.getElementById('files').innerHTML = u.materials.map(function (m) {
      return '<a class="file" href="' + m.file + '" download><span class="ext ' + m.type + '">' + (label[m.type] || '•') + '</span><span>' + m.label + '<small>' + (desc[m.type] || '') + '</small></span></a>';
    }).join('');
  }

  var prev = C.units[n - 1], next = C.units[n + 1];
  document.getElementById('pager').innerHTML =
    (prev ? '<a href="lesson.html?u=' + prev.n + '"><small>الوحدة السابقة</small><b>' + ltr(prev.axis) + '</b></a>' : '<span></span>') +
    (next ? '<a href="lesson.html?u=' + next.n + '" style="text-align:left"><small>الوحدة التالية</small><b>' + ltr(next.axis) + '</b></a>'
          : '<a href="program.html" style="text-align:left"><small>هذه آخر وحدة</small><b>العودة إلى البرنامج</b></a>');
})();
