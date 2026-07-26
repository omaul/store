// Возврат к сетке: отъезд камеры и скрытие открытой панели.
// Общий для карточки изделия и текстовых страниц из футера.

import { el } from './dom.js';
import { state, forViewport } from './state.js';
import { setZoomIcon } from './zoom.js';

const CLOSE_MS = { mobile: 100, desktop: 300 };

// Возвращает true, если что-то действительно было открыто, —
// по этому признаку кнопка в шапке решает, закрывать или менять масштаб.
export function closePanels() {
  if (!state.openCode && !state.openInfo) return false;

  state.openCode = null;
  state.openInfo = null;

  el.detail.setAttribute('aria-hidden', 'true');
  el.info.setAttribute('aria-hidden', 'true');

  const closeMs = forViewport(CLOSE_MS);
  el.grid.style.setProperty('--duration', closeMs + 'ms');
  el.grid.style.setProperty('--scale', '1');
  el.grid.style.setProperty('--tx', '0px');
  el.grid.style.setProperty('--ty', '0px');
  el.grid.style.setProperty('--opacity', '1');
  el.grid.classList.remove('is-open');

  if (state.activeTile) {
    state.activeTile.classList.remove('is-active');
    state.activeTile = null;
  }

  // origin возвращаем в центр только после отъезда, иначе сетку дёрнет
  clearTimeout(state.resetOriginTimer);
  state.resetOriginTimer = setTimeout(() => {
    if (!state.openCode) el.grid.style.transformOrigin = '50% 50%';
  }, closeMs);

  el.scroll.style.overflowY = '';
  setZoomIcon();
  return true;
}
