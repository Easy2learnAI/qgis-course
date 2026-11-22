/* كتالوج الدورات — Delta Conception
   • دورة QGIS الأولى مكتوبة هنا مباشرة (لها صفحات البرنامج والوحدات) وتظهر دائماً.
   • الدورات الجديدة تُضاف من لوحة الإدارة › «الدورات» وتُحفظ في جدول courses في Supabase،
     فتظهر تلقائياً في الرئيسية وصفحة الدورات ونموذج التسجيل والتذييل — بلا تعديل في الملفات.
   النص العربي في الحقول بلا لاحقة، والترجمة (اختيارية) في الحقول ‎_en‎ و ‎_fr‎. */
(function () {
  var CACHE_KEY = 'delta_courses_v1';

  var BUILTIN = [{
    id: 'qgis-foundation',
    builtin: true,
    status: 'live',             // live: الدورة جارية ومحتواها على الموقع · open: التسجيل مفتوح · soon: قريباً
    category: 'gis',
    sort_order: 0,
    title: 'نظم المعلومات الجغرافية باستخدام QGIS و Google Earth',
    title_en: 'GIS with QGIS and Google Earth',
    title_fr: 'SIG avec QGIS et Google Earth',
    tagline: 'من خريطة ورقية ممسوحة إلى مشروع SIG متكامل',
    tagline_en: 'From a scanned paper map to a complete GIS project',
    tagline_fr: 'D’une carte papier numérisée à un projet SIG complet',
    summary: 'دورة تأسيسية تطبيقية على بيانات حقيقية من الجزائر (بجاية، البليدة، الوادي): الإرجاع الجغرافي، الرقمنة، معالجة البيانات الاتجاهية والشبكية، وإخراج خريطة جاهزة للطباعة.',
    summary_en: 'A hands-on foundation course on real data from Algeria (Béjaïa, Blida, El Oued): georeferencing, digitizing, vector and raster processing, and a print-ready map.',
    summary_fr: 'Une formation pratique d’initiation sur des données réelles d’Algérie (Béjaïa, Blida, El Oued) : géoréférencement, numérisation, traitements vecteur et raster, et carte prête à imprimer.',
    level: 'مبتدئ', level_en: 'Beginner', level_fr: 'Débutant',
    duration: '7 وحدات · 5 تمارين تطبيقية', duration_en: '7 modules · 5 exercises', duration_fr: '7 modules · 5 exercices',
    features: [
      'الإرجاع الجغرافي لخريطة أرشيفية (بجاية، USGS 1956)',
      'الرقمنة وتنظيم البيانات في GeoPackage',
      'استيفاء منسوب المياه الجوفية (الوادي)',
      'نماذج الارتفاع الرقمية ومناطق الثلوج (البليدة)',
      'ترميز الطبقات وإخراج خريطة كاملة'
    ],
    features_en: [
      'Georeferencing an archive map (Béjaïa, USGS 1956)',
      'Digitizing and organizing data in GeoPackage',
      'Groundwater level interpolation (El Oued)',
      'Elevation models and snow zones (Blida)',
      'Layer symbology and a complete map layout'
    ],
    features_fr: [
      'Géoréférencement d’une carte d’archive (Béjaïa, USGS 1956)',
      'Numérisation et organisation des données en GeoPackage',
      'Interpolation du niveau de la nappe (El Oued)',
      'MNT et zones d’enneigement (Blida)',
      'Symbologie et mise en page d’une carte complète'
    ],
    software: ['QGIS', 'Google Earth Pro', 'GeoPackage'],
    details_url: 'program.html'
  }];

  var CATS = {
    gis: { ar: 'نظم المعلومات الجغرافية', en: 'GIS', fr: 'SIG' },
    'remote-sensing': { ar: 'الاستشعار عن بعد', en: 'Remote sensing', fr: 'Télédétection' },
    hydrology: { ar: 'الهيدرولوجيا والمياه', en: 'Hydrology & water', fr: 'Hydrologie & eau' },
    programming: { ar: 'البرمجة والأتمتة', en: 'Programming', fr: 'Programmation' },
    other: { ar: 'مجالات أخرى', en: 'Other', fr: 'Autres' }
  };
  var STATUS = {
    live: { ar: 'متاحة الآن', en: 'Running now', fr: 'En cours', tag: 'on' },
    open: { ar: 'التسجيل مفتوح', en: 'Registration open', fr: 'Inscriptions ouvertes', tag: 'water' },
    soon: { ar: 'قريباً', en: 'Coming soon', fr: 'Bientôt', tag: 'contour' }
  };

  function lang(l) { return l || (window.I18N && window.I18N.getLang()) || 'ar'; }
  function pick(c, f, l) { var v = l !== 'ar' && c[f + '_' + l]; return (v && (!Array.isArray(v) || v.length)) ? v : c[f]; }
  function sortFn(a, b) { return (a.sort_order || 0) - (b.sort_order || 0) || String(a.created_at || '').localeCompare(String(b.created_at || '')); }

  function localize(c, l) {
    l = lang(l);
    var st = STATUS[c.status] || STATUS.open, cat = CATS[c.category] || CATS.other;
    var details = c.details_url || '';
    return {
      id: c.id, builtin: !!c.builtin, status: c.status || 'open', active: c.active !== false,
      title: pick(c, 'title', l) || '', tagline: pick(c, 'tagline', l) || '', summary: pick(c, 'summary', l) || '',
      level: pick(c, 'level', l) || '', duration: pick(c, 'duration', l) || '',
      features: pick(c, 'features', l) || [], software: c.software || [],
      category: CATS[c.category] ? c.category : 'other', categoryName: cat[l],
      badge: st[l], badgeType: st.tag,
      detailsUrl: details, detailsExternal: /^https?:\/\//i.test(details),
      registerUrl: 'register.html?course=' + encodeURIComponent(c.id)
    };
  }

  function rowsCached() {
    var c = window.store ? window.store.get(CACHE_KEY, null) : null;
    return c && Array.isArray(c.rows) ? c.rows : [];
  }
  function merge(rows, withHidden) {
    return BUILTIN.concat((rows || []).filter(function (r) { return withHidden || r.active !== false; }).sort(sortFn));
  }

  var pending = null;
  // قائمة الدورات الظاهرة: النسخة المحفوظة فوراً، ثم المحدَّثة من الخادم
  function load() {
    if (!window.SB || !window.SB.configured() || !window.SB.getCourses) return Promise.resolve(merge(rowsCached()));
    if (!pending) {
      pending = window.SB.getCourses().then(function (rows) {
        rows = rows || [];
        if (window.store) window.store.set(CACHE_KEY, { t: Date.now(), rows: rows.filter(function (r) { return r.active !== false; }) });
        return merge(rows);
      }, function () { return merge(rowsCached()); });
    }
    return pending;
  }

  // بطاقة دورة (تُستعمل في الرئيسية وصفحة الدورات)؛ esc/txt من site.js
  function cardHtml(c) {
    var tr = function (k) { return window.I18N.t(k); }, esc = window.esc, txt = window.txt;
    var act = [];
    if (c.status === 'live') act.push('<a class="btn small" href="' + esc(c.detailsUrl) + '">' + esc(tr('btn_enter_course')) + '</a>');
    else if (c.detailsUrl) act.push('<a class="btn small quiet" href="' + esc(c.detailsUrl) + '"' + (c.detailsExternal ? ' target="_blank" rel="noopener"' : '') + '>' + esc(tr('btn_course_details')) + '</a>');
    act.push('<a class="btn small' + (c.status === 'live' ? ' quiet' : '') + '" href="' + c.registerUrl + '">' + esc(tr(c.status === 'soon' ? 'btn_notify_me' : 'btn_register_course')) + '</a>');
    if (window.SHARE) act.push(window.SHARE.button({
      url: c.builtin ? 'program.html' : 'courses.html#course-' + encodeURIComponent(c.id),
      title: c.title, text: tr('share_course_text').replace('{t}', c.title + (c.tagline ? ' — ' + c.tagline : ''))
    }));
    var meta = [];
    if (c.level) meta.push('<span>' + esc(tr('card_level')) + ' <b>' + esc(c.level) + '</b></span>');
    meta.push('<span>' + esc(tr('card_field')) + ' <b>' + esc(c.categoryName) + '</b></span>');
    return '<article class="course-card' + (c.status === 'live' ? ' active-course' : '') + '" id="course-' + esc(c.id) + '">' +
      '<div class="course-header"><div class="course-meta-top"><span class="tag ' + c.badgeType + '">' + esc(c.badge) + '</span>' +
      (c.duration ? '<span class="course-duration">' + esc(c.duration) + '</span>' : '') + '</div>' +
      '<h3>' + txt(c.title) + '</h3>' + (c.tagline ? '<p class="course-tagline">' + txt(c.tagline) + '</p>' : '') + '</div>' +
      '<div class="course-body">' + (c.summary ? '<p class="course-summary">' + txt(c.summary) + '</p>' : '') +
      (c.features.length ? '<div class="course-highlights"><h4>' + esc(tr('card_highlights')) + '</h4><ul class="course-feats">' +
        c.features.map(function (f) { return '<li>' + txt(f) + '</li>'; }).join('') + '</ul></div>' : '') +
      (c.software.length ? '<div class="course-sw"><b>' + esc(tr('card_software')) + '</b><div class="chips-wrap">' +
        c.software.map(function (s) { return '<span class="chip ltr">' + esc(s) + '</span>'; }).join(' ') + '</div></div>' : '') +
      '</div><div class="course-footer"><div class="course-info-meta">' + meta.join('') + '</div>' +
      '<div class="course-actions">' + act.join(' ') + '</div></div></article>';
  }

  window.COURSES = {
    cardHtml: cardHtml,
    BUILTIN: BUILTIN, CATS: CATS, STATUS: STATUS, CACHE_KEY: CACHE_KEY,
    localize: localize,
    cached: function () { return merge(rowsCached()); },
    load: load,
    byId: function (list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  };
})();
