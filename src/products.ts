// Здесь правится всё содержимое сайта. Поля и категории описаны в types.ts,
// export перед каждым списком нужно оставить на месте.
//
// Тексты проведены через типограф: после коротких предлогов и перед тире стоят
// неразрывные пробелы — их не видно, но при правке нужно сохранять.
//
// Внимание для форков: MIT из LICENSE распространяется на код, но не на тексты
// в этом файле — они под LICENSE-CONTENT, все права защищены. Забирайте
// структуру, содержимое замените своим.

import type { Contact, Filter, InfoPage, Product } from './types';

// Куда ведёт кнопка «написать» (иконка справа вверху и кнопка в карточке).
// Телеграм приоритетнее почты: пока он заполнен, email не используется.
export const CONTACT: Contact = {
  telegram: 'https://t.me/raya_draga',
  email: '',
};

// Фильтры в шапке. id из cats у изделий, 'all' — показать всё.
// НОВОЕ и С КАМНЕМ закомментированы: пока ни у кого нет таких cats, а фильтр с
// пустой сеткой выглядит поломкой. Раскомментируй, когда будет что показать.
export const FILTERS: Filter[] = [
  { id: 'all', label: 'ВСЁ' },
  // { id: 'new', label: 'НОВОЕ' },
  { id: 'signet', label: 'ПЕЧАТКИ' },
  { id: 'band', label: 'ОБОДКИ' },
  { id: 'figure', label: 'ФИГУРНЫЕ' },
  { id: 'pendant', label: 'КУЛОНЫ' },
  { id: 'cuff', label: 'КАФЫ' },
  // { id: 'stone', label: 'С КАМНЕМ' },
];

// Изделия. Порядок в массиве = порядок в сетке.
//
// Фото лежат в public/assets/items/<изделие>/, путь пишется без public. Первый
// кадр из photos стоит в сетке, остальные листаются стрелками в карточке —
// порядок задаётся здесь, а не именами файлов.
//
// sizes и note оставлены пустыми строками: это места под текст, пустое поле на
// сайт не выводится совсем. Выдуманного здесь быть не должно, поэтому лучше
// пустая строка, чем правдоподобная.
export const PRODUCTS: Product[] = [
  {
    code: 'BR-01', name: 'АБСТРАКЦИЯ', cats: ['band'],
    photos: [
      'assets/items/abstraktsiya/abstraktsiya-front.jpg',
      'assets/items/abstraktsiya/abstraktsiya-side.jpg',
    ],
    material: 'ЛАТУНЬ', sizes: '', price: null,
    note: '',
  },
  {
    code: 'BR-02', name: 'ГАЕЧКА', cats: ['band'],
    photos: ['assets/items/gaechka/gaechka-top.jpg'],
    material: 'ЛАТУНЬ', sizes: '', price: null,
    note: '',
  },
  {
    // draga-pendant.jpg лежит в папке, но не в слайдере: это версия-кулон,
    // отдельное изделие, если решишь его выставить
    code: 'BR-03', name: 'ДРАГА', cats: ['band'],
    photos: [
      'assets/items/draga/draga-front.jpg',
      'assets/items/draga/draga-top.jpg',
      'assets/items/draga/draga-sketch.jpg',
    ],
    material: 'ЛАТУНЬ', sizes: '', price: null,
    note: '',
  },
  {
    code: 'BR-04', name: 'ЗВЕЗДА', cats: ['figure'],
    photos: ['assets/items/zvezda/zvezda-front.jpg'],
    material: 'ЛАТУНЬ', sizes: '', price: null,
    note: '',
  },
  {
    code: 'BR-05', name: 'ЗВЁЗДОЧКА', cats: ['pendant'],
    photos: [
      'assets/items/zvezdochka/zvezdochka-chain.jpg',
      'assets/items/zvezdochka/zvezdochka-worn.jpg',
      'assets/items/zvezdochka/zvezdochka-hand.jpg',
    ],
    material: 'ЛАТУНЬ', sizes: '', price: null,
    note: '',
  },
  {
    code: 'BR-06', name: 'ЗИГЗАГ', cats: ['band'],
    photos: [
      'assets/items/zigzag/zigzag-angle.jpg',
      'assets/items/zigzag/zigzag-front.jpg',
    ],
    material: 'ЛАТУНЬ', sizes: '', price: null,
    note: '',
  },
  {
    code: 'BR-07', name: 'КАФ', cats: ['cuff'],
    photos: ['assets/items/kaf/kaf-front.jpg'],
    material: 'ЛАТУНЬ', sizes: '', price: null,
    note: '',
  },
  {
    code: 'BR-08', name: 'КВАДРАТЫ', cats: ['signet'],
    photos: [
      'assets/items/kvadraty/kvadraty-row.jpg',
      'assets/items/kvadraty/kvadraty-top.jpg',
      'assets/items/kvadraty/kvadraty-top-2.jpg',
    ],
    material: 'ЛАТУНЬ', sizes: '', price: null,
    note: '',
  },
  {
    code: 'BR-09', name: 'КОЖА', cats: ['band'],
    photos: ['assets/items/kozha/kozha-front.jpg'],
    material: 'ЛАТУНЬ', sizes: '', price: null,
    note: '',
  },
  {
    code: 'BR-10', name: 'РОЗА', cats: ['figure'],
    photos: [
      'assets/items/roza/roza-front.jpg',
      'assets/items/roza/roza-side.jpg',
      'assets/items/roza/roza-malachite.jpg',
      'assets/items/roza/roza-wax.jpg', // восковая модель до литья
    ],
    material: 'ЛАТУНЬ', sizes: '', price: null,
    note: '',
  },
  {
    code: 'BR-11', name: 'СЕРДЦЕ', cats: ['band'],
    photos: [
      'assets/items/serdce/serdce-front.jpg',
      'assets/items/serdce/serdce-set.jpg',
    ],
    material: 'ЛАТУНЬ', sizes: '', price: null,
    note: '',
  },
  {
    code: 'BR-12', name: 'СНЕЖИНКА', cats: ['figure'],
    photos: ['assets/items/snezhinka/snezhinka-pair.jpg'],
    material: 'ЛАТУНЬ', sizes: '', price: null,
    note: '',
  },
  {
    code: 'BR-13', name: 'СОЛНЦЕ', cats: ['figure'],
    photos: ['assets/items/solnce/solnce-worn.jpg'],
    material: 'ЛАТУНЬ', sizes: '', price: null,
    note: '',
  },
  {
    code: 'BR-14', name: 'УШНОЙ КАФ', cats: ['cuff'],
    photos: [
      'assets/items/ushnoy-kaf/ushnoy-kaf-ear.jpg',
      'assets/items/ushnoy-kaf/ushnoy-kaf-hand.jpg',
    ],
    material: 'ЛАТУНЬ', sizes: '', price: null,
    note: '',
  },
];

