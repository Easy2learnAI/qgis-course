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
  document.getElementById('chips').innerHTML = chips.map(function (c) { return '<span class="chip">' + c + '</span>'; }).join('');

  document.getElementById('toc').innerHTML = C.units.map(function (x) {
    return '<li><a href="lesson.html?u=' + x.n + '"' + (x.n === n ? ' aria-current="page"' : '') + '><span class="n">' + x.n + '</span><span>' + ltr(x.axis) + '</span></a></li>';
  }).join('');

  document.getElementById('objectives').innerHTML = u.objectives.map(function (o) { return '<li>' + ltr(o) + '</li>'; }).join('');

  // Exercise outline (read-only; the exercises are done together during the course)
  document.getElementById('steps').innerHTML = u.steps.map(function (s) {
    return '<li><span class="st">' + ltr(s.t) + '</span>' +
      (s.sub ? '<ul>' + s.sub.map(function (x) { return '<li>' + ltr(x) + '</li>'; }).join('') + '</ul>' : '') + '</li>';
  }).join('');

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
