// Что сейчас на экране: масштаб, фильтр, открытая панель.
// Состояние правят напрямую, перерисовку вызывает тот, кто его менял, —
// на такой размер сайта этого достаточно.

export const MOBILE_Q = window.matchMedia('(max-width: 768px)');

// Варианты числа колонок: индекс 0 — самый мелкий масштаб.
export const ZOOM = { mobile: [3, 2, 1], desktop: [6, 3] };

export const state = {
  isMobile: MOBILE_Q.matches,
  levels: MOBILE_Q.matches ? ZOOM.mobile : ZOOM.desktop,
  index: 0,
  direction: 1, // 1 — следующий клик приближает, -1 — отдаляет
  filter: 'all',
  openCode: null,
  openInfo: null,
  activeTile: null,
  resetOriginTimer: 0,
};

// значение из пары { mobile, desktop } под текущую ширину экрана
export function forViewport(pair) {
  return state.isMobile ? pair.mobile : pair.desktop;
}
