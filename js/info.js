// Текстовые страницы из футера: «о мастерской», «уход», «размеры», «доставка».

import { INFO } from './products.js';
import { el } from './dom.js';
import { state } from './state.js';
import { setZoomIcon } from './zoom.js';

export function openInfo(key) {
  const data = INFO[key];
  if (!data) return;

  state.openInfo = key;
  el.infoTitle.textContent = data.title;
  el.infoText.textContent = data.text;

  el.info.setAttribute('aria-hidden', 'false');
  el.scroll.style.overflowY = 'hidden';
  setZoomIcon();
}
