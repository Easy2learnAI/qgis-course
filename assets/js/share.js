/* أزرار المشاركة على مواقع التواصل — Delta Conception
   SHARE.button({url, title, text, label}) يعيد HTML لزر مشاركة؛ النقر عليه يفتح:
   - على الهاتف: نافذة المشاركة الأصلية للجهاز (navigator.share)
   - على الحاسوب: قائمة صغيرة (واتساب، فيسبوك، تيليغرام، X، لينكدإن، البريد، نسخ الرابط)
   SHARE.focusHash() يُبرز البطاقة المشار إليها في الرابط (#book-… أو #course-…) بعد عرض القائمة. */
(function () {
  var CANON = 'https://easy2learnai.github.io/qgis-course/';
  function tr(k, fb) { return window.I18N ? window.I18N.t(k, fb) : fb; }
  function esc(s) { return window.esc ? window.esc(s) : String(s == null ? '' : s); }

  // رابط مطلق: من عنوان الموقع الحالي، أو من عنوان GitHub Pages عند التجربة محلياً
  function abs(rel) {
    var local = !/^https?:$/.test(location.protocol) || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    try { return new URL(rel || '', local ? CANON : location.href).href; } catch (e) { return CANON; }
  }

  var ICON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>';

  // label=true: زر بنص؛ وإلا زر أيقونة مع وصف لقارئ الشاشة
  function button(o) {
    var name = tr('share_btn', 'مشاركة');
    return '<button type="button" class="btn small quiet share-btn' + (o.label ? '' : ' icon-only') + '" aria-haspopup="true" aria-expanded="false"' +
      ' data-share-url="' + esc(abs(o.url)) + '" data-share-title="' + esc(o.title || '') + '" data-share-text="' + esc(o.text || o.title || '') + '"' +
      (o.label ? '' : ' aria-label="' + esc(name + (o.title ? ': ' + o.title : '')) + '" title="' + esc(name) + '"') + '>' +
      ICON + (o.label ? '<span>' + esc(name) + '</span>' : '') + '</button>';
  }

  var NETS = [
    ['whatsapp', 'WhatsApp', '#25d366', function (u, t) { return 'https://wa.me/?text=' + encodeURIComponent(t + '\n' + u); },
      '<path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3z"/>'],
    ['facebook', 'Facebook', '#1877f2', function (u) { return 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(u); },
      '<path fill="currentColor" d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1a23 23 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V22z"/>'],
    ['telegram', 'Telegram', '#229ed9', function (u, t) { return 'https://t.me/share/url?url=' + encodeURIComponent(u) + '&text=' + encodeURIComponent(t); },
      '<path fill="currentColor" d="M21.4 4.1 2.9 11.2c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.8-1.4-1.5zM9.8 14.5l8.6-7.7c.4-.3-.1-.5-.6-.2L7.9 13.3z"/>'],
    ['x', 'X', '#000000', function (u, t) { return 'https://x.com/intent/tweet?url=' + encodeURIComponent(u) + '&text=' + encodeURIComponent(t); },
      '<path fill="currentColor" d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/>'],
    ['linkedin', 'LinkedIn', '#0a66c2', function (u) { return 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(u); },
      '<path fill="currentColor" d="M4.5 3A1.9 1.9 0 1 0 4.5 7a1.9 1.9 0 0 0 0-4zM3 8.5h3V21H3zm5.3 0h2.9v1.7h.1a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.6 2 3.6 4.7V21h-3v-6c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21h-3z"/>'],
    ['email', null, '#4b5a68', function (u, t, title) { return 'mailto:?subject=' + encodeURIComponent(title || t) + '&body=' + encodeURIComponent(t + '\n' + u); },
      '<path fill="none" stroke="currentColor" stroke-width="2" d="M3 5h18v14H3zM3 6l9 7 9-7"/>']
  ];

  var menu = null, owner = null;
  function close(focusBack) {
    if (!menu) return;
    menu.remove(); menu = null;
    if (owner) { owner.setAttribute('aria-expanded', 'false'); if (focusBack) owner.focus(); }
    owner = null;
    document.removeEventListener('keydown', onKey, true);
    window.removeEventListener('resize', onWin); window.removeEventListener('scroll', onWin, true);
  }
  // عند التمرير أو تغيير حجم النافذة: تتبع القائمة الزر، وتُغلق إذا خرج الزر من الشاشة
  function place() {
    if (!menu || !owner) return;
    var r = owner.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight || !r.width) { close(false); return; }
    var w = menu.offsetWidth, h = menu.offsetHeight, pad = 8;
    var left = document.documentElement.dir === 'rtl' ? r.right - w : r.left;
    left = Math.max(pad, Math.min(left, window.innerWidth - w - pad));
    var top = r.bottom + 6;
    if (top + h > window.innerHeight - pad && r.top - h - 6 > pad) top = r.top - h - 6;
    menu.style.left = left + 'px'; menu.style.top = Math.max(pad, top) + 'px';
  }
  var raf = 0;
  function onWin() { if (!raf) raf = requestAnimationFrame(function () { raf = 0; place(); }); }
  function onKey(e) {
    if (!menu) return;
    if (e.key === 'Escape') { e.preventDefault(); close(true); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      var items = [].slice.call(menu.querySelectorAll('.share-item'));
      var i = items.indexOf(document.activeElement);
      i = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
      items[i].focus({ preventScroll: true }); e.preventDefault();
    }
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (res, rej) {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy') ? res() : rej(); } catch (e) { rej(e); }
      ta.remove();
    });
  }

  function openMenu(btn, d) {
    close(false);
    owner = btn; btn.setAttribute('aria-expanded', 'true');
    menu = document.createElement('div');
    menu.className = 'share-menu';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-label', tr('share_btn', 'مشاركة'));
    var t = d.text + ' — ' + ((window.SITE && SITE.name) || 'Delta Conception');
    menu.innerHTML = '<p class="share-head">' + esc(tr('share_head', 'شارك عبر')) + '</p>' +
      NETS.map(function (n) {
        return '<a class="share-item" href="' + esc(n[3](d.url, t, d.title)) + '"' + (n[0] === 'email' ? '' : ' target="_blank" rel="noopener noreferrer"') + ' data-net="' + n[0] + '">' +
          '<span class="share-ico" style="color:' + n[2] + '"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' + n[4] + '</svg></span>' +
          '<span>' + esc(n[1] || tr('share_email', 'البريد الإلكتروني')) + '</span></a>';
      }).join('') +
      '<button type="button" class="share-item share-copy"><span class="share-ico"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg></span>' +
      '<span>' + esc(tr('share_copy', 'نسخ الرابط')) + '</span></button>' +
      '<p class="share-status" role="status" aria-live="polite"></p>';
    document.body.appendChild(menu);

    place();

    menu.addEventListener('click', function (e) {
      var c = e.target.closest('.share-copy');
      if (c) {
        var st = menu.querySelector('.share-status');
        copy(d.url).then(function () { st.textContent = tr('share_copied', 'تم نسخ الرابط ✓'); setTimeout(function () { close(true); }, 1100); },
          function () { st.textContent = d.url; });
        return;
      }
      if (e.target.closest('a.share-item')) setTimeout(function () { close(false); }, 0);
    });
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('resize', onWin); window.addEventListener('scroll', onWin, true);
    menu.querySelector('.share-item').focus({ preventScroll: true });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.share-btn');
    if (!btn) { if (menu && !menu.contains(e.target)) close(false); return; }
    e.preventDefault();
    if (owner === btn) { close(true); return; }
    var d = { url: btn.getAttribute('data-share-url'), title: btn.getAttribute('data-share-title'), text: btn.getAttribute('data-share-text') };
    // الهاتف: نافذة المشاركة الأصلية (تضم كل التطبيقات المثبتة)
    if (navigator.share && window.matchMedia && matchMedia('(pointer:coarse)').matches) {
      navigator.share({ title: d.title, text: d.text, url: d.url }).catch(function (err) {
        if (!err || err.name !== 'AbortError') openMenu(btn, d);
      });
      return;
    }
    openMenu(btn, d);
  });

  // إبراز البطاقة المشار إليها في الرابط بعد ظهورها (ويبقى الإبراز إن أُعيد عرض القائمة)
  var target = null, until = 0;
  function focusHash() {
    if (target === null) {
      var h = '';
      try { h = decodeURIComponent((location.hash || '').slice(1)); } catch (e) {}
      target = /^(book|course)-/.test(h) ? h : '';
    }
    if (!target) return;
    var el = document.getElementById(target);
    if (!el) return;
    if (!until) {
      until = Date.now() + 2600;
      requestAnimationFrame(function () { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); });
      setTimeout(function () { var x = document.getElementById(target); if (x) x.classList.remove('flash'); target = ''; }, 2600);
    }
    if (Date.now() < until) el.classList.add('flash');
  }

  window.addEventListener('hashchange', function () { target = null; until = 0; focusHash(); });

  window.SHARE = { button: button, url: abs, focusHash: focusHash };
})();
