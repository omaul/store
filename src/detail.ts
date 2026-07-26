// Открытие изделия — наезд камеры, а не новый экран: сетка целиком сдвигается
// и масштабируется так, чтобы нажатый тайл оказался по центру. Увеличивается
// тот же <img>, поэтому фото не перерисовывается и не мигает.
// Отъезд общий для всех панелей и живёт в panels.ts.

import { PRODUCTS } from './products';
import { el } from './dom';
import { state, forViewport } from './state';
import { contactHref } from './contact';
import { setBackBtn } from './panels';
import type { Product } from './types';

const OPEN_MS = { mobile: 200, desktop: 300 };
const MAX_SIZE = 560; // до какой ширины разгоняется фото при открытии

function fillDetail(p: Product): void {
  el.detailCode.textContent = p.code;
  el.detailName.textContent = p.name;

  const specs: [string, string][] = [];
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

  el.detailNote.textContent = p.note ?? '';
  el.detailNote.hidden = !p.note;

  el.detailPrice.textContent =
    p.price === null ? 'ЦЕНА ПО ЗАПРОСУ' : p.price.toLocaleString('ru-RU') + ' ₽';

  el.detailCta.href = contactHref(p);
}

export function openDetail(code: string, tile: HTMLElement): void {
  const p = PRODUCTS.find((x) => x.code === code);
  const square = tile.querySelector('.square');
  if (!p || !square) return;

  window.clearTimeout(state.resetOriginTimer);
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

  const sr = square.getBoundingClientRect();
  const gr = el.grid.getBoundingClientRect();

  const cx = sr.left + sr.width / 2;
  const cy = sr.top + sr.height / 2;

  // масштабируем вокруг центра нажатого фото
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

  setBackBtn();
}
