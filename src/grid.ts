import { PRODUCTS } from './products';
import { el } from './dom';
import { state } from './state';
import type { Product } from './types';

function visibleProducts(): Product[] {
  const filter = state.filter;
  if (filter === 'all') return PRODUCTS;
  return PRODUCTS.filter((p) => p.cats.includes(filter));
}

function createTile(p: Product): HTMLButtonElement {
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

export function renderGrid(): void {
  el.grid.replaceChildren(...visibleProducts().map(createTile));
}
