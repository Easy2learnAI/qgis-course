/* صفحة كتالوج الدورات: دورة QGIS + الدورات المضافة من لوحة الإدارة */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  function tr(k, fb) { return window.I18N ? window.I18N.t(k, fb) : fb; }
  var CO = window.COURSES;
  var list = CO.cached(), filter = 'all';
  var container = $('courses-container'), filters = $('course-filters');


  function render() {
    var cur = window.I18N.getLang();
    var all = list.map(function (c) { return CO.localize(c, cur); });
    // أزرار التصفية: فقط للمجالات التي فيها دورات، وتُخفى إذا كان هناك مجال واحد
    var cats = [];
    all.forEach(function (c) { if (cats.indexOf(c.category) < 0) cats.push(c.category); });
    if (cats.indexOf(filter) < 0) filter = 'all';
    filters.hidden = cats.length < 2;
    filters.innerHTML = [['all', tr('courses_filter_all') + ' (' + all.length + ')']].concat(cats.map(function (k) { return [k, CO.CATS[k][cur]]; }))
      .map(function (f) { return '<button class="pill' + (f[0] === filter ? ' active' : '') + '" type="button" aria-pressed="' + (f[0] === filter) + '" data-filter="' + f[0] + '">' + esc(f[1]) + '</button>'; }).join('');
    var shown = filter === 'all' ? all : all.filter(function (c) { return c.category === filter; });
    container.innerHTML = shown.length ? shown.map(CO.cardHtml).join('') : '<p class="empty">' + esc(tr('courses_empty')) + '</p>';
    $('more-soon').hidden = all.length > 1;
    if (window.SHARE) SHARE.focusHash();
  }

  filters.addEventListener('click', function (e) {
    var b = e.target.closest('.pill'); if (!b) return;
    filter = b.getAttribute('data-filter'); render();
  });
  render();
  window.addEventListener('deltalangchange', render);
  CO.load().then(function (rows) { list = rows; render(); });

  // زر «إضافة دورة» يظهر للأدمن فقط
  if (window.SB && SB.configured()) SB.profile().then(function (p) {
    if (p && p.role === 'admin' && p.active) $('admin-add').hidden = false;
  }).catch(function () {});
})();
