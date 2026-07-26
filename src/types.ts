// Формы данных из products.ts. Категории перечислены списком, поэтому
// опечатка в cats или в id фильтра — ошибка компиляции, а не пустая сетка.

export type Category =
  | 'new'
  | 'signet' // печатки: плоская площадка сверху
  | 'band' // ободки: шина без надстройки
  | 'figure' // фигурные: звезда, снежинка, солнце, роза
  | 'stone'
  | 'pendant'
  | 'cuff'; // кафы, на палец и на ухо

export type FilterId = 'all' | Category;

export interface Filter {
  id: FilterId;
  label: string;
}

export interface Product {
  code: string; // подпись под фото в сетке
  name: string; // название в карточке
  cats: Category[];
  // Кадры изделия, пути от корня сайта: assets/items/…
  // Тип — непустой массив: первый кадр стоит в сетке, поэтому изделие без фото
  // должно быть ошибкой компиляции, а не пустым тайлом. Остальные кадры
  // листаются слайдером в открытой карточке.
  photos: [string, ...string[]];
  material?: string;
  sizes?: string;
  price: number | null; // null → «ЦЕНА ПО ЗАПРОСУ»
  note?: string;
}

export interface InfoPage {
  title: string;
  text: readonly string[];
}

export interface Contact {
  telegram: string;
  email: string;
}
