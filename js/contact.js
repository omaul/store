// Куда ведут все кнопки «написать»: иконка в шапке, ссылка в футере
// и кнопка в карточке изделия. Телеграм приоритетнее почты.

import { CONTACT } from './products.js';

export function contactHref(product) {
  if (CONTACT.telegram) return CONTACT.telegram;
  if (!CONTACT.email) return '#';

  // из карточки уходим с заполненной темой письма
  const subject = product
    ? '?subject=' + encodeURIComponent(product.code + ' ' + product.name)
    : '';
  return 'mailto:' + CONTACT.email + subject;
}
