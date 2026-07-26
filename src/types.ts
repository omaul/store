// Формы данных из products.ts. Категории перечислены списком, поэтому
// опечатка в cats или в id фильтра — ошибка компиляции, а не пустая сетка.

export type Category = 'new' | 'signet' | 'band' | 'stone';

export type FilterId = 'all' | Category;

export interface Filter {
  id: FilterId;
  label: string;
}

export interface Product {
  code: string; // подпись под фото в сетке
  name: string; // название в карточке
  cats: Category[];
  img: string; // путь от корня сайта: assets/rings/…
  material?: string;
  sizes?: string;
  price: number | null; // null → «ЦЕНА ПО ЗАПРОСУ»
  note?: string;
}

export interface InfoPage {
  title: string;
  text: string;
}

export interface Contact {
  telegram: string;
  email: string;
}
