import { CONTACT } from './products';
import type { Product } from './types';

// Телеграм приоритетнее почты. С товаром письмо уходит с заполненной темой.
export function contactHref(product: Product | null): string {
  if (CONTACT.telegram) return CONTACT.telegram;
  if (!CONTACT.email) return '#';

  const subject = product
    ? '?subject=' + encodeURIComponent(product.code + ' ' + product.name)
    : '';
  return 'mailto:' + CONTACT.email + subject;
}
