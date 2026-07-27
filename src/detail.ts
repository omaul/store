// Открытие изделия — наезд камеры, а не новый экран: сетка целиком сдвигается
// и масштабируется так, чтобы нажатый тайл оказался по центру. Увеличивается
// тот же <img>, поэтому фото не перерисовывается и не мигает.
// Отъезд общий для всех панелей и живёт в panels.ts.

import { PRODUCTS } from './products';
import { el } from './dom';
import { state, forViewport } from './state';
import { contactHref } from './contact';
import { setBackBtn } from './panels';
import { mountGallery } from './gallery';
import type { Product } from './types';

const OPEN_MS = { mobile: 200, desktop: 300 };
const NOTE_MS = 150; // раскрытие описания — не открытие карточки, двигаемся быстрее
const MAX_SIZE = 720; // дальше пошёл бы заметный апскейл: снимки готовим в 1200 px
const SIDE_PAD = { mobile: 24, desktop: 32 };
const NOTE_W = 280; // колонка описания справа от кадра на десктопе
const NOTE_GAP = 24;

// Центр и размер тайла до наезда. Раскрытие описания считает раскладку заново, а
// померить сетку второй раз уже нельзя — она к этому моменту масштабирована.
let base: { cx: number; cy: number; w: number } | null = null;

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
  el.noteBtn.hidden = !p.note;
  // каждое открытие начинается со свёрнутого описания: раскрытое отнимает место
  // у кадра, и решать это должен тот, кто нажал кнопку
  el.noteBtn.setAttribute('aria-expanded', 'false');
  el.detailNote.hidden = true;

  el.detailPrice.textContent =
    p.price === null ? 'ЦЕНА ПО ЗАПРОСУ' : p.price.toLocaleString('ru-RU') + ' ₽';

  el.detailCta.href = contactHref(p);
}

export function toggleNote(): void {
  if (!state.openCode) return;
  const open = el.noteBtn.getAttribute('aria-expanded') === 'true';
  el.noteBtn.setAttribute('aria-expanded', String(!open));
  el.detailNote.hidden = open;
  layoutDetail(NOTE_MS);
}

function layoutDetail(ms: number): void {
  const tile = state.activeTile;
  if (!tile || !base) return;

  // высоту описания меряем заранее, чтобы отвести под него место
  el.detail.style.top = '-9999px';
  el.detail.setAttribute('aria-hidden', 'false');
  const infoH = el.detail.offsetHeight;

  const top = el.nav.offsetHeight;
  // на десктопе раскрытое описание встаёт справа и забирает ширину; на телефоне
  // оно в потоке панели, и его высота уже вошла в infoH
  const noteSide = !el.detailNote.hidden && !state.isMobile ? NOTE_W + NOTE_GAP : 0;
  const availH = Math.max(160, window.innerHeight - top - infoH);
  const availW = Math.max(120, window.innerWidth - forViewport(SIDE_PAD) - noteSide);

  // Кадр вписан в квадратный тайл (object-fit: contain), поэтому под вертикальный
  // снимок сторону квадрата можно взять больше доступной ширины: по горизонтали
  // кадр займёт только свою долю. Считаем по первому кадру — он же в сетке.
  const img = tile.querySelector('img');
  const ratio =
    img?.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
  const size = Math.max(
    120,
    Math.min(MAX_SIZE, availW / Math.min(ratio, 1), availH * Math.max(ratio, 1))
  );

  const centerX = (window.innerWidth - noteSide) / 2;
  const centerY = top + availH / 2;

  el.grid.style.setProperty('--duration', ms + 'ms');
  el.grid.style.setProperty('--scale', String(size / base.w));
  el.grid.style.setProperty('--tx', (centerX - base.cx).toFixed(2) + 'px');
  el.grid.style.setProperty('--ty', (centerY - base.cy).toFixed(2) + 'px');
  el.grid.style.setProperty('--opacity', '0.8');

  el.grid.classList.add('is-open');
  tile.classList.add('is-active');

  el.scroll.style.overflowY = 'hidden';
  el.detail.style.top = top + availH + 'px';

  // Куда встаёт описание на десктопе: рядом с самим кадром, а не с краем
  // квадрата. Координаты относительно панели, потому что позиционируется оно
  // внутри неё — почему не fixed, написано в style.css.
  const shownW = size * Math.min(ratio, 1);
  const shownH = size / Math.max(ratio, 1);
  el.detail.style.setProperty('--note-left', (centerX + shownW / 2 + NOTE_GAP).toFixed(2) + 'px');
  el.detail.style.setProperty(
    '--note-top',
    (centerY - shownH / 2 - (top + availH)).toFixed(2) + 'px'
  );
  el.detail.style.setProperty('--note-w', NOTE_W + 'px');
  el.detail.style.setProperty('--note-h', shownH.toFixed(2) + 'px');
}

export function openDetail(code: string, tile: HTMLElement): void {
  const p = PRODUCTS.find((x) => x.code === code);
  const square = tile.querySelector('.square');
  if (!p || !square) return;

  window.clearTimeout(state.resetOriginTimer);
  state.openCode = code;
  state.activeTile = tile;

  fillDetail(p);
  // до замера высоты: у изделия с одним кадром управления слайдером нет, и
  // место под него отводить не нужно
  mountGallery(tile, p);

  const sr = square.getBoundingClientRect();
  const gr = el.grid.getBoundingClientRect();
  base = { cx: sr.left + sr.width / 2, cy: sr.top + sr.height / 2, w: sr.width };

  // масштабируем вокруг центра нажатого фото
  el.grid.style.transformOrigin =
    (base.cx - gr.left).toFixed(2) + 'px ' + (base.cy - gr.top).toFixed(2) + 'px';

  layoutDetail(forViewport(OPEN_MS));
  setBackBtn();
}
