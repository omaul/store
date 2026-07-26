import { PRODUCTS } from './products';
import { el } from './dom';
import { state, forViewport } from './state';
import type { Product } from './types';

// Сколько плиток в первом ряду — должно совпадать с --col-count в style.css.
// Эти фото грузим eager, их же ждёт boot.ts перед показом первого экрана.
const FIRST_ROW = { mobile: 3, desktop: 6 };

function visibleProducts(): Product[] {
  const filter = state.filter;
  if (filter === 'all') return PRODUCTS;
  return PRODUCTS.filter((p) => p.cats.includes(filter));
}

function createTile(p: Product, i: number): HTMLButtonElement {
  const img = document.createElement('img');
  // в сетке всегда первый кадр; остальные добавит слайдер при открытии
  img.src = p.photos[0];
  // alt пустой намеренно: код изделия уже произносится из aria-label кнопки и
  // подписи под фото, иначе скринридер читает его трижды
  img.alt = '';
  // lazy над сгибом только задерживает первый экран, поэтому первый ряд грузим
  // сразу и в приоритете, а lazy оставляем тем, до кого ещё нужно доскроллить
  const eager = i < forViewport(FIRST_ROW);
  img.loading = eager ? 'eager' : 'lazy';
  if (eager) img.fetchPriority = 'high';
  img.decoding = 'async';

  // Кадр проявляется, когда готов: иначе плитки хлопают по одной, а при смене
  // фильтра новые фото возникают поверх старой раскладки. Уже закешированные
  // (img.complete) показываем сразу, без лишнего перехода.
  if (!img.complete) {
    img.classList.add('is-blank');
    const show = (): void => img.classList.remove('is-blank');
    img.addEventListener('load', show, { once: true });
    img.addEventListener('error', show, { once: true });
  }

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

export function renderGrid(): void {
  el.grid.replaceChildren(...visibleProducts().map(createTile));
}
