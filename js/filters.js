// Категории в шапке. Активная — чёрная, остальные приглушены.

import { FILTERS } from './products.js';
import { el } from './dom.js';
import { state } from './state.js';
import { renderGrid } from './grid.js';
import { closePanels } from './panels.js';

export function renderFilters() {
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

export function setFilter(id) {
  if (state.filter === id) return;

  // сетку под открытой карточкой менять нельзя — сначала отъезжаем
  closePanels();
  state.filter = id;

  for (const b of el.filters.children) {
    b.setAttribute('aria-pressed', String(b.dataset.id === id));
  }

  renderGrid();
}
