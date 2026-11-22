/* صفحة الموارد: البرامج، المعجم ثلاثي اللغات، والملحقات (للمتدرّبين) */
(function () {
  var C = window.COURSE;
  var $ = function (id) { return document.getElementById(id); };
  function tr(k, fb) { return window.I18N ? window.I18N.t(k, fb) : fb; }

  function renderTools() {
    var cur = window.I18N.getLang();
    $('tools-body').innerHTML = C.tools.map(function (raw) {
      var t = C.getLocalizedTool(raw, cur);
      return '<tr><td><a class="ltr" href="' + t.url + '" target="_blank" rel="noopener">' + esc(t.name) + '</a></td><td>' + txt(t.role) + '</td><td class="price">' + esc(t.price) + '</td></tr>';
    }).join('');
  }

  // المعجم: [العربية، الفرنسية، الإنجليزية]
  var gl = $('gl'), empty = $('gl-empty'), q = '';
  function norm(s) { return s.toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/[éèêë]/g, 'e').replace(/[àâ]/g, 'a').replace(/[ôö]/g, 'o').replace(/[ç]/g, 'c'); }
  var rowsN = C.glossary.map(function (r) { return norm(r.join(' ')); });
  function renderGlossary() {
    var f = norm(q);
    var html = '', n = 0;
    C.glossary.forEach(function (r, i) {
      if (f && rowsN[i].indexOf(f) < 0) return;
      n++;
      html += '<tr><td lang="ar" dir="rtl">' + esc(r[0]) + '</td><td lang="fr" dir="ltr">' + esc(r[1]) + '</td><td lang="en" dir="ltr">' + esc(r[2]) + '</td></tr>';
    });
    gl.innerHTML = html;
    empty.hidden = n > 0;
  }
  var t = 0;
  $('q').addEventListener('input', function (e) {
    clearTimeout(t); var v = e.target.value.trim();
    t = setTimeout(function () { q = v; renderGlossary(); }, 100);
  });

  renderTools();
  renderGlossary();

  // الملحقات ونصيحة نظام الإحداثيات: من المحتوى المحمي للمتدرّبين (بالعربية)
  var G = null;
  function arabicNote() { return window.I18N.getLang() === 'ar' ? '' : '<p class="ar-note">' + esc(tr('guide_ar_note')) + '</p>'; }
  function renderAppendix() {
    if (!G) return;
    var A = G.appendix || {};
    ['compare', 'menus', 'shortcuts', 'troubles'].forEach(function (k) {
      var el = $('ap-' + k); if (el && A[k]) el.innerHTML = A[k];
    });
    $('ap-note').innerHTML = arabicNote();
    $('ap-body').hidden = false;
    if (G.crsTip) $('crs-tip').innerHTML = arabicNote() + '<div class="tip" lang="ar" dir="rtl">' + G.crsTip + '</div>';
  }
  window.addEventListener('deltalangchange', function () { renderTools(); renderAppendix(); });

  if (window.SB && SB.configured()) {
    SB.content().then(function (g) {
      if (!g) { $('ap-locked').hidden = false; return; }
      G = g; renderAppendix();
    }, function () { $('ap-locked').hidden = false; });
  } else {
    $('ap-locked').hidden = false;
  }
})();
