import { el } from './dom';
import { state, forViewport } from './state';
import { resetGallery } from './gallery';

const CLOSE_MS = { mobile: 100, desktop: 300 };

// Кнопка слева вверху нужна только чтобы закрыть открытое, поэтому в остальное
// время её не видно. Вызывают detail.ts и info.ts после открытия панели.
export function setBackBtn(): void {
  const open = Boolean(state.openCode || state.openInfo);
  el.backBtn.dataset.state = open ? 'back' : 'menu';
}

// Отъезд камеры и скрытие открытой панели, общий для карточки и info.
export function closePanels(): boolean {
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

  // origin и кадр слайдера возвращаем только после отъезда, иначе сетку дёрнет,
  // а подмена кадра на лид будет видна в анимации
  window.clearTimeout(state.resetOriginTimer);
  state.resetOriginTimer = window.setTimeout(() => {
    if (state.openCode) return;
    el.grid.style.transformOrigin = '50% 50%';
    resetGallery();
  }, closeMs);

  el.scroll.style.overflowY = '';
  setBackBtn();
  return true;
}
