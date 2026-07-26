// Логика витрины: сетка, зум колонок, фильтры, карточка изделия.
// Данные — в js/products.js.

(function () {
  'use strict';

  var MOBILE_Q = window.matchMedia('(max-width: 768px)');

  // Варианты числа колонок: индекс 0 — самый мелкий масштаб.
  var ZOOM = { mobile: [3, 2, 1], desktop: [6, 3] };

  var NAV_H = { mobile: 88, desktop: 96 }; // высота шапки, как на референсе
  var MAX_SIZE = 560; // до какой ширины разгоняется фото при открытии

  var state = {
    isMobile: MOBILE_Q.matches,
    levels: MOBILE_Q.matches ? ZOOM.mobile : ZOOM.desktop,
    index: 0,
    direction: 1, // 1 — следующий клик приближает, -1 — отдаляет
    filter: 'all',
    openCode: null,
    openInfo: null,
    activeTile: null,
    resetOriginTimer: 0,
  };

  var el = {
    nav: document.getElementById('nav'),
    zoomBtn: document.getElementById('zoom-btn'),
    filters: document.getElementById('filters'),
    scroll: document.querySelector('.scroll-area'),
    grid: document.getElementById('grid'),
    detail: document.getElementById('detail'),
    info: document.getElementById('info'),
    contactBtn: document.getElementById('contact-btn'),
    footerContact: document.getElementById('footer-contact'),
  };

  function navH() {
    return state.isMobile ? NAV_H.mobile : NAV_H.desktop;
  }

  // ── контакты ───────────────────────────────────────────────

  function contactHref(product) {
    if (CONTACT.telegram) return CONTACT.telegram;
    if (!CONTACT.email) return '#';
    var subject = product ? '?subject=' + encodeURIComponent(product.code + ' ' + product.name) : '';
    return 'mailto:' + CONTACT.email + subject;
  }

  // ── сетка ──────────────────────────────────────────────────

  function visibleProducts() {
    if (state.filter === 'all') return PRODUCTS;
    return PRODUCTS.filter(function (p) {
      return p.cats && p.cats.indexOf(state.filter) !== -1;
    });
  }

  function renderGrid() {
    var frag = document.createDocumentFragment();

    visibleProducts().forEach(function (p) {
      var btn = document.createElement('button');
      btn.className = 'product-item';
      btn.type = 'button';
      btn.dataset.code = p.code;
      btn.setAttribute('aria-label', 'Открыть ' + p.code);

      btn.innerHTML =
        '<div class="product-image">' +
          '<div class="image-container"><div class="square">' +
            '<img src="' + p.img + '" alt="' + p.code + '" loading="lazy" decoding="async">' +
          '</div></div>' +
          '<p class="product-label">' + p.code + '</p>' +
        '</div>';

      frag.appendChild(btn);
    });

    el.grid.replaceChildren(frag);
  }

  function applyZoom() {
    el.grid.style.setProperty('--col-count', state.levels[state.index]);
    el.grid.classList.toggle('single-col', state.levels[state.index] === 1);
  }

  function setZoomIcon() {
    // на максимальном приближении кнопка становится «назад», как на референсе
    var atMax = state.index === state.levels.length - 1;
    el.zoomBtn.dataset.state = state.openCode || state.openInfo ? 'back' : atMax ? 'back' : 'menu';
  }

  function stepZoom() {
    var next = state.index + state.direction;

    if (next < 0 || next > state.levels.length - 1) return;
    state.index = next;

    if (state.index === state.levels.length - 1) state.direction = -1;
    if (state.index === 0) state.direction = 1;

    applyZoom();
    setZoomIcon();
  }

  // ── фильтры ────────────────────────────────────────────────

  function renderFilters() {
    var frag = document.createDocumentFragment();

    FILTERS.forEach(function (f) {
      var b = document.createElement('button');
      b.className = 'filter-btn';
      b.type = 'button';
      b.textContent = f.label;
      b.dataset.id = f.id;
      b.setAttribute('aria-pressed', String(f.id === state.filter));
      frag.appendChild(b);
    });

    el.filters.replaceChildren(frag);
  }

  function setFilter(id) {
    if (state.filter === id) return;
    closePanels();
    state.filter = id;

    Array.prototype.forEach.call(el.filters.children, function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.id === id));
    });

    renderGrid();
  }

  // ── наезд камеры на изделие ────────────────────────────────
  //
  // Отдельной картинки нет: сетка целиком сдвигается и масштабируется так,
  // чтобы нажатый тайл оказался по центру экрана. Тот же <img>, что и был, —
  // поэтому ничего не перерисовывается и не мигает.

  function openDetail(code, tile) {
    var p = PRODUCTS.filter(function (x) { return x.code === code; })[0];
    if (!p) return;

    clearTimeout(state.resetOriginTimer);
    state.openCode = code;
    state.activeTile = tile;

    fillDetail(p);

    // высоту описания меряем заранее, чтобы отвести под него место
    el.detail.style.top = '-9999px';
    el.detail.setAttribute('aria-hidden', 'false');
    var infoH = el.detail.offsetHeight;

    var top = navH();
    var availH = Math.max(160, window.innerHeight - top - infoH);
    var availW = Math.min(MAX_SIZE, window.innerWidth - 32);
    var size = Math.max(120, Math.min(availW, availH));

    var square = tile.querySelector('.square');
    var sr = square.getBoundingClientRect();
    var gr = el.grid.getBoundingClientRect();

    var cx = sr.left + sr.width / 2;
    var cy = sr.top + sr.height / 2;

    // точка, вокруг которой масштабируем, — центр нажатого фото
    el.grid.style.transformOrigin =
      (cx - gr.left).toFixed(2) + 'px ' + (cy - gr.top).toFixed(2) + 'px';

    el.grid.style.setProperty('--duration', (state.isMobile ? 200 : 300) + 'ms');
    el.grid.style.setProperty('--scale', String(size / sr.width));
    el.grid.style.setProperty('--tx', (window.innerWidth / 2 - cx).toFixed(2) + 'px');
    el.grid.style.setProperty('--ty', (top + availH / 2 - cy).toFixed(2) + 'px');
    el.grid.style.setProperty('--opacity', '0.8');

    el.grid.classList.add('is-open');
    tile.classList.add('is-active');

    el.scroll.style.overflowY = 'hidden';
    el.detail.style.top = (top + availH) + 'px';

    setZoomIcon();
  }

  function fillDetail(p) {
    document.getElementById('detail-code').textContent = p.code;
    document.getElementById('detail-name').textContent = p.name;

    document.getElementById('detail-specs').innerHTML =
      (p.material ? '<dt>МАТЕРИАЛ</dt><dd>' + p.material + '</dd>' : '') +
      (p.sizes ? '<dt>РАЗМЕР</dt><dd>' + p.sizes + '</dd>' : '');

    var note = document.getElementById('detail-note');
    note.textContent = p.note || '';
    note.hidden = !p.note;

    document.getElementById('detail-price').textContent =
      typeof p.price === 'number'
        ? p.price.toLocaleString('ru-RU') + ' ₽'
        : 'ЦЕНА ПО ЗАПРОСУ';

    document.getElementById('detail-cta').href = contactHref(p);
  }

  function openInfo(key) {
    var data = INFO[key];
    if (!data) return;

    state.openInfo = key;
    document.getElementById('info-title').textContent = data.title;
    document.getElementById('info-text').textContent = data.text;

    el.info.setAttribute('aria-hidden', 'false');
    el.scroll.style.overflowY = 'hidden';
    setZoomIcon();
  }

  function closePanels() {
    if (!state.openCode && !state.openInfo) return false;

    state.openCode = null;
    state.openInfo = null;

    el.detail.setAttribute('aria-hidden', 'true');
    el.info.setAttribute('aria-hidden', 'true');

    el.grid.style.setProperty('--duration', (state.isMobile ? 100 : 300) + 'ms');
    el.grid.style.setProperty('--scale', '1');
    el.grid.style.setProperty('--tx', '0px');
    el.grid.style.setProperty('--ty', '0px');
    el.grid.style.setProperty('--opacity', '1');
    el.grid.classList.remove('is-open');

    if (state.activeTile) {
      state.activeTile.classList.remove('is-active');
      state.activeTile = null;
    }

    // origin возвращаем в центр только после отъезда, иначе сетку дёрнет
    clearTimeout(state.resetOriginTimer);
    state.resetOriginTimer = setTimeout(function () {
      if (!state.openCode) el.grid.style.transformOrigin = '50% 50%';
    }, 300);

    el.scroll.style.overflowY = '';
    setZoomIcon();
    return true;
  }

  // ── события ────────────────────────────────────────────────

  el.zoomBtn.addEventListener('click', function () {
    if (closePanels()) return;
    stepZoom();
  });

  el.filters.addEventListener('click', function (e) {
    var b = e.target.closest('.filter-btn');
    if (b) setFilter(b.dataset.id);
  });

  el.grid.addEventListener('click', function (e) {
    // пока изделие открыто, любой клик по сетке отъезжает обратно
    if (state.openCode) {
      closePanels();
      return;
    }
    var tile = e.target.closest('.product-item');
    if (tile) openDetail(tile.dataset.code, tile);
  });

  el.info.addEventListener('click', function () {
    closePanels();
  });

  document.querySelector('.footer').addEventListener('click', function (e) {
    var a = e.target.closest('a[data-info]');
    if (!a) return;
    e.preventDefault();
    openInfo(a.dataset.info);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePanels();
  });

  // размеры посчитаны от вьюпорта, поэтому при ресайзе просто отъезжаем
  window.addEventListener('resize', function () {
    if (state.openCode) closePanels();
  });

  // переключение набора масштабов при смене ширины экрана
  function syncViewport(e) {
    var mobile = e.matches;
    if (mobile === state.isMobile) return;

    state.isMobile = mobile;
    state.levels = mobile ? ZOOM.mobile : ZOOM.desktop;
    state.index = 0;
    state.direction = 1;

    applyZoom();
    setZoomIcon();
  }

  if (MOBILE_Q.addEventListener) MOBILE_Q.addEventListener('change', syncViewport);
  else MOBILE_Q.addListener(syncViewport);

  // ── старт ──────────────────────────────────────────────────

  el.contactBtn.href = contactHref(null);
  el.footerContact.href = contactHref(null);
  el.footerContact.textContent = CONTACT.telegram ? 'Telegram' : 'Почта';

  renderFilters();
  renderGrid();
  applyZoom();
  setZoomIcon();
})();
