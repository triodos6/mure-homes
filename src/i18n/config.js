/**
 * MuraHomes i18n Configuration
 * Defines supported linguistic locales across entire Europe.
 */

export const DEFAULT_LOCALE = 'es';

export const SUPPORTED_LOCALES = [
  'es', // Spanish
  'en', // English
  'fr', // French
  'de', // German
  'it', // Italian
  'pt', // Portuguese
  'nl', // Dutch
  'pl', // Polish
  'sv', // Swedish
  'da', // Danish
  'no', // Norwegian
  'fi', // Finnish
  'lt', // Lithuanian
  'lv', // Latvian
  'et', // Estonian
  'cs', // Czech
  'sk', // Slovak
  'hu', // Hungarian
  'ro', // Romanian
  'bg', // Bulgarian
  'el', // Greek
  'hr', // Croatian
];

export const LOCALE_LABELS = {
  es: { name: 'Español', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  en: { name: 'Inglés', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  fr: { name: 'Francés', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  de: { name: 'Alemán', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  it: { name: 'Italiano', nativeName: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  pt: { name: 'Portugués', nativeName: 'Português', flag: '🇵🇹', dir: 'ltr' },
  nl: { name: 'Holandés', nativeName: 'Nederlands', flag: '🇳🇱', dir: 'ltr' },
  pl: { name: 'Polaco', nativeName: 'Polski', flag: '🇵🇱', dir: 'ltr' },
  sv: { name: 'Sueco', nativeName: 'Svenska', flag: '🇸🇪', dir: 'ltr' },
  da: { name: 'Danés', nativeName: 'Dansk', flag: '🇩🇰', dir: 'ltr' },
  no: { name: 'Noruego', nativeName: 'Norsk', flag: '🇳🇴', dir: 'ltr' },
  fi: { name: 'Finlandés', nativeName: 'Suomi', flag: '🇫🇮', dir: 'ltr' },
  lt: { name: 'Lituano', nativeName: 'Lietuvių', flag: '🇱🇹', dir: 'ltr' },
  lv: { name: 'Letón', nativeName: 'Latviešu', flag: '🇱🇻', dir: 'ltr' },
  et: { name: 'Estonio', nativeName: 'Eesti', flag: '🇪🇪', dir: 'ltr' },
  cs: { name: 'Checo', nativeName: 'Čeština', flag: '🇨🇿', dir: 'ltr' },
  sk: { name: 'Eslovaco', nativeName: 'Slovenčina', flag: '🇸🇰', dir: 'ltr' },
  hu: { name: 'Húngaro', nativeName: 'Magyar', flag: '🇭🇺', dir: 'ltr' },
  ro: { name: 'Rumano', nativeName: 'Română', flag: '🇷🇴', dir: 'ltr' },
  bg: { name: 'Búlgaro', nativeName: 'Български', flag: '🇧🇬', dir: 'ltr' },
  el: { name: 'Griego', nativeName: 'Ελληνικά', flag: '🇬🇷', dir: 'ltr' },
  hr: { name: 'Croata', nativeName: 'Hrvatski', flag: '🇭🇷', dir: 'ltr' },
};

export function isValidLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale);
}
