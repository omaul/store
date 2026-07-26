// Точка входа: подписки на события и первый рендер.
// Логика разнесена по соседним модулям, содержимое сайта — в js/products.js.

import { CONTACT } from './products.js';
import { el } from './dom.js';
import { state, MOBILE_Q } from './state.js';
import { contactHref } from './contact.js';
import { renderGrid } from './grid.js';
import { applyZoom, setZoomIcon, stepZoom, syncViewport } from './zoom.js';
import { renderFilters, setFilter } from './filters.js';
import { openDetail } from './detail.js';
import { openInfo } from './info.js';
import { closePanels } from './panels.js';

// ── события ────────────────────────────────────────────────

// одна кнопка на две роли: пока что-то открыто — «назад», иначе масштаб
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

MOBILE_Q.addEventListener('change', (e) => syncViewport(e.matches));

// ── старт ──────────────────────────────────────────────────

el.contactBtn.href = contactHref(null);
el.footerContact.href = contactHref(null);
el.footerContact.textContent = CONTACT.telegram ? 'Telegram' : 'Почта';

renderFilters();
renderGrid();
applyZoom();
setZoomIcon();
