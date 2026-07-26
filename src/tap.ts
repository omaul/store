// Тап, а не конец жеста. Палец всегда немного сдвигается, а свайп по слайдеру и
// протяжка текста заканчиваются тем же click, что и обычное нажатие: без этой
// проверки любое такое движение закрывает открытое.

const SLOP = 10; // меньше — это дрожание пальца, а не движение

let downX = 0;
let downY = 0;

export function initTap(): void {
  document.addEventListener('pointerdown', (e) => {
    downX = e.clientX;
    downY = e.clientY;
  });
}

export function isTap(e: MouseEvent): boolean {
  // detail === 0 — нажатие с клавиатуры, координат у него нет
  if (e.detail === 0) return true;
  return Math.abs(e.clientX - downX) <= SLOP && Math.abs(e.clientY - downY) <= SLOP;
}
