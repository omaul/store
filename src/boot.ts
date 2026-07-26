// Первый экран показываем целиком или не показываем вовсе. До этого момента main
// скрыт правилом html.is-booting из index.html, иначе видно две вещи: как
// подписи перескакивают с системного моно на IBM Plex Mono и как плитки первого
// ряда хлопают по одной.
//
// Ждём только шрифт и фото первого ряда (те, что grid.ts помечает eager).
// Остальные ряды проявляются по мере загрузки уже на видимой странице, первый
// экран их не ждёт — иначе показа пришлось бы ждать всю сетку.

import { el } from './dom';

// Страховка: битое, очень тяжёлое или недоступное фото не должно держать сайт
// пустым. Лучше показать неполный первый экран, чем белый лист.
const TIMEOUT_MS = 3000;

// Начертание запрашиваем сами: document.fonts.ready знает только про уже
// начатые загрузки и без этого может ответить «готово» до того, как шрифт вообще
// понадобился. В стилях начертание одно, 400 — если появятся другие, добавь сюда.
const FONT = '400 1rem "IBM Plex Mono"';

function settled(img: HTMLImageElement): Promise<void> {
  if (img.complete) return Promise.resolve();
  return new Promise((resolve) => {
    // error тоже разблокирует: ждать нечего, кадр всё равно не появится
    img.addEventListener('load', () => resolve(), { once: true });
    img.addEventListener('error', () => resolve(), { once: true });
  });
}

export function revealWhenReady(): void {
  const first = el.grid.querySelectorAll<HTMLImageElement>('img[loading="eager"]');

  const font = document.fonts
    .load(FONT)
    .then(() => document.fonts.ready)
    // шрифт не приехал — покажем на системном моно, это не повод держать белый лист
    .catch(() => undefined);

  const ready = Promise.all([font, ...Array.from(first, settled)]);

  const timeout = new Promise((resolve) => window.setTimeout(resolve, TIMEOUT_MS));

  void Promise.race([ready, timeout]).then(() => {
    document.documentElement.classList.remove('is-booting');
  });
}
