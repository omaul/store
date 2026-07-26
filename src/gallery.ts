// Слайдер внутри открытого изделия. Отдельной картинки в карточке нет — растёт
// тот же тайл из сетки (см. detail.ts), поэтому кадры кладём в него же: лид
// лежит там с первой отрисовки, остальные добавляем поверх при первом открытии
// и переключаем прозрачностью. Так фото не перерисовывается и не мигает.
//
// Управление живёт в панели описания, а не поверх фото: клик по сетке при
// открытом изделии закрывает карточку (main.ts), кнопки поверх снимка ловили бы
// этот клик на себя.

import { el } from './dom';
import { state } from './state';
import type { Product } from './types';

const SWIPE_PX = 30; // короче — уже случайное дёрганье пальцем, а не листание

let square: HTMLElement | null = null;
let frames: HTMLImageElement[] = [];
let index = 0;
let startX = 0;
let startY = 0;
let tracking = false;
let swiped = false;

function paint(): void {
  frames.forEach((frame, i) => frame.classList.toggle('is-hidden', i !== index));
  el.galleryCount.textContent = index + 1 + '/' + frames.length;
}

export function showFrame(step: number): void {
  if (frames.length < 2) return;
  index = (index + step + frames.length) % frames.length;
  paint();
}

export function mountGallery(tile: HTMLElement, p: Product): void {
  square = tile.querySelector('.square');
  if (!square) return;

  frames = Array.from(square.querySelectorAll('img'));
  // при повторном открытии кадры уже на месте, slice даёт пустой список
  for (const src of p.photos.slice(frames.length)) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.decoding = 'async';
    img.className = 'is-hidden';
    square.append(img);
    frames.push(img);
  }

  index = 0;
  paint();
  el.gallery.hidden = frames.length < 2;
}

// Вызывается после отъезда карточки: сбрось раньше — и подмена кадра на лид
// будет видна прямо во время анимации. Счётчик здесь не трогаем: панель уже
// скрыта, а запись в aria-live доложила бы скринридеру о закрытой карточке.
export function resetGallery(): void {
  frames.forEach((frame, i) => frame.classList.toggle('is-hidden', i !== 0));
  index = 0;
  square = null;
  frames = [];
}

// Свайп по фото. Ответ забирает main.ts, чтобы клик, которым заканчивается
// свайп, не закрыл карточку.
export function consumeSwipe(): boolean {
  const was = swiped;
  swiped = false;
  return was;
}

export function initGallery(): void {
  el.galleryPrev.addEventListener('click', () => showFrame(-1));
  el.galleryNext.addEventListener('click', () => showFrame(1));

  el.grid.addEventListener('pointerdown', (e) => {
    if (!state.openCode || frames.length < 2) return;
    tracking = true;
    swiped = false;
    startX = e.clientX;
    startY = e.clientY;
  });

  el.grid.addEventListener('pointerup', (e) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.clientX - startX;
    // движение по вертикали больше горизонтального — это не листание
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) <= Math.abs(e.clientY - startY)) return;
    swiped = true;
    showFrame(dx < 0 ? 1 : -1);
  });

  el.grid.addEventListener('pointercancel', () => {
    tracking = false;
  });
}
