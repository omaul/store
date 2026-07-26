// Здесь правится всё содержимое сайта. Поля и категории описаны в types.ts,
// export перед каждым списком нужно оставить на месте.
//
// Внимание для форков: MIT из LICENSE распространяется на код, но не на тексты
// в этом файле — они под LICENSE-CONTENT, все права защищены. Забирайте
// структуру, содержимое замените своим.

import type { Contact, Filter, InfoPage, Product } from './types';

// Куда ведёт кнопка «написать» (иконка справа вверху и кнопка в карточке).
export const CONTACT: Contact = {
  // ↓ подставь свой телеграм; если его нет — оставь пустую строку и заполни email
  telegram: 'https://t.me/username',
  email: 'mail@example.com',
};

// Фильтры в шапке. id из cats у изделий, 'all' — показать всё.
export const FILTERS: Filter[] = [
  { id: 'all', label: 'ВСЁ' },
  { id: 'new', label: 'НОВОЕ' },
  { id: 'signet', label: 'ПЕЧАТКИ' },
  { id: 'band', label: 'ОБОДКИ' },
  { id: 'stone', label: 'С КАМНЕМ' },
];

// Изделия. Порядок в массиве = порядок в сетке.
// Фото кладём в public/assets/rings/ и указываем путь без public.
export const PRODUCTS: Product[] = [
  {
    code: 'BR-01', name: 'ПЕЧАТКА ОВАЛЬНАЯ', cats: ['new', 'signet'],
    img: 'assets/rings/r-01.svg',
    material: 'ЛАТУНЬ, ПОЛИРОВКА', sizes: '16—21', price: null,
    note: 'Литьё по выплавляемой модели, ручная доводка.',
  },
  {
    code: 'BR-02', name: 'ОБОДОК ГЛАДКИЙ', cats: ['new', 'band'],
    img: 'assets/rings/r-02.svg',
    material: 'ЛАТУНЬ', sizes: '15—22', price: null,
  },
  {
    code: 'BR-03', name: 'ЖГУТ', cats: ['band'],
    img: 'assets/rings/r-03.svg',
    material: 'ЛАТУНЬ', sizes: '16—21', price: null,
    note: 'Витая шина, кручение вручную.',
  },
  {
    code: 'BR-04', name: 'КОВАНЫЙ', cats: ['new', 'band'],
    img: 'assets/rings/r-04.svg',
    material: 'ЛАТУНЬ, ФАКТУРА МОЛОТКА', sizes: '16—22', price: null,
  },
  {
    code: 'BR-05', name: 'С КАМНЕМ', cats: ['stone'],
    img: 'assets/rings/r-05.svg',
    material: 'ЛАТУНЬ, ТОПАЗ', sizes: '16—19', price: null,
  },
  {
    code: 'BR-06', name: 'ТОНКИЙ', cats: ['band'],
    img: 'assets/rings/r-06.svg',
    material: 'ЛАТУНЬ', sizes: '15—20', price: null,
  },
  {
    code: 'BR-07', name: 'ШИРОКИЙ', cats: ['band'],
    img: 'assets/rings/r-07.svg',
    material: 'ЛАТУНЬ', sizes: '17—22', price: null,
  },
  {
    code: 'BR-08', name: 'ДВОЙНОЙ', cats: ['new', 'band'],
    img: 'assets/rings/r-08.svg',
    material: 'ЛАТУНЬ', sizes: '16—21', price: null,
  },
  {
    code: 'BR-09', name: 'ПЕЧАТКА С ГРАВИРОВКОЙ', cats: ['signet'],
    img: 'assets/rings/r-09.svg',
    material: 'ЛАТУНЬ, РУЧНАЯ ГРАВИРОВКА', sizes: '17—22', price: null,
    note: 'Рисунок обсуждается отдельно.',
  },
  {
    code: 'BR-10', name: 'ГРАНЁНЫЙ', cats: ['band'],
    img: 'assets/rings/r-10.svg',
    material: 'ЛАТУНЬ', sizes: '16—21', price: null,
  },
  {
    code: 'BR-11', name: 'РАЗОМКНУТЫЙ', cats: ['new', 'band'],
    img: 'assets/rings/r-11.svg',
    material: 'ЛАТУНЬ', sizes: 'БЕЗРАЗМЕРНОЕ', price: null,
  },
  {
    code: 'BR-12', name: 'КУПОЛ', cats: ['signet'],
    img: 'assets/rings/r-12.svg',
    material: 'ЛАТУНЬ', sizes: '17—22', price: null,
  },
];

// Тексты страниц из футера. Ключи совпадают с data-info у ссылок в index.html.
export const INFO = {
  about: {
    title: 'О МАСТЕРСКОЙ',
    text: 'Кольца делаю сам, вручную, небольшими партиями. Каждое изделие немного отличается от предыдущего — это латунь, а не штамповка.',
  },
  care: {
    title: 'УХОД ЗА ЛАТУНЬЮ',
    text: 'Латунь со временем темнеет — это нормально и обратимо. Достаточно протереть кольцо мягкой тканью с полиролью или содой с лимонным соком, и блеск вернётся. Снимайте кольцо перед контактом с бытовой химией.',
  },
  sizes: {
    title: 'РАЗМЕРЫ',
    text: 'Размер — это внутренний диаметр кольца в миллиметрах. Измерьте кольцо, которое вам подходит, изнутри, либо оберните палец полоской бумаги и разделите длину на 3,14. Если сомневаетесь — напишите, подберём вместе.',
  },
  delivery: {
    title: 'ДОСТАВКА',
    text: 'Отправляю почтой и СДЭК по России. Срок изготовления под заказ — от одной недели. Готовые изделия отправляю в течение пары дней после оплаты.',
  },
  rights: {
    title: 'ПРАВА НА КОНТЕНТ',
    text: 'Фотографии, тексты и дизайн изделий на этом сайте — мои. Их нельзя копировать и перепубликовывать, использовать в рекламе, в оформлении товаров на продажу или для обучения моделей машинного обучения без моего письменного разрешения. Это касается и самих моделей колец: форма и отделка тоже авторские. Если хочется где-то использовать снимок или упомянуть мастерскую — напишите, обычно я не против. Правообладатель — Иван Баширов, мастерская BRASS. Код сайта открыт под лицензией MIT, на контент она не распространяется.',
  },
} satisfies Record<string, InfoPage>;

export type InfoKey = keyof typeof INFO;
