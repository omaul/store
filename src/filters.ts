import { FILTERS } from './products';
import { el } from './dom';
import { state } from './state';
import { renderGrid } from './grid';
import { closePanels } from './panels';
import type { FilterId } from './types';

// id приходит из data-id в разметке, поэтому сверяем со списком фильтров
function isFilterId(id: string): id is FilterId {
  return FILTERS.some((f) => f.id === id);
}

export function renderFilters(): void {
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

export function setFilter(id: string): void {
  if (state.filter === id || !isFilterId(id)) return;

  // сетку под открытой карточкой менять нельзя — сначала отъезжаем
  closePanels();
  state.filter = id;

  for (const b of el.filters.querySelectorAll<HTMLButtonElement>('.filter-btn')) {
    b.setAttribute('aria-pressed', String(b.dataset.id === id));
  }

  renderGrid();
}
