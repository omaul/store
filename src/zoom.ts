import { el } from './dom';
import { state, ZOOM } from './state';

export function applyZoom(): void {
  const cols = state.levels[state.index];
  el.grid.style.setProperty('--col-count', String(cols));
  el.grid.classList.toggle('single-col', cols === 1);
}

// Кнопка слева вверху служит и зумом, и «назад»: шеврон показываем, когда
// что-то открыто или дальше приближать уже некуда.
export function setZoomIcon(): void {
  const atMax = state.index === state.levels.length - 1;
  const back = Boolean(state.openCode || state.openInfo) || atMax;
  el.zoomBtn.dataset.state = back ? 'back' : 'menu';
}

// Ходим по уровням туда-обратно: доехав до края, разворачиваемся.
export function stepZoom(): void {
  const next = state.index + state.direction;

  if (next < 0 || next > state.levels.length - 1) return;
  state.index = next;

  if (state.index === state.levels.length - 1) state.direction = -1;
  if (state.index === 0) state.direction = 1;

  applyZoom();
  setZoomIcon();
}

// Наборы масштабов у телефона и десктопа разные — начинаем с самого мелкого.
export function syncViewport(isMobile: boolean): void {
  if (isMobile === state.isMobile) return;

  state.isMobile = isMobile;
  state.levels = isMobile ? ZOOM.mobile : ZOOM.desktop;
  state.index = 0;
  state.direction = 1;

  applyZoom();
  setZoomIcon();
}
