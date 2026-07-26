// Все ссылки на разметку. need/needIn падают с понятной ошибкой, если
// элемента нет: иначе пришлось бы проверять на null в каждой строчке.

function need<T extends HTMLElement = HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`В index.html нет элемента #${id}`);
  return node as T;
}

function needIn<T extends HTMLElement = HTMLElement>(selector: string): T {
  const node = document.querySelector<T>(selector);
  if (!node) throw new Error(`В index.html нет элемента ${selector}`);
  return node;
}

export const el = {
  nav: need('nav'),
  backBtn: need<HTMLButtonElement>('back-btn'),
  filters: need('filters'),
  scroll: needIn('.scroll-area'),
  grid: need('grid'),
  footer: needIn('.footer'),
  contactBtn: need<HTMLAnchorElement>('contact-btn'),
  footerContact: need<HTMLAnchorElement>('footer-contact'),
  detail: need('detail'),
  detailCode: need('detail-code'),
  detailName: need('detail-name'),
  detailSpecs: need('detail-specs'),
  detailNote: need('detail-note'),
  detailPrice: need('detail-price'),
  detailCta: need<HTMLAnchorElement>('detail-cta'),
  info: need('info'),
  infoTitle: need('info-title'),
  infoText: need('info-text'),
};
