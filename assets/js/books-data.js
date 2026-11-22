/* مكتبة الكتب الرقمية — Delta Conception
   الكتب تُنشر من لوحة الإدارة وتُحفظ في جدول books في Supabase.
   التحميل متاح للجميع عبر رابط Google Drive الخاص بكل كتاب.
   نسخة من القائمة العامة تُحفظ في المتصفح لتظهر فوراً في الزيارة التالية ثم تُحدَّث من الخادم. */
(function () {
  var CACHE_KEY = 'delta_books_v2';

  var CATS = {
    gis: { ar: 'نظم المعلومات الجغرافية', en: 'GIS', fr: 'SIG' },
    'remote-sensing': { ar: 'الاستشعار عن بعد', en: 'Remote sensing', fr: 'Télédétection' },
    hydrology: { ar: 'الهيدرولوجيا والمياه', en: 'Hydrology & water', fr: 'Hydrologie & eau' },
    programming: { ar: 'البرمجة والأتمتة', en: 'Programming & automation', fr: 'Programmation & automatisation' }
  };

  function lang(l) { return l || (window.I18N && window.I18N.getLang()) || 'ar'; }
  function pick(b, f, l) { return (l !== 'ar' && b[f + '_' + l]) || b[f] || ''; }

  function localize(b, l) {
    l = lang(l);
    var cat = CATS[b.category];
    return {
      id: b.id,
      title: pick(b, 'title', l),
      author: pick(b, 'author', l),
      description: pick(b, 'description', l),
      category: b.category,
      categoryName: cat ? cat[l] : (b.category_name || b.category || ''),
      pages: b.pages || '',
      year: b.year || '',
      cover_url: b.cover_url || '',
      drive_url: b.drive_url || ''
    };
  }

  var PLACEHOLDER =
    '<svg class="book-ph" viewBox="0 0 120 160" width="120" height="160" aria-hidden="true">' +
    '<rect x="14" y="8" width="92" height="144" rx="3" fill="#fbfbf8" stroke="#1c2b39" stroke-width="2"/>' +
    '<rect x="14" y="8" width="12" height="144" fill="#1c2b39"/>' +
    '<path d="M32 104 C48 92 62 112 78 100 S98 90 104 94" fill="none" stroke="#a0612f" stroke-width="2"/>' +
    '<path d="M32 118 C48 108 62 126 80 114 S98 106 104 110" fill="none" stroke="#a0612f" stroke-width="1.3"/>' +
    '<path d="M32 46 C46 42 58 50 72 44 S94 36 104 40" fill="none" stroke="#2a6fb0" stroke-width="2"/>' +
    '<circle cx="66" cy="72" r="10" fill="none" stroke="#7a2e8c" stroke-width="2.4"/><path d="M66 56v32M50 72h32" stroke="#7a2e8c" stroke-width="2"/></svg>';

  function coverHtml(b) {
    var badge = b.categoryName ? '<span class="book-cat-badge">' + window.esc(b.categoryName) + '</span>' : '';
    var img = b.cover_url && /^(https?:\/\/|assets\/)/.test(b.cover_url)
      ? '<img class="book-cover" src="' + window.esc(b.cover_url) + '" alt="" width="300" height="400" loading="lazy" decoding="async" onerror="this.remove()">'
      : '';
    return '<div class="book-cover-wrap">' + PLACEHOLDER + img + badge + '</div>';
  }

  // زر مشاركة الكتاب: يشير إلى بطاقته في صفحة المكتبة (لا إلى ملف Drive مباشرة)
  function shareHtml(b) {
    if (!window.SHARE) return '';
    var t = b.title + (b.author ? ' — ' + b.author : '');
    return window.SHARE.button({
      url: 'books.html' + (b.id ? '#book-' + encodeURIComponent(b.id) : ''),
      title: b.title, text: window.I18N.t('share_book_text').replace('{t}', t)
    });
  }

  function cached() {
    var c = window.store ? window.store.get(CACHE_KEY, null) : null;
    return c && Array.isArray(c.rows) ? c.rows : [];
  }

  var pending = null;
  function load() {
    if (!window.SB || !window.SB.configured()) return Promise.resolve([]);
    if (!pending) {
      pending = window.SB.getBooks().then(function (rows) {
        rows = (rows || []).filter(function (r) { return r.active !== false; });   // الكتب المخفية لا تظهر للزوار
        if (window.store) window.store.set(CACHE_KEY, { t: Date.now(), rows: rows });
        return rows;
      });
    }
    return pending;
  }

  window.BOOKS = { CATS: CATS, localize: localize, coverHtml: coverHtml, shareHtml: shareHtml, cached: cached, load: load };
})();
