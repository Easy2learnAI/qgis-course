/* صفحة مكتبة الكتب: القائمة والتحميل متاحان للجميع */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  function tr(k, fb) { return window.I18N ? window.I18N.t(k, fb) : fb; }
  var B = window.BOOKS;

  var books = B.cached();                 // نسخة محفوظة تظهر فوراً
  var state = books.length ? 'ok' : 'loading';
  var cat = 'all', query = '';
  var container = $('books-container'), countEl = $('books-count');

  function norm(s) { return String(s || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا'); }

  function render() {
    var cur = window.I18N.getLang();
    if (state === 'loading' && !books.length) { container.innerHTML = '<p class="empty">' + esc(tr('books_loading')) + '</p>'; countEl.textContent = '…'; return; }
    if (state === 'error' && !books.length) { container.innerHTML = '<p class="empty">' + esc(tr('books_error')) + '</p>'; countEl.textContent = '0'; return; }
    var q = norm(query.trim());
    var list = books.map(function (raw) { return B.localize(raw, cur); }).filter(function (b) {
      return (cat === 'all' || b.category === cat) &&
        (!q || norm(b.title + ' ' + b.author + ' ' + b.description).indexOf(q) > -1);
    });
    countEl.textContent = list.length;
    if (!books.length) { container.innerHTML = '<p class="empty">' + esc(tr('books_none')) + '</p>'; return; }
    if (!list.length) { container.innerHTML = '<p class="empty">' + esc(tr('books_no_match')) + '</p>'; return; }
    container.innerHTML = list.map(function (b) {
      var btn = /^https?:\/\//i.test(b.drive_url)
        ? '<a class="btn small book-dl-btn" href="' + esc(b.drive_url) + '" target="_blank" rel="noopener noreferrer">' + esc(tr('btn_download_drive')) + '</a>'
        : '<button class="btn small quiet book-dl-btn" type="button" disabled>' + esc(tr('book_link_missing')) + '</button>';
      var meta = [b.pages, b.year].filter(Boolean).map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('');
      return '<article class="book-card">' + B.coverHtml(b) +
        '<div class="book-info"><h3 class="book-title">' + txt(b.title) + '</h3>' +
        (b.author ? '<p class="book-author">' + txt(b.author) + '</p>' : '') +
        (b.description ? '<p class="book-desc">' + txt(b.description) + '</p>' : '') +
        (meta ? '<div class="book-meta-bottom">' + meta + '</div>' : '') +
        '<div class="book-action">' + btn + '</div></div></article>';
    }).join('');
  }

  $('category-filters').addEventListener('click', function (e) {
    var b = e.target.closest('.pill'); if (!b) return;
    this.querySelectorAll('.pill').forEach(function (p) { p.classList.toggle('active', p === b); p.setAttribute('aria-pressed', p === b); });
    cat = b.getAttribute('data-cat'); render();
  });
  var t = 0;
  $('book-search').addEventListener('input', function (e) {
    clearTimeout(t); var v = e.target.value;
    t = setTimeout(function () { query = v; render(); }, 120);
  });

  render();
  window.addEventListener('deltalangchange', render);
  B.load().then(function (rows) { books = rows; state = 'ok'; render(); }, function () { state = 'error'; render(); });

  // زر «إضافة كتاب» للأدمن فقط
  if (window.SB && SB.configured()) SB.session().then(function (s) {
    if (s) return SB.profile().then(function (p) { if (p && p.role === 'admin' && p.active) $('admin-add').hidden = false; });
  }).catch(function () {});
})();
