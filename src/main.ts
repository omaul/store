import './style.css';

import { CONTACT } from './products';
import { el } from './dom';
import { state, MOBILE_Q } from './state';
import { contactHref } from './contact';
import { renderGrid } from './grid';
import { applyZoom, setZoomIcon, stepZoom, syncViewport } from './zoom';
import { renderFilters, setFilter } from './filters';
import { openDetail } from './detail';
import { openInfo } from './info';
import { closePanels } from './panels';

// ── события ────────────────────────────────────────────────

el.zoomBtn.addEventListener('click', () => {
  if (closePanels()) return;
  stepZoom();
});

el.filters.addEventListener('click', (e) => {
  if (!(e.target instanceof Element)) return;
  const b = e.target.closest<HTMLButtonElement>('.filter-btn');
  if (b?.dataset.id) setFilter(b.dataset.id);
});

el.grid.addEventListener('click', (e) => {
  // пока изделие открыто, любой клик по сетке отъезжает обратно
  if (state.openCode) {
    closePanels();
    return;
  }
  if (!(e.target instanceof Element)) return;
  const tile = e.target.closest<HTMLElement>('.product-item');
  if (tile?.dataset.code) openDetail(tile.dataset.code, tile);
});

el.info.addEventListener('click', () => {
  closePanels();
});

el.footer.addEventListener('click', (e) => {
  if (!(e.target instanceof Element)) return;
  const a = e.target.closest<HTMLAnchorElement>('a[data-info]');
  if (!a?.dataset.info) return;
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
