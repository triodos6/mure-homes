/**
 * Safely extract a localized product name on the client side.
 * Relies on the `translations` object which should be embedded in the product.
 * If translations are missing, it falls back to the base name.
 */
export function getLocalizedCartItemName(item, locale) {
  if (!item) return '';
  if (locale === 'es') return item.name; // Spanish is the base language
  
  // Try to use embedded translations object
  if (item.translations && item.translations[locale]) {
    const t = item.translations[locale];
    if (t.name) return t.name;
  }
  
  // Fallback to base name
  return item.name;
}

export function getLocalizedCartItemDescription(item, locale) {
  if (!item) return '';
  if (locale === 'es') return item.description || '';
  
  if (item.translations && item.translations[locale]) {
    const t = item.translations[locale];
    if (t.description) return t.description;
  }
  
  return item.description || '';
}
