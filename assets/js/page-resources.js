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

  // ---------- روابط مفيدة: يضيفها الأدمن من لوحة الإدارة (الجدول resource_links) ----------
  var LINKS_KEY = 'delta_links_v1', LINK_CATS = ['software', 'data', 'learning', 'tools', 'other'];
  var links = (window.store && store.get(LINKS_KEY, null)) || null, isAdmin = false;
  links = links && Array.isArray(links.rows) ? links.rows : [];
  function pickL(r, f, l) { return (l !== 'ar' && r[f + '_' + l]) || r[f] || ''; }
  function host(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } }
  var LINK_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
  function renderLinks() {
    var cur = window.I18N.getLang(), box = $('links'), body = $('links-body');
    var list = links.filter(function (r) { return r.active !== false && /^https?:\/\//i.test(r.url || ''); });
    box.hidden = !list.length && !isAdmin;
    if (!list.length) { body.innerHTML = isAdmin ? '<p class="empty">' + esc(tr('res_links_empty')) + '</p>' : ''; return; }
    var newTab = tr('link_open_new');
    body.innerHTML = LINK_CATS.map(function (cat) {
      var rows = list.filter(function (r) { return (LINK_CATS.indexOf(r.category) < 0 ? 'other' : r.category) === cat; });
      if (!rows.length) return '';
      return '<div class="link-group"><h3>' + esc(tr('link_cat_' + cat)) + ' <span class="count">' + rows.length + '</span></h3><ul class="link-grid">' +
        rows.map(function (r) {
          var t = pickL(r, 'title', cur), d = pickL(r, 'description', cur), h = host(r.url);
          return '<li><a class="link-card" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' +
            '<span class="lc-title"><span>' + txt(t) + '</span>' + LINK_ICON + '</span>' +
            (d ? '<span class="lc-desc">' + txt(d) + '</span>' : '') +
            (h ? '<span class="lc-host ltr">' + esc(h) + '</span>' : '') +
            '<span class="visually-hidden">' + esc(newTab) + '</span></a></li>';
        }).join('') + '</ul></div>';
    }).join('');
  }
  renderLinks();
  window.addEventListener('deltalangchange', renderLinks);
  if (window.SB && SB.configured()) {
    SB.getLinks().then(function (rows) {
      links = rows || [];
      if (window.store) store.set(LINKS_KEY, { t: Date.now(), rows: links.filter(function (r) { return r.active !== false; }) });
      renderLinks();
    }, function () { renderLinks(); });
    // زر «إضافة رابط» للأدمن فقط
    SB.session().then(function (s) {
      if (s) return SB.profile().then(function (p) {
        if (p && p.role === 'admin' && p.active) { isAdmin = true; $('links-admin').hidden = false; renderLinks(); }
      });
    }).catch(function () {});
  }

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
