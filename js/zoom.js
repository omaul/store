// Кнопка слева вверху: переключает число колонок, а на максимальном
// приближении превращается в шеврон «назад».

import { el } from './dom.js';
import { state, ZOOM } from './state.js';

export function applyZoom() {
  const cols = state.levels[state.index];
  el.grid.style.setProperty('--col-count', cols);
  el.grid.classList.toggle('single-col', cols === 1);
}

export function setZoomIcon() {
  const atMax = state.index === state.levels.length - 1;
  const back = Boolean(state.openCode || state.openInfo) || atMax;
  el.zoomBtn.dataset.state = back ? 'back' : 'menu';
}

// Ходим по уровням туда-обратно: доехав до края, разворачиваемся.
export function stepZoom() {
  const next = state.index + state.direction;

  if (next < 0 || next > state.levels.length - 1) return;
  state.index = next;

  if (state.index === state.levels.length - 1) state.direction = -1;
  if (state.index === 0) state.direction = 1;

  applyZoom();
  setZoomIcon();
}

// На телефоне и десктопе наборы масштабов разные, поэтому при смене
// ширины экрана начинаем заново с самого мелкого.
export function syncViewport(isMobile) {
  if (isMobile === state.isMobile) return;

  state.isMobile = isMobile;
  state.levels = isMobile ? ZOOM.mobile : ZOOM.desktop;
  state.index = 0;
  state.direction = 1;

  applyZoom();
  setZoomIcon();
}
