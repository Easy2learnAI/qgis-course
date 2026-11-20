(function () {
  var C = window.COURSE;
  var q = new URLSearchParams(location.search);
  var n = parseInt(q.get('u'), 10);
  if (isNaN(n) || n < 0 || n >= C.units.length) n = 0;
  var u = C.units[n];
  var KEY = 'qgis-course-steps';
  var all = store.get(KEY, {});
  var mine = all[n] || {};

  document.title = 'الوحدة ' + n + ': ' + u.axis + ' — ' + (SITE.name || '');
  document.getElementById('crumb').textContent = 'الوحدة ' + n;
  document.getElementById('title').innerHTML = ltr(u.axis);
  document.getElementById('ex-title').innerHTML = (u.exercise ? '<b>' + u.exercise + ':</b> ' : '') + ltr(u.exTitle);

  var chips = ['الوحدة ' + n + ' من ' + (C.units.length - 1)];
  if (u.area) chips.push('منطقة الدراسة: ' + C.areas[u.area].name);
  u.tools.forEach(function (t) { chips.push('<span class="ltr">' + t + '</span>'); });
  document.getElementById('chips').innerHTML = chips.map(function (c) { return '<span class="chip">' + c + '</span>'; }).join('');

  function unitDone(i) {
    var s = all[i] || {}, steps = C.units[i].steps.length, d = 0;
    for (var k in s) if (s[k]) d++;
    return d >= steps;
  }
  document.getElementById('toc').innerHTML = C.units.map(function (x) {
    return '<li><a href="lesson.html?u=' + x.n + '"' + (x.n === n ? ' aria-current="page"' : '') + '><span class="n">' + x.n + '</span><span>' + ltr(x.axis) +
      (unitDone(x.n) ? ' <span class="done-mark" title="مكتملة">✓</span>' : '') + '</span></a></li>';
  }).join('');

  document.getElementById('objectives').innerHTML = u.objectives.map(function (o) { return '<li>' + ltr(o) + '</li>'; }).join('');

  var stepsEl = document.getElementById('steps');
  stepsEl.innerHTML = u.steps.map(function (s, i) {
    return '<li data-i="' + i + '"><label><input type="checkbox"' + (mine[i] ? ' checked' : '') + '><span class="st">' + ltr(s.t) + '</span></label>' +
      (s.sub ? '<ul>' + s.sub.map(function (x) { return '<li>' + ltr(x) + '</li>'; }).join('') + '</ul>' : '') + '</li>';
  }).join('');
  function refresh() {
    var d = 0;
    stepsEl.querySelectorAll(':scope > li').forEach(function (li) {
      var c = li.querySelector('input').checked; li.classList.toggle('is-done', c); if (c) d++;
    });
    document.getElementById('prog-text').textContent = 'أنجزت ' + d + ' من ' + u.steps.length + ' خطوات';
    document.getElementById('prog-bar').style.width = (d / u.steps.length * 100) + '%';
  }
  stepsEl.addEventListener('change', function (e) {
    var li = e.target.closest('li[data-i]');
    mine[li.dataset.i] = e.target.checked; all[n] = mine; store.set(KEY, all); refresh();
  });
  refresh();

  var label = { pdf: 'PDF', zip: 'ZIP', forum: '' };
  var desc = { pdf: 'كتاب التمرين', zip: 'مجلد البيانات', forum: 'برنامج الدورة ومستجداتها' };
  if (u.materials.length) document.getElementById('materials-sec').hidden = false;
  document.getElementById('files').innerHTML = u.materials.map(function (m) {
    var href = m.file;
    return '<a class="file" href="' + href + '"' + (m.type !== 'forum' ? ' download' : '') + '><span class="ext ' + m.type + '">' + (label[m.type] || '•') + '</span><span>' + m.label + '<small>' + desc[m.type] + '</small></span></a>';
  }).join('');

  var prev = C.units[n - 1], next = C.units[n + 1];
  document.getElementById('pager').innerHTML =
    (prev ? '<a href="lesson.html?u=' + prev.n + '"><small>الوحدة السابقة</small><b>' + ltr(prev.axis) + '</b></a>' : '<span></span>') +
    (next ? '<a href="lesson.html?u=' + next.n + '" style="text-align:left"><small>الوحدة التالية</small><b>' + ltr(next.axis) + '</b></a>' : '<a href="program.html" style="text-align:left"><small>أنهيت آخر وحدة</small><b>العودة إلى البرنامج</b></a>');
})();