// Кадры из папки «комната» и раскладки по нескольку изделий сразу лежат в
// assets/items/lookbook/ — отдельного изделия на них нет, поэтому в сетку и в
// слайдеры они не идут. Ждут страницы или обложки.

// Тексты страниц из футера. Ключи совпадают с data-info у ссылок в index.html.
// Пустой массив — заготовка: ссылки на такие страницы в футере закомментированы,
// пока не появится настоящий текст. Выдуманного на сайте быть не должно.
export const INFO = {
  about: {
    title: 'ОБ АВТОРЕ',
    text: [],
  },
  care: {
    title: 'УХОД ЗА ЛАТУНЬЮ',
    text: [
      'Латунь со временем темнеет — это нормально и обратимо. Достаточно протереть украшение мягкой тканью с полиролью или содой с лимонным соком, и блеск вернётся. Снимайте украшения перед контактом с бытовой химией.',
    ],
  },
  sizes: {
    title: 'РАЗМЕРЫ',
    text: [],
  },
  delivery: {
    title: 'ДОСТАВКА',
    text: [],
  },
  rights: {
    title: 'ПРАВА НА КОНТЕНТ',
    text: [
      'Фотографии, тексты и дизайн изделий на этом сайте — мои. Их нельзя копировать и перепубликовывать, использовать в рекламе, в оформлении товаров на продажу или для обучения моделей машинного обучения без моего письменного разрешения. Это касается и самих моделей: форма и отделка тоже авторские.',
      'Если хочется где-то использовать снимок или упомянуть меня — напишите, обычно я не против.',
      'Правообладатель — Рая Драга. Код сайта открыт под лицензией MIT, на контент она не распространяется.',
    ],
  },
} satisfies Record<string, InfoPage>;

export type InfoKey = keyof typeof INFO;
