import './style.css';

import { CONTACT } from './products';
import { el } from './dom';
import { state, MOBILE_Q } from './state';
import { contactHref } from './contact';
import { renderGrid } from './grid';
import { renderFilters, setFilter } from './filters';
import { openDetail, toggleNote } from './detail';
import { openInfo } from './info';
import { closePanels } from './panels';
import { initGallery, showFrame, consumeSwipe } from './gallery';
import { initTap, isTap } from './tap';
import { revealWhenReady } from './boot';

// ── события ────────────────────────────────────────────────

el.backBtn.addEventListener('click', () => {
  closePanels();
});

el.filters.addEventListener('click', (e) => {
  if (!(e.target instanceof Element)) return;
  const b = e.target.closest<HTMLButtonElement>('.filter-btn');
  if (b?.dataset.id) setFilter(b.dataset.id);
});

el.grid.addEventListener('click', (e) => {
  // Пока изделие открыто, сетка вокруг работает как фон: тап по ней отъезжает
  // обратно. По самому кадру — нет, на нём листают, и промах пальцем не должен
  // захлопывать карточку. Движение тоже не закрывает: свайп ловит слайдер.
  if (state.openCode) {
    if (consumeSwipe() || !isTap(e)) return;
    if (e.target instanceof Element && e.target.closest('.product-item.is-active')) return;
    closePanels();
    return;
  }
  if (!isTap(e)) return;
  if (!(e.target instanceof Element)) return;
  const tile = e.target.closest<HTMLElement>('.product-item');
  if (tile?.dataset.code) openDetail(tile.dataset.code, tile);
});

// Панель текста закрывается тапом по фону вокруг текста. По самому тексту — нет:
// его читают, выделяют и прокручивают, и любое такое нажатие захлопывало страницу.
// Остаются кнопка слева вверху и Escape.
el.noteBtn.addEventListener('click', () => {
  toggleNote();
});

el.info.addEventListener('click', (e) => {
  if (!isTap(e)) return;
  if (e.target instanceof Element && e.target.closest('.info-body')) return;
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
  if (!state.openCode) return;
  if (e.key === 'ArrowLeft') showFrame(-1);
  if (e.key === 'ArrowRight') showFrame(1);
});

// размеры посчитаны от вьюпорта, поэтому при ресайзе просто отъезжаем
window.addEventListener('resize', () => {
  if (state.openCode) closePanels();
});

// isMobile влияет только на длительности анимации, число колонок задаёт CSS
MOBILE_Q.addEventListener('change', (e) => {
  state.isMobile = e.matches;
  closePanels();
});

// ── старт ──────────────────────────────────────────────────

el.contactBtn.href = contactHref(null);
el.footerContact.href = contactHref(null);
el.footerContact.textContent = CONTACT.telegram ? 'TELEGRAM' : 'ПОЧТА';

initTap();
initGallery();
renderFilters();
renderGrid();

// последним: ждёт шрифт и фото первого ряда, которые создал renderGrid
revealWhenReady();
