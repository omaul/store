// Логика витрины: сетка, зум колонок, фильтры, карточка изделия.
// Данные — в js/products.js.

(function () {
  'use strict';

  const MOBILE_Q = window.matchMedia('(max-width: 768px)');

  // Варианты числа колонок: индекс 0 — самый мелкий масштаб.
  const ZOOM = { mobile: [3, 2, 1], desktop: [6, 3] };

  // Длительность наезда камеры, мс. На телефоне отъезд быстрее наезда.
  const OPEN_MS = { mobile: 200, desktop: 300 };
  const CLOSE_MS = { mobile: 100, desktop: 300 };

  const MAX_SIZE = 560; // до какой ширины разгоняется фото при открытии

  const state = {
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

  const el = {
    nav: document.getElementById('nav'),
    zoomBtn: document.getElementById('zoom-btn'),
    filters: document.getElementById('filters'),
    scroll: document.querySelector('.scroll-area'),
    grid: document.getElementById('grid'),
    footer: document.querySelector('.footer'),
    contactBtn: document.getElementById('contact-btn'),
    footerContact: document.getElementById('footer-contact'),
    detail: document.getElementById('detail'),
    detailCode: document.getElementById('detail-code'),
    detailName: document.getElementById('detail-name'),
    detailSpecs: document.getElementById('detail-specs'),
    detailNote: document.getElementById('detail-note'),
    detailPrice: document.getElementById('detail-price'),
    detailCta: document.getElementById('detail-cta'),
    info: document.getElementById('info'),
    infoTitle: document.getElementById('info-title'),
    infoText: document.getElementById('info-text'),
  };

  // значение из пары { mobile, desktop } под текущую ширину экрана
  function forViewport(pair) {
    return state.isMobile ? pair.mobile : pair.desktop;
  }

  // ── контакты ───────────────────────────────────────────────

  function contactHref(product) {
    if (CONTACT.telegram) return CONTACT.telegram;
    if (!CONTACT.email) return '#';
    const subject = product
      ? '?subject=' + encodeURIComponent(product.code + ' ' + product.name)
      : '';
    return 'mailto:' + CONTACT.email + subject;
  }

  // ── сетка ──────────────────────────────────────────────────

  function visibleProducts() {
    if (state.filter === 'all') return PRODUCTS;
    return PRODUCTS.filter((p) => p.cats && p.cats.includes(state.filter));
  }

  function createTile(p) {
    const img = document.createElement('img');
    img.src = p.img;
    img.alt = p.code;
    img.loading = 'lazy';
    img.decoding = 'async';

    const square = document.createElement('div');
    square.className = 'square';
    square.append(img);

    const label = document.createElement('p');
    label.className = 'product-label';
    label.textContent = p.code;

    const image = document.createElement('div');
    image.className = 'product-image';
    image.append(square, label);

    const tile = document.createElement('button');
    tile.className = 'product-item';
    tile.type = 'button';
    tile.dataset.code = p.code;
    tile.setAttribute('aria-label', 'Открыть ' + p.code);
    tile.append(image);

    return tile;
  }

  function renderGrid() {
    el.grid.replaceChildren(...visibleProducts().map(createTile));
  }

  function applyZoom() {
    const cols = state.levels[state.index];
    el.grid.style.setProperty('--col-count', cols);
    el.grid.classList.toggle('single-col', cols === 1);
  }

  function setZoomIcon() {
    // на максимальном приближении кнопка становится «назад», как на референсе
    const atMax = state.index === state.levels.length - 1;
    const back = Boolean(state.openCode || state.openInfo) || atMax;
    el.zoomBtn.dataset.state = back ? 'back' : 'menu';
  }

  function stepZoom() {
    const next = state.index + state.direction;

    if (next < 0 || next > state.levels.length - 1) return;
    state.index = next;

    if (state.index === state.levels.length - 1) state.direction = -1;
    if (state.index === 0) state.direction = 1;

    applyZoom();
    setZoomIcon();
  }

  // ── фильтры ────────────────────────────────────────────────

  function renderFilters() {
    el.filters.replaceChildren(
      ...FILTERS.map((f) => {
        const b = document.createElement('button');
        b.className = 'filter-btn';
        b.type = 'button';
        b.textContent = f.label;
        b.dataset.id = f.id;
        b.setAttribute('aria-pressed', String(f.id === state.filter));
        return b;
      })
    );
  }

  function setFilter(id) {
    if (state.filter === id) return;
    closePanels();
    state.filter = id;

    for (const b of el.filters.children) {
      b.setAttribute('aria-pressed', String(b.dataset.id === id));
    }

    renderGrid();
  }

  // ── наезд камеры на изделие ────────────────────────────────
  //
  // Отдельной картинки нет: сетка целиком сдвигается и масштабируется так,
  // чтобы нажатый тайл оказался по центру экрана. Тот же <img>, что и был, —
  // поэтому ничего не перерисовывается и не мигает.

  function openDetail(code, tile) {
    const p = PRODUCTS.find((x) => x.code === code);
    if (!p) return;

    clearTimeout(state.resetOriginTimer);
    state.openCode = code;
    state.activeTile = tile;

    fillDetail(p);

    // высоту описания меряем заранее, чтобы отвести под него место
    el.detail.style.top = '-9999px';
    el.detail.setAttribute('aria-hidden', 'false');
    const infoH = el.detail.offsetHeight;

    const top = el.nav.offsetHeight;
    const availH = Math.max(160, window.innerHeight - top - infoH);
    const availW = Math.min(MAX_SIZE, window.innerWidth - 32);
    const size = Math.max(120, Math.min(availW, availH));

    const sr = tile.querySelector('.square').getBoundingClientRect();
    const gr = el.grid.getBoundingClientRect();

    const cx = sr.left + sr.width / 2;
    const cy = sr.top + sr.height / 2;

    // точка, вокруг которой масштабируем, — центр нажатого фото
    el.grid.style.transformOrigin =
      (cx - gr.left).toFixed(2) + 'px ' + (cy - gr.top).toFixed(2) + 'px';

    el.grid.style.setProperty('--duration', forViewport(OPEN_MS) + 'ms');
    el.grid.style.setProperty('--scale', String(size / sr.width));
    el.grid.style.setProperty('--tx', (window.innerWidth / 2 - cx).toFixed(2) + 'px');
    el.grid.style.setProperty('--ty', (top + availH / 2 - cy).toFixed(2) + 'px');
    el.grid.style.setProperty('--opacity', '0.8');

    el.grid.classList.add('is-open');
    tile.classList.add('is-active');

    el.scroll.style.overflowY = 'hidden';
    el.detail.style.top = top + availH + 'px';

    setZoomIcon();
  }

  function fillDetail(p) {
    el.detailCode.textContent = p.code;
    el.detailName.textContent = p.name;

    const specs = [];
    if (p.material) specs.push(['МАТЕРИАЛ', p.material]);
    if (p.sizes) specs.push(['РАЗМЕР', p.sizes]);

    el.detailSpecs.replaceChildren(
      ...specs.flatMap(([term, value]) => {
        const dt = document.createElement('dt');
        dt.textContent = term;
        const dd = document.createElement('dd');
        dd.textContent = value;
        return [dt, dd];
      })
    );

    el.detailNote.textContent = p.note || '';
    el.detailNote.hidden = !p.note;

    el.detailPrice.textContent =
      typeof p.price === 'number'
        ? p.price.toLocaleString('ru-RU') + ' ₽'
        : 'ЦЕНА ПО ЗАПРОСУ';

    el.detailCta.href = contactHref(p);
  }

  function openInfo(key) {
    const data = INFO[key];
    if (!data) return;

    state.openInfo = key;
    el.infoTitle.textContent = data.title;
    el.infoText.textContent = data.text;

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

    const closeMs = forViewport(CLOSE_MS);
    el.grid.style.setProperty('--duration', closeMs + 'ms');
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
    state.resetOriginTimer = setTimeout(() => {
      if (!state.openCode) el.grid.style.transformOrigin = '50% 50%';
    }, closeMs);

    el.scroll.style.overflowY = '';
    setZoomIcon();
    return true;
  }

  // ── события ────────────────────────────────────────────────

  el.zoomBtn.addEventListener('click', () => {
    if (closePanels()) return;
    stepZoom();
  });

  el.filters.addEventListener('click', (e) => {
    const b = e.target.closest('.filter-btn');
    if (b) setFilter(b.dataset.id);
  });

  el.grid.addEventListener('click', (e) => {
    // пока изделие открыто, любой клик по сетке отъезжает обратно
    if (state.openCode) {
      closePanels();
      return;
    }
    const tile = e.target.closest('.product-item');
    if (tile) openDetail(tile.dataset.code, tile);
  });

  el.info.addEventListener('click', () => {
    closePanels();
  });

  el.footer.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-info]');
    if (!a) return;
    e.preventDefault();
    openInfo(a.dataset.info);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanels();
  });

  // размеры посчитаны от вьюпорта, поэтому при ресайзе просто отъезжаем
  window.addEventListener('resize', () => {
    if (state.openCode) closePanels();
  });

  // переключение набора масштабов при смене ширины экрана
  MOBILE_Q.addEventListener('change', (e) => {
    if (e.matches === state.isMobile) return;

    state.isMobile = e.matches;
    state.levels = e.matches ? ZOOM.mobile : ZOOM.desktop;
    state.index = 0;
    state.direction = 1;

    applyZoom();
    setZoomIcon();
  });

  // ── старт ──────────────────────────────────────────────────

  el.contactBtn.href = contactHref(null);
  el.footerContact.href = contactHref(null);
  el.footerContact.textContent = CONTACT.telegram ? 'Telegram' : 'Почта';

  renderFilters();
  renderGrid();
  applyZoom();
  setZoomIcon();
})();
