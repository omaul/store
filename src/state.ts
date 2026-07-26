import type { FilterId } from './types';

export const MOBILE_Q = window.matchMedia('(max-width: 768px)');

// Варианты числа колонок: индекс 0 — самый мелкий масштаб.
export const ZOOM = { mobile: [3, 2, 1], desktop: [6, 3] };

interface State {
  isMobile: boolean;
  levels: number[];
  index: number;
  direction: 1 | -1; // 1 — следующий клик приближает, -1 — отдаляет
  filter: FilterId;
  openCode: string | null;
  openInfo: string | null;
  activeTile: HTMLElement | null;
  resetOriginTimer: number;
}

export const state: State = {
  isMobile: MOBILE_Q.matches,
  levels: MOBILE_Q.matches ? ZOOM.mobile : ZOOM.desktop,
  index: 0,
  direction: 1,
  filter: 'all',
  openCode: null,
  openInfo: null,
  activeTile: null,
  resetOriginTimer: 0,
};

export function forViewport<T>(pair: { mobile: T; desktop: T }): T {
  return state.isMobile ? pair.mobile : pair.desktop;
}
