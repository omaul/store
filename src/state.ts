import type { FilterId } from './types';

export const MOBILE_Q = window.matchMedia('(max-width: 768px)');

interface State {
  isMobile: boolean;
  filter: FilterId;
  openCode: string | null;
  openInfo: string | null;
  activeTile: HTMLElement | null;
  resetOriginTimer: number;
}

export const state: State = {
  isMobile: MOBILE_Q.matches,
  filter: 'all',
  openCode: null,
  openInfo: null,
  activeTile: null,
  resetOriginTimer: 0,
};

export function forViewport<T>(pair: { mobile: T; desktop: T }): T {
  return state.isMobile ? pair.mobile : pair.desktop;
}
