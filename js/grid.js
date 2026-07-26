// Сборка сетки изделий под текущий фильтр.

import { PRODUCTS } from './products.js';
import { el } from './dom.js';
import { state } from './state.js';

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

export function renderGrid() {
  el.grid.replaceChildren(...visibleProducts().map(createTile));
}
