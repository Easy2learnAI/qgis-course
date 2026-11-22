/* لوحة الإدارة (بالعربية فقط): المتدرّبون، الملفات المحمية، محتوى الدروس، ومكتبة الكتب */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var me = null;
  var FOLDERS = { guide: 'الدليل المفصّل', materials: 'مواد التمارين' };

  function gate(title, html) { $('gate').hidden = false; $('panel').hidden = true; if (title) $('gate-title').textContent = title; if (html) $('gate-text').innerHTML = html; }

  // ملفات الموقع غير متطابقة (نسخة قديمة محفوظة في المتصفح أو ملف لم يُرفع): رسالة واضحة بدل خطأ تقني
  if (!window.COURSES || !window.COURSES.BUILTIN || !window.BOOKS) {
    gate('ملفات الموقع غير محدَّثة', 'المتصفح يستعمل نسخة قديمة من أحد ملفات الموقع. اضغط <b class="ltr">Ctrl + F5</b> لإعادة التحميل. ' +
      'إن كان الموقع على GitHub فتأكّد من رفع كل الملفات، ومنها <span class="ltr">assets/js/courses-data.js</span> و <span class="ltr">assets/js/books-data.js</span>.');
    return;
  }
  if (!SB.configured()) { gate('نظام الحسابات غير مفعَّل', 'أضف <span class="ltr">supabaseUrl</span> و <span class="ltr">supabaseAnonKey</span> في <span class="ltr">assets/js/config.js</span>.'); return; }

  function genPw() {
    var a = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789', r = new Uint32Array(10), s = '';
    crypto.getRandomValues(r); for (var i = 0; i < r.length; i++) s += a[r[i] % a.length]; return s;
  }

  // ---------------- المتدرّبون ----------------
  function credText(name, email, pw) {
    var site = location.href.replace(/admin\.html.*$/, 'files.html');
    return 'السلام عليكم ' + name + '،\n\nتم إنشاء حسابك في دورة QGIS. لتحميل الدليل ومواد التمارين:\n' +
      'الرابط: ' + site + '\nالبريد: ' + email + '\nكلمة المرور المؤقتة: ' + pw + '\n\n' +
      'بعد الدخول يمكنك تغيير كلمة المرور من زر «تغيير كلمة المرور».';
  }

  function loadUsers() {
    $('t-msg').textContent = '';
    return SB.admin('list').then(function (d) {
      var users = d.users || [];
      var nT = users.filter(function (u) { return u.role !== 'admin'; }).length;
      $('t-count').textContent = '(' + nT + ')'; $('nav-t').textContent = nT;
      $('t-body').innerHTML = users.map(function (u) {
        var self = u.id === me.id, isAdmin = u.role === 'admin';
        var st = isAdmin ? '<span class="tag admin">أدمن</span>' : (u.active ? '<span class="tag on">مفعَّل</span>' : '<span class="tag off">موقوف</span>');
        var acts = self ? '<span class="small-note">حسابك</span>' :
          '<button class="btn small quiet" data-act="toggle" data-id="' + u.id + '" data-active="' + (u.active ? 1 : 0) + '">' + (u.active ? 'إيقاف' : 'تفعيل') + '</button>' +
          '<button class="btn small quiet" data-act="pw" data-id="' + u.id + '" data-name="' + esc(u.full_name || '') + '" data-email="' + esc(u.email) + '">كلمة مرور جديدة</button>' +
          '<button class="btn small quiet danger" data-act="del" data-id="' + u.id + '">حذف</button>';
        return '<tr><td>' + esc(u.full_name || '—') + '</td><td class="ltr" style="text-align:right">' + esc(u.email) + '</td><td>' + st + '</td><td>' + fmtDate(u.last_sign_in_at) + '</td><td class="acts">' + acts + '</td></tr>';
      }).join('') || '<tr><td colspan="5" class="empty">لا يوجد متدرّبون بعد.</td></tr>';
    }, function (e) { $('t-msg').textContent = e.message; });
  }

  $('gen').addEventListener('click', function () { $('a-pw').value = genPw(); });

  $('add-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var m = $('add-msg'), b = this.querySelector('button[type=submit]');
    var name = $('a-name').value.trim(), email = $('a-email').value.trim(), pw = $('a-pw').value;
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { m.textContent = 'اكتب الاسم وبريداً إلكترونياً صحيحاً.'; return; }
    if (pw.length < 8) { m.textContent = 'كلمة المرور 8 أحرف على الأقل. اضغط «توليد» لكلمة قوية.'; return; }
    m.textContent = ''; b.disabled = true;
    SB.admin('create', { email: email, password: pw, full_name: name }).then(function () {
      $('cred').hidden = false; $('cred-text').value = credText(name, email, pw);
      $('a-name').value = $('a-email').value = ''; $('a-pw').value = genPw();
      return loadUsers();
    }, function (err) { m.textContent = err.message; }).then(function () { b.disabled = false; });
  });

  $('copy').addEventListener('click', function () {
    var t = $('cred-text'); t.select();
    (navigator.clipboard ? navigator.clipboard.writeText(t.value) : Promise.reject()).catch(function () { document.execCommand('copy'); });
    this.textContent = 'تم النسخ'; var b = this; setTimeout(function () { b.textContent = 'نسخ الرسالة'; }, 1500);
  });

  // أزرار الجدولين (الحذف يحتاج ضغطة ثانية للتأكيد)
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-act]'); if (!b) return;
    var act = b.getAttribute('data-act'), id = b.getAttribute('data-id');
    if (/^(cedit|bedit|cvis|bvis)$/.test(act)) return;          // تعالجها أدوات الدورات والكتب
    if ((act === 'del' || act === 'fdel' || act === 'bdel' || act === 'cdel') && !b.classList.contains('confirm')) {
      b.classList.add('confirm'); b.dataset.label = b.textContent; b.textContent = 'تأكيد الحذف؟';
      setTimeout(function () { if (b.isConnected) { b.classList.remove('confirm'); b.textContent = b.dataset.label; } }, 4000);
      return;
    }
    b.disabled = true;
    var p;
    if (act === 'toggle') p = SB.admin('set_active', { id: id, active: b.getAttribute('data-active') !== '1' }).then(loadUsers);
    else if (act === 'del') p = SB.admin('delete', { id: id }).then(loadUsers);
    else if (act === 'pw') {
      var pw = genPw();
      p = SB.admin('set_password', { id: id, password: pw }).then(function () {
        $('cred').hidden = false; $('cred-text').value = credText(b.getAttribute('data-name'), b.getAttribute('data-email'), pw);
        $('cred').scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    } else if (act === 'fdel') p = SB.deleteFile(b.getAttribute('data-path')).then(loadFiles);
    else if (act === 'cdel') p = SB.deleteCourse(id).then(function () {
      if (editingCourse === id) { $('co-editor').hidden = true; editingCourse = null; }
      try { localStorage.removeItem(CO.CACHE_KEY); } catch (x) {}
      return loadCourses();
    });
    else if (act === 'bdel') {
      var gone = CO.byId(bookRows, id);
      p = SB.deleteBook(id).then(function () {
        if (gone && gone.cover_url) SB.deleteCover(gone.cover_url);
        if (editingBook === id) { $('b-editor').hidden = true; editingBook = null; }
        try { localStorage.removeItem('delta_books_v2'); } catch (x) {}
        return loadBooksAdmin();
      });
    }
    p.catch(function (err) { $({ fdel: 'f-msg', bdel: 'b-tbl-msg', cdel: 'co-tbl-msg' }[act] || 't-msg').textContent = err.message; })
     .then(function () { if (b.isConnected) b.disabled = false; });
  });

  // ---------------- الملفات ----------------
  function safeName(n) {
    var dot = n.lastIndexOf('.'), ext = dot > 0 ? n.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    var base = (dot > 0 ? n.slice(0, dot) : n).normalize('NFKD').replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
    return (base || 'file') + '-' + Date.now().toString(36) + (ext ? '.' + ext : '');
  }

  function loadFiles() {
    $('f-msg').textContent = '';
    return SB.files().then(function (rows) {
      $('f-body').innerHTML = (rows || []).map(function (f) {
        return '<tr><td>' + esc(f.title) + '</td><td>' + (FOLDERS[f.folder] || esc(f.folder)) + '</td><td class="ltr" style="text-align:right">' + fmtSize(f.size) + '</td><td>' + fmtDate(f.created_at) + '</td>' +
          '<td class="acts"><button class="btn small quiet danger" data-act="fdel" data-path="' + esc(f.path) + '">حذف</button></td></tr>';
      }).join('') || '<tr><td colspan="5" class="empty">لا توجد ملفات بعد.</td></tr>';
    }, function (e) { $('f-msg').textContent = e.message; });
  }

  $('up-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var m = $('up-msg'), b = this.querySelector('button[type=submit]'), f = $('u-file').files[0];
    m.classList.remove('ok');
    if (!f) { m.textContent = 'اختر ملفاً.'; return; }
    if (f.size > 50 * 1048576) { m.textContent = 'الملف أكبر من 50 MB. اضغطه (ZIP) أو قسّمه.'; return; }
    var folder = $('u-folder').value, title = $('u-title').value.trim() || f.name.replace(/\.[^.]+$/, '');
    var path = folder + '/' + safeName(f.name);
    m.textContent = 'جارٍ رفع الملف…'; b.disabled = true;
    SB.upload(path, f).then(function () {
      return SB.saveFile({ path: path, title: title, folder: folder, size: f.size });
    }).then(function () {
      m.classList.add('ok'); m.textContent = 'تم رفع «' + title + '».';
      $('u-file').value = ''; $('u-title').value = '';
      return loadFiles();
    }, function (err) { m.textContent = err.message; }).then(function () { b.disabled = false; });
  });

  // ---------------- محتوى الدروس ----------------
  function contentStatus() {
    return SB.content().then(function (G) {
      $('c-status').textContent = G && G.units
        ? 'المحتوى مرفوع: ' + Object.keys(G.units).length + ' وحدات' + (G.version ? ' — إصدار ' + G.version : '') + '.'
        : 'لم يُرفع المحتوى بعد: صفحات الوحدات تعرض العناوين فقط حتى للمتدرّبين.';
    }, function (e) { $('c-status').textContent = e.message; });
  }
  $('c-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var m = $('c-msg'), b = this.querySelector('button'), f = $('c-file').files[0];
    m.classList.remove('ok');
    if (!f) { m.textContent = 'اختر ملف guide.json.'; return; }
    b.disabled = true; m.textContent = 'جارٍ التحقق من الملف…';
    f.text().then(function (t) {
      var G; try { G = JSON.parse(t); } catch (x) { throw new Error('الملف ليس JSON صالحاً.'); }
      if (!G || !G.units) throw new Error('الملف لا يحتوي على وحدات الدورة (units).');
      m.textContent = 'جارٍ الرفع…';
      return SB.uploadContent(new Blob([t], { type: 'application/json' }));
    }).then(function () {
      m.classList.add('ok'); m.textContent = 'تم تحديث محتوى الدروس.'; $('c-file').value = '';
      return contentStatus();
    }, function (err) { m.textContent = err.message; }).then(function () { b.disabled = false; });
  });

  // ---------------- أدوات مشتركة للدورات والكتب ----------------
  var CO = window.COURSES, BK = window.BOOKS;
  var CAT_AR = { gis: 'نظم المعلومات الجغرافية', 'remote-sensing': 'الاستشعار عن بعد', hydrology: 'الهيدرولوجيا والمياه', programming: 'البرمجة والأتمتة', other: 'مجالات أخرى' };
  function okUrl(u) { return /^https?:\/\/[^\s]+$/i.test(u); }
  function val(id) { return $(id).value.trim(); }
  function lines(id) { return $(id).value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean); }
  function newId(prefix) { return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
  function openEditor(box, focusId) {
    $(box).hidden = false;
    $(box).scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function () { $(focusId).focus({ preventScroll: true }); }, 300);
  }
  // يحوّل روابط Google Drive إلى الشكل المناسب
  function driveId(u) {
    var m = String(u).match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]{20,})/) || String(u).match(/docs\.google\.com\/\w+\/d\/([\w-]{20,})/);
    return m ? m[1] : null;
  }
  function normDrive(u) { var id = driveId(u); return id && /drive\.google\.com/.test(u) ? 'https://drive.google.com/file/d/' + id + '/view' : u; }
  function normCover(u) { var id = driveId(u); return id ? 'https://drive.google.com/thumbnail?id=' + id + '&sz=w600' : u; }
  // تصغير الصورة في المتصفح قبل الرفع (أخف للمكتبة وللمتدرّبين)
  function shrinkImage(file, maxW) {
    return new Promise(function (resolve, reject) {
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var k = Math.min(1, maxW / img.naturalWidth), c = document.createElement('canvas');
        c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
        var g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { b ? resolve(b) : reject(new Error('تعذّرت معالجة الصورة.')); }, 'image/jpeg', 0.85);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('الملف ليس صورة صالحة.')); };
      img.src = url;
    });
  }

  // ---------------- الدورات ----------------
  var courseRows = [], editingCourse = null;
  var CO_FIELDS = ['title', 'tagline', 'summary', 'level', 'duration'];

  function courseFromForm() {
    var r = {
      title: val('co-title'), category: $('co-cat').value, status: $('co-status').value,
      features: lines('co-features'), software: val('co-software').split(/[,،]/).map(function (x) { return x.trim(); }).filter(Boolean),
      details_url: val('co-details') || null, sort_order: parseInt($('co-order').value, 10) || 10, active: $('co-active').checked
    };
    ['tagline', 'summary', 'level', 'duration'].forEach(function (f) { r[f] = val('co-' + f) || null; });
    ['en', 'fr'].forEach(function (l) {
      CO_FIELDS.forEach(function (f) { r[f + '_' + l] = val('co-' + f + '-' + l) || null; });
      r['features_' + l] = lines('co-features-' + l);
    });
    return r;
  }
  function fillCourseForm(c) {
    c = c || {};
    ['title', 'tagline', 'summary', 'level', 'duration'].forEach(function (f) { $('co-' + f).value = c[f] || ''; });
    $('co-cat').value = c.category || 'gis'; $('co-status').value = c.status === 'soon' ? 'soon' : 'open';
    $('co-features').value = (c.features || []).join('\n'); $('co-software').value = (c.software || []).join(', ');
    $('co-details').value = c.details_url || ''; $('co-order').value = c.sort_order || 10; $('co-active').checked = c.active !== false;
    ['en', 'fr'].forEach(function (l) {
      CO_FIELDS.forEach(function (f) { $('co-' + f + '-' + l).value = c[f + '_' + l] || ''; });
      $('co-features-' + l).value = (c['features_' + l] || []).join('\n');
    });
    $('co-msg').textContent = ''; $('co-msg').classList.remove('ok');
    previewCourse();
  }
  function previewCourse() {
    var r = courseFromForm(); r.id = editingCourse || 'preview';
    if (!r.title) r.title = 'عنوان الدورة';
    $('co-preview').innerHTML = '<div class="courses-grid one">' + CO.cardHtml(CO.localize(r, 'ar')) + '</div>';
  }
  $('co-form').addEventListener('input', previewCourse);
  $('co-form').addEventListener('change', previewCourse);
  $('co-new').addEventListener('click', function () {
    editingCourse = null; $('co-form-title').textContent = 'دورة جديدة'; $('co-save').textContent = 'حفظ الدورة';
    fillCourseForm(null); openEditor('co-editor', 'co-title');
  });
  $('co-cancel').addEventListener('click', function () { $('co-editor').hidden = true; editingCourse = null; });

  $('co-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var m = $('co-msg'), btn = $('co-save'), r = courseFromForm();
    m.classList.remove('ok');
    if (!r.title) { m.textContent = 'اكتب عنوان الدورة.'; $('co-title').focus(); return; }
    if (r.details_url && !okUrl(r.details_url) && !/^[\w-]+\.html/.test(r.details_url)) { m.textContent = 'رابط التفاصيل يجب أن يبدأ بـ https://'; return; }
    if (!editingCourse) r.id = newId('c-');
    btn.disabled = true; m.textContent = 'جارٍ الحفظ…';
    SB.saveCourse(r, editingCourse).then(function () {
      m.classList.add('ok'); m.textContent = editingCourse ? 'تم حفظ التعديلات.' : 'تمت إضافة الدورة «' + r.title + '».';
      try { localStorage.removeItem(CO.CACHE_KEY); } catch (x) {}
      if (!editingCourse) { editingCourse = r.id; $('co-form-title').textContent = 'تعديل الدورة'; $('co-save').textContent = 'حفظ التعديلات'; }
      return loadCourses();
    }).catch(function (err) { m.textContent = err.message; }).then(function () { btn.disabled = false; });
  });

  function loadCourses() {
    $('co-tbl-msg').textContent = '';
    return SB.getCourses().then(function (rows) {
      courseRows = rows || [];
      var builtin = CO.BUILTIN.map(function (c) {
        return '<tr><td><b>' + txt(c.title) + '</b><br><span class="small-note">ثابتة في الموقع</span></td><td>' + esc(CAT_AR[c.category]) + '</td>' +
          '<td><span class="tag on">متاحة الآن</span></td><td><span class="tag on">ظاهرة</span></td>' +
          '<td class="acts"><a class="btn small quiet" href="program.html">البرنامج ↗</a></td></tr>';
      }).join('');
      $('co-body').innerHTML = builtin + courseRows.map(function (c) {
        var st = c.status === 'soon' ? '<span class="tag contour">قريباً</span>' : '<span class="tag water">التسجيل مفتوح</span>';
        var vis = c.active === false ? '<span class="tag off">مخفية</span>' : '<span class="tag on">ظاهرة</span>';
        return '<tr><td><b>' + txt(c.title) + '</b></td><td>' + esc(CAT_AR[c.category] || c.category) + '</td><td>' + st + '</td><td>' + vis + '</td>' +
          '<td class="acts"><button class="btn small quiet" type="button" data-act="cedit" data-id="' + esc(c.id) + '">تعديل</button>' +
          '<button class="btn small quiet" type="button" data-act="cvis" data-id="' + esc(c.id) + '">' + (c.active === false ? 'إظهار' : 'إخفاء') + '</button>' +
          '<button class="btn small quiet danger" type="button" data-act="cdel" data-id="' + esc(c.id) + '">حذف</button></td></tr>';
      }).join('');
      var n = CO.BUILTIN.length + courseRows.length;
      $('co-count').textContent = '(' + n + ')'; $('nav-c').textContent = n;
    }, function (e) {
      $('co-body').innerHTML = ''; $('co-tbl-msg').textContent = e.message;
      $('co-count').textContent = ''; $('nav-c').textContent = CO.BUILTIN.length;
    });
  }

  // ---------------- مكتبة الكتب ----------------
  var bookRows = [], editingBook = null, editingCover = '';

  function coverSrc() { var c = document.querySelector('input[name=cover-src]:checked'); return c ? c.value : 'file'; }
  function syncCoverBoxes() { $('cover-file-box').hidden = coverSrc() !== 'file'; $('cover-url-box').hidden = coverSrc() !== 'url'; }
  var previewUrl = null;
  function previewBook() {
    var cover = '';
    if (coverSrc() === 'file' && $('b-cover-file').files[0]) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = URL.createObjectURL($('b-cover-file').files[0]); cover = previewUrl;
    } else if (coverSrc() === 'url' && val('b-cover')) cover = normCover(val('b-cover'));
    else if (coverSrc() === 'file' && editingCover) cover = editingCover;
    var b = BK.localize({ id: 'p', title: val('b-title') || 'عنوان الكتاب', author: val('b-author'), category: $('b-cat').value,
      description: val('b-desc'), year: val('b-year'), pages: val('b-pages') }, 'ar');
    b.cover_url = cover;
    var img = cover ? '<img class="book-cover" src="' + esc(cover) + '" alt="" onerror="this.remove()">' : '';
    var html = BK.coverHtml(b).replace('</div>', img + '</div>').replace(/<img class="book-cover"[^>]*loading="lazy"[^>]*>/, '');
    var meta = [b.pages, b.year].filter(Boolean).map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('');
    $('b-preview').innerHTML = '<article class="book-card">' + html + '<div class="book-info"><h3 class="book-title">' + txt(b.title) + '</h3>' +
      (b.author ? '<p class="book-author">' + txt(b.author) + '</p>' : '') + (b.description ? '<p class="book-desc">' + txt(b.description) + '</p>' : '') +
      (meta ? '<div class="book-meta-bottom">' + meta + '</div>' : '') +
      '<div class="book-action"><span class="btn small book-dl-btn">تحميل عبر Google Drive 📥</span></div></div></article>';
    var d = val('b-drive'), t = $('b-drive-test');
    t.hidden = !okUrl(d); if (okUrl(d)) t.href = normDrive(d);
  }
  $('book-form').addEventListener('input', previewBook);
  $('book-form').addEventListener('change', function (e) { if (e.target.name === 'cover-src') syncCoverBoxes(); previewBook(); });

  function fillBookForm(b) {
    b = b || {};
    $('b-title').value = b.title || ''; $('b-author').value = b.author || ''; $('b-cat').value = b.category || 'gis';
    $('b-year').value = b.year || ''; $('b-pages').value = b.pages || ''; $('b-desc').value = b.description || '';
    $('b-drive').value = b.drive_url || ''; $('b-cover').value = ''; $('b-cover-file').value = '';
    $('b-active').checked = b.active !== false;
    editingCover = b.cover_url || '';
    document.querySelector('input[name=cover-src][value=file]').checked = true;
    syncCoverBoxes();
    $('b-msg').textContent = ''; $('b-msg').classList.remove('ok');
    previewBook();
  }
  $('b-new').addEventListener('click', function () {
    editingBook = null; $('b-form-title').textContent = 'كتاب جديد'; $('b-save').textContent = 'نشر الكتاب';
    fillBookForm(null); openEditor('b-editor', 'b-title');
  });
  $('b-cancel').addEventListener('click', function () { $('b-editor').hidden = true; editingBook = null; });

  $('book-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var m = $('b-msg'), btn = $('b-save');
    m.classList.remove('ok');
    var title = val('b-title'), drive = normDrive(val('b-drive')), src = coverSrc(), file = $('b-cover-file').files[0];
    if (!title) { m.textContent = 'اكتب عنوان الكتاب.'; $('b-title').focus(); return; }
    if (!okUrl(drive)) { m.textContent = 'الصق رابط Google Drive كاملاً (يبدأ بـ https://).'; $('b-drive').focus(); return; }
    if (src === 'url' && val('b-cover') && !okUrl(val('b-cover'))) { m.textContent = 'رابط الغلاف يجب أن يبدأ بـ https://'; return; }
    if (file && file.size > 15 * 1048576) { m.textContent = 'الصورة كبيرة جداً (أكثر من 15 MB).'; return; }
    var id = editingBook || newId('b_'), oldCover = editingCover;
    btn.disabled = true; m.textContent = 'جارٍ الحفظ…';
    var coverP = Promise.resolve(oldCover || null);
    if (src === 'none') coverP = Promise.resolve(null);
    else if (src === 'url' && val('b-cover')) coverP = Promise.resolve(normCover(val('b-cover')));
    else if (src === 'file' && file) {
      m.textContent = 'جارٍ تجهيز صورة الغلاف…';
      coverP = shrinkImage(file, 600).then(function (blob) { m.textContent = 'جارٍ رفع صورة الغلاف…'; return SB.uploadCover(id + '-' + Date.now().toString(36) + '.jpg', blob); });
    }
    coverP.then(function (cover) {
      m.textContent = 'جارٍ الحفظ…';
      var row = { title: title, author: val('b-author') || null, category: $('b-cat').value, category_name: CAT_AR[$('b-cat').value],
        year: val('b-year') || null, pages: val('b-pages') || null, description: val('b-desc') || null,
        drive_url: drive, cover_url: cover, active: $('b-active').checked };
      var done = editingBook ? SB.updateBook(id, row) : (row.id = id, SB.saveBook(row));
      return done.then(function () {
        if (oldCover && oldCover !== cover) SB.deleteCover(oldCover);   // حذف الغلاف القديم من المخزن
        editingCover = cover || '';
        return cover;
      });
    }).then(function () {
      m.classList.add('ok'); m.textContent = editingBook ? 'تم حفظ التعديلات.' : 'تم نشر «' + title + '» في المكتبة.';
      try { localStorage.removeItem('delta_books_v2'); } catch (x) {}
      if (!editingBook) { editingBook = id; $('b-form-title').textContent = 'تعديل الكتاب'; $('b-save').textContent = 'حفظ التعديلات'; }
      $('b-cover-file').value = '';
      return loadBooksAdmin();
    }).catch(function (err) { m.textContent = err.message; }).then(function () { btn.disabled = false; });
  });

  function loadBooksAdmin() {
    $('b-tbl-msg').textContent = '';
    return SB.getBooks().then(function (rows) {
      bookRows = rows || [];
      $('b-count').textContent = '(' + bookRows.length + ')'; $('nav-b').textContent = bookRows.length;
      $('b-body').innerHTML = bookRows.map(function (b) {
        var cov = b.cover_url ? '<img src="' + esc(b.cover_url) + '" width="40" height="54" loading="lazy" class="mini-cover" alt="" onerror="this.replaceWith(\'—\')">' : '—';
        var link = b.drive_url ? '<a class="textlink" href="' + esc(b.drive_url) + '" target="_blank" rel="noopener noreferrer">Drive ↗</a>' : '—';
        var vis = b.active === false ? '<span class="tag off">مخفي</span>' : '<span class="tag on">ظاهر</span>';
        return '<tr><td>' + cov + '</td><td><b>' + txt(b.title) + '</b>' + (b.author ? '<br><span class="small-note">' + txt(b.author) + '</span>' : '') + '</td>' +
          '<td>' + esc(CAT_AR[b.category] || b.category) + '</td><td>' + link + '</td><td>' + vis + '</td>' +
          '<td class="acts"><button class="btn small quiet" type="button" data-act="bedit" data-id="' + esc(b.id) + '">تعديل</button>' +
          '<button class="btn small quiet" type="button" data-act="bvis" data-id="' + esc(b.id) + '">' + (b.active === false ? 'إظهار' : 'إخفاء') + '</button>' +
          '<button class="btn small quiet danger" type="button" data-act="bdel" data-id="' + esc(b.id) + '">حذف</button></td></tr>';
      }).join('') || '<tr><td colspan="6" class="empty">لا توجد كتب في المكتبة بعد. اضغط «+ إضافة كتاب».</td></tr>';
    }, function (e) { $('b-count').textContent = ''; $('b-body').innerHTML = ''; $('b-tbl-msg').textContent = e.message; });
  }

  // أزرار جدولَي الدورات والكتب (التعديل والإخفاء فوريّان؛ الحذف يحتاج ضغطة تأكيد)
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-act]'); if (!b) return;
    var act = b.getAttribute('data-act'), id = b.getAttribute('data-id');
    if (act === 'cedit') {
      var c = CO.byId(courseRows, id); if (!c) return;
      editingCourse = id; $('co-form-title').textContent = 'تعديل الدورة'; $('co-save').textContent = 'حفظ التعديلات';
      fillCourseForm(c); openEditor('co-editor', 'co-title');
    } else if (act === 'bedit') {
      var bk = CO.byId(bookRows, id); if (!bk) return;
      editingBook = id; $('b-form-title').textContent = 'تعديل الكتاب'; $('b-save').textContent = 'حفظ التعديلات';
      fillBookForm(bk); openEditor('b-editor', 'b-title');
    } else if (act === 'cvis' || act === 'bvis') {
      var row = CO.byId(act === 'cvis' ? courseRows : bookRows, id); if (!row) return;
      b.disabled = true;
      (act === 'cvis' ? SB.saveCourse({ active: row.active === false }, id).then(loadCourses)
                      : SB.updateBook(id, { active: row.active === false }).then(loadBooksAdmin))
        .catch(function (err) { $(act === 'cvis' ? 'co-tbl-msg' : 'b-tbl-msg').textContent = err.message; b.disabled = false; });
      try { localStorage.removeItem(act === 'cvis' ? CO.CACHE_KEY : 'delta_books_v2'); } catch (x) {}
    }
  });

  // ---------------- البداية ----------------
  SB.session().then(function (s) {
    if (!s) return gate();
    return SB.profile().then(function (p) {
      if (!p || p.role !== 'admin' || !p.active) return gate('هذه الصفحة للأدمن فقط', 'حسابك ليس حساب أدمن. ارجع إلى <a href="files.html">ملفات الدورة</a>.');
      me = p; $('panel').hidden = false; $('a-pw').value = genPw();
      var h = location.hash;
      if (h === '#add-course') $('co-new').click();
      else if (h === '#add-book') $('b-new').click();
      else if (h && $(h.slice(1))) setTimeout(function () { $(h.slice(1)).scrollIntoView(); }, 50);
      return Promise.all([loadUsers(), loadFiles(), contentStatus(), loadCourses(), loadBooksAdmin()]);
    });
  }).catch(function (e) { gate('تعذّر التحقق من الحساب', esc(e.message)); });
})();
