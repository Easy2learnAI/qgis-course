/* صفحة برنامج الدورة */
(function () {
  var C = window.COURSE, el = document.getElementById('syllabus');
  function render() {
    var cur = window.I18N.getLang(), open = esc(window.I18N.t('prog_open_unit'));
    el.innerHTML = C.units.map(function (raw) {
      var u = C.getLocalizedUnit(raw, cur);
      return '<tr><td><span class="num">' + u.n + '</span></td><td><b>' + txt(u.axis) + '</b></td>' +
        '<td>' + (u.exercise ? '<b>' + esc(u.exercise) + ':</b> ' : '') + txt(u.exTitle) + '</td>' +
        '<td><a class="textlink" href="lesson.html?u=' + u.n + '">' + open + '</a></td></tr>';
    }).join('');
  }
  render();
  window.addEventListener('deltalangchange', render);
})();
