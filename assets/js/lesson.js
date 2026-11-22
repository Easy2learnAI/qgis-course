/* صفحة الوحدة: العناوين والأهداف للجميع، أما «طريقة التنفيذ» والشروحات فتُجلب من المخزن المحمي
   للمتدرّبين المسجَّلين فقط (SB.content في auth.js). لا يوجد هذا المحتوى في ملفات الموقع العامة.
   المحتوى المحمي مكتوب بالعربية: يُعرض باتجاه RTL مع تنبيه عند اختيار لغة أخرى. */
(function () {
  var C = window.COURSE;
  var $ = function (id) { return document.getElementById(id); };
  function tr(k, fb) { return window.I18N ? window.I18N.t(k, fb) : fb; }
  var n = parseInt(new URLSearchParams(location.search).get('u'), 10);
  if (isNaN(n) || n < 0 || n >= C.units.length) n = 0;
  var raw = C.units[n];

  var G = null;          // محتوى هذه الوحدة من guide.json (للمتدرّبين)
  var lockMsg = null;    // سبب ظهور صندوق القفل
  var INTRO = /^(مقدمة|الجزء النظري|أهداف التمرين|أهداف التعلّم|تقديم المقرر|المنهجية التطبيقية والأهداف|الفئة المستهدفة|إعلانات الدورة)$/;
  var AR = ' lang="ar" dir="rtl"';

  function renderHead(cur, u) {
    document.title = tr('lesson_crumb_unit') + ' ' + n + ': ' + u.axis + ' — ' + ((window.SITE && SITE.name) || 'Delta Conception');
    $('crumb').textContent = tr('lesson_crumb_unit') + ' ' + n;
    $('title').innerHTML = txt(u.axis);
    $('ex-title').innerHTML = (u.exercise ? '<b>' + esc(u.exercise) + ':</b> ' : '') + txt(u.exTitle);
    var chips = ['<span class="chip">' + esc(tr('lesson_crumb_unit')) + ' ' + n + ' / ' + (C.units.length - 1) + '</span>'];
    if (u.area) chips.push('<span class="chip">' + esc(tr('lesson_area')) + ' ' + esc(C.getLocalizedArea(u.area, cur).name) + '</span>');
    u.tools.forEach(function (t) { chips.push('<span class="chip ltr">' + esc(t) + '</span>'); });
    $('chips').innerHTML = chips.join('') + '<a class="textlink" href="' + (C.guidePdf || 'files.html') + '">' + esc(tr('prog_btn_guide')) + '</a>';
    $('toc').innerHTML = C.units.map(function (x) {
      return '<li><a href="lesson.html?u=' + x.n + '"' + (x.n === n ? ' aria-current="page"' : '') + '><span class="n">' + x.n + '</span><span>' + txt(C.pick(x, 'axis', cur)) + '</span></a></li>';
    }).join('');
    $('objectives').innerHTML = (u.objectives || []).map(function (o) { return '<li>' + txt(o) + '</li>'; }).join('');
  }

  function renderSteps(u, cur) {
    var detailed = 0, howWord = tr('lesson_how'), readWord = tr('lesson_read');
    var open = {};
    [].forEach.call($('steps').querySelectorAll('details.how[open]'), function (d) { open[d.getAttribute('data-i')] = true; });
    $('steps').innerHTML = u.steps.map(function (s, i) {
      var how = (G && G.steps && G.steps[String(i + 1)]) || '';
      if (how) detailed++;
      var label = INTRO.test(raw.steps[i].t) ? readWord : howWord;
      return '<li><div class="step-body"><span class="st">' + txt(s.t) + '</span>' +
        (s.sub ? '<ul>' + s.sub.map(function (x) { return '<li>' + txt(x) + '</li>'; }).join('') + '</ul>' : '') +
        (how ? '<details class="how" data-i="' + i + '"' + (open[i] ? ' open' : '') + '><summary>' + esc(label) + '</summary><div class="guide"' + AR + '>' + how + '</div></details>' : '') +
        '</div></li>';
    }).join('');
    return detailed;
  }

  function renderGuide(u, cur) {
    var detailed = renderSteps(u, cur);
    $('guide-ar-note').hidden = !(G && cur !== 'ar');
    $('steps-hint').hidden = !detailed;
    var tg = $('toggle-all');
    tg.hidden = !detailed;
    syncToggle();
    if (!G) return;
    if (G.extras) { $('extras-sec').hidden = false; $('extras').innerHTML = G.extras; }
    if (G.ge) {
      $('ge-sec').hidden = false;
      $('ge').innerHTML = G.ge;
      $('ge-opt').hidden = !G.geOptional;
      $('ge-title').innerHTML = esc(tr(G.geOptional ? 'lesson_ge_optional' : 'lesson_ge_in')) + ' <span class="ltr">Google Earth Pro</span>';
    }
    if (G.result) { $('result-sec').hidden = false; $('result').innerHTML = G.result; }
  }

  function syncToggle() {
    var all = $('steps').querySelectorAll('details.how');
    var allOpen = all.length && Array.prototype.every.call(all, function (d) { return d.open; });
    $('toggle-all').textContent = tr(allOpen ? 'lesson_toggle_all_hide' : 'lesson_toggle_all');
  }
  $('toggle-all').addEventListener('click', function () {
    var all = $('steps').querySelectorAll('details.how');
    var open = !Array.prototype.every.call(all, function (d) { return d.open; });
    Array.prototype.forEach.call(all, function (d) { d.open = open; });
    syncToggle();
  });
  $('steps').addEventListener('toggle', syncToggle, true);

  function renderLocked() {
    if (lockMsg === null) return;
    var box = $('locked');
    box.hidden = false;
    $('locked-desc').textContent = lockMsg === 'not_uploaded' ? tr('lesson_not_uploaded') : (lockMsg || tr('lesson_locked_desc'));
    $('locked-login').href = 'files.html?next=' + encodeURIComponent('lesson.html?u=' + n);
  }

  function renderMaterials() {
    if (!raw.materials.length) return;
    var label = { pdf: 'PDF', zip: 'ZIP' }, desc = { pdf: tr('mat_pdf'), zip: tr('mat_zip') };
    $('materials-sec').hidden = false;
    $('files').innerHTML = raw.materials.map(function (m) {
      return '<a class="file" href="' + esc(m.file) + '" download><span class="ext ' + esc(m.type) + '">' + (label[m.type] || '•') + '</span><span>' + txt(m.label) + '<small>' + esc(desc[m.type] || '') + '</small></span></a>';
    }).join('');
  }

  function renderPager(cur) {
    var prev = C.units[n - 1], next = C.units[n + 1];
    $('pager').innerHTML =
      (prev ? '<a href="lesson.html?u=' + prev.n + '"><small>' + esc(tr('lesson_prev_unit')) + '</small><b>' + txt(C.pick(prev, 'axis', cur)) + '</b></a>' : '<span></span>') +
      (next ? '<a class="next" href="lesson.html?u=' + next.n + '"><small>' + esc(tr('lesson_next_unit')) + '</small><b>' + txt(C.pick(next, 'axis', cur)) + '</b></a>'
            : '<a class="next" href="program.html"><small>' + esc(tr('lesson_last_unit')) + '</small><b>' + esc(tr('lesson_back_program')) + '</b></a>');
  }

  function renderAll() {
    var cur = window.I18N.getLang(), u = C.getLocalizedUnit(raw, cur);
    renderHead(cur, u);
    renderGuide(u, cur);
    renderLocked();
    renderMaterials();
    renderPager(cur);
  }
  renderAll();
  window.addEventListener('deltalangchange', renderAll);

  var loading = $('loading');
  if (!(window.SB && SB.configured())) { lockMsg = ''; renderLocked(); return; }
  loading.hidden = false;
  SB.content().then(function (all) {
    loading.hidden = true;
    G = all && all.units && all.units[n] || null;
    if (G) renderAll();
    else { lockMsg = all ? 'not_uploaded' : ''; renderLocked(); }
  }, function (e) {
    loading.hidden = true;
    lockMsg = (e && e.message) || ''; renderLocked();
  });
})();
