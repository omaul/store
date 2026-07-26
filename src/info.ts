import { INFO } from './products';
import { el } from './dom';
import { state } from './state';
import { setZoomIcon } from './zoom';
import type { InfoKey } from './products';

// ключ приходит из data-info в разметке, поэтому сверяем со списком страниц
function isInfoKey(key: string): key is InfoKey {
  return key in INFO;
}

export function openInfo(key: string): void {
  if (!isInfoKey(key)) return;
  const data = INFO[key];

  state.openInfo = key;
  el.infoTitle.textContent = data.title;
  el.infoText.textContent = data.text;

  el.info.setAttribute('aria-hidden', 'false');
  el.scroll.style.overflowY = 'hidden';
  setZoomIcon();
}
