/**
 * Central European Market Configuration Matrix
 * Defines commercial geography, pricing currency, delivery lead times, and logistical defaults
 * for all countries across the European continent.
 */

export const COUNTRY_TO_LOCALE = {
  ES: 'es', // Spain -> Spanish
  FR: 'fr', // France -> French
  DE: 'de', // Germany -> German
  AT: 'de', // Austria -> German
  CH: 'de', // Switzerland -> German
  IT: 'it', // Italy -> Italian
  PT: 'pt', // Portugal -> Portuguese
  NL: 'nl', // Netherlands -> Dutch
  BE: 'nl', // Belgium -> Dutch / French
  PL: 'pl', // Poland -> Polish
  SE: 'sv', // Sweden -> Swedish
  DK: 'da', // Denmark -> Danish
  NO: 'no', // Norway -> Norwegian
  FI: 'fi', // Finland -> Finnish
  LT: 'lt', // Lithuania -> Lithuanian
  LV: 'lv', // Latvia -> Latvian
  EE: 'et', // Estonia -> Estonian
  CZ: 'cs', // Czech Republic -> Czech
  SK: 'sk', // Slovakia -> Slovak
  HU: 'hu', // Hungary -> Hungarian
  RO: 'ro', // Romania -> Romanian
  BG: 'bg', // Bulgaria -> Bulgarian
  GR: 'el', // Greece -> Greek
  CY: 'el', // Cyprus -> Greek
  HR: 'hr', // Croatia -> Croatian
  GB: 'en', // United Kingdom -> English
  IE: 'en', // Ireland -> English
  IS: 'en', // Iceland -> English
  LU: 'fr', // Luxembourg -> French
  MT: 'en', // Malta -> English
  SI: 'en', // Slovenia -> English
};

export const EUROPEAN_COUNTRIES = [
  { code: 'ES', name: 'España', flag: '🇪🇸', currency: 'EUR', phonePrefix: '+34', isEurozone: true },
  { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', phonePrefix: '+33', isEurozone: true },
  { code: 'DE', name: 'Deutschland', flag: '🇩🇪', currency: 'EUR', phonePrefix: '+49', isEurozone: true },
  { code: 'IT', name: 'Italia', flag: '🇮🇹', currency: 'EUR', phonePrefix: '+39', isEurozone: true },
  { code: 'LT', name: 'Lietuva', flag: '🇱🇹', currency: 'EUR', phonePrefix: '+370', isEurozone: true },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', phonePrefix: '+44', isEurozone: false },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', currency: 'EUR', phonePrefix: '+351', isEurozone: true },
  { code: 'NL', name: 'Nederland', flag: '🇳🇱', currency: 'EUR', phonePrefix: '+31', isEurozone: true },
  { code: 'BE', name: 'België / Belgique', flag: '🇧🇪', currency: 'EUR', phonePrefix: '+32', isEurozone: true },
  { code: 'AT', name: 'Österreich', flag: '🇦🇹', currency: 'EUR', phonePrefix: '+43', isEurozone: true },
  { code: 'CH', name: 'Schweiz / Suisse', flag: '🇨🇭', currency: 'CHF', phonePrefix: '+41', isEurozone: false },
  { code: 'PL', name: 'Polska', flag: '🇵🇱', currency: 'PLN', phonePrefix: '+48', isEurozone: false },
  { code: 'SE', name: 'Sverige', flag: '🇸🇪', currency: 'SEK', phonePrefix: '+46', isEurozone: false },
  { code: 'DK', name: 'Danmark', flag: '🇩🇰', currency: 'DKK', phonePrefix: '+45', isEurozone: false },
  { code: 'NO', name: 'Norge', flag: '🇳🇴', currency: 'NOK', phonePrefix: '+47', isEurozone: false },
  { code: 'FI', name: 'Suomi', flag: '🇫🇮', currency: 'EUR', phonePrefix: '+358', isEurozone: true },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', currency: 'EUR', phonePrefix: '+353', isEurozone: true },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', currency: 'EUR', phonePrefix: '+30', isEurozone: true },
  { code: 'CZ', name: 'Česká republika', flag: '🇨🇿', currency: 'CZK', phonePrefix: '+420', isEurozone: false },
  { code: 'RO', name: 'România', flag: '🇷🇴', currency: 'RON', phonePrefix: '+40', isEurozone: false },
  { code: 'HU', name: 'Magyarország', flag: '🇭🇺', currency: 'HUF', phonePrefix: '+36', isEurozone: false },
  { code: 'SK', name: 'Slovensko', flag: '🇸🇰', currency: 'EUR', phonePrefix: '+421', isEurozone: true },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', currency: 'EUR', phonePrefix: '+359', isEurozone: true },
  { code: 'HR', name: 'Hrvatska', flag: '🇭🇷', currency: 'EUR', phonePrefix: '+385', isEurozone: true },
  { code: 'EE', name: 'Eesti', flag: '🇪🇪', currency: 'EUR', phonePrefix: '+372', isEurozone: true },
  { code: 'LV', name: 'Latvija', flag: '🇱🇻', currency: 'EUR', phonePrefix: '+371', isEurozone: true },
  { code: 'SI', name: 'Slovenija', flag: '🇸🇮', currency: 'EUR', phonePrefix: '+386', isEurozone: true },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', currency: 'EUR', phonePrefix: '+352', isEurozone: true },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾', currency: 'EUR', phonePrefix: '+357', isEurozone: true },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', currency: 'EUR', phonePrefix: '+356', isEurozone: true },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', currency: 'EUR', phonePrefix: '+354', isEurozone: false },
];

export const MARKETS = EUROPEAN_COUNTRIES.reduce((acc, country) => {
  acc[country.code] = {
    countryCode: country.code,
    name: country.name,
    flag: country.flag,
    defaultLocale: COUNTRY_TO_LOCALE[country.code] || 'en',
    currency: country.currency,
    delivery: country.code === 'ES' ? { minDays: 3, maxDays: 7 } : { minDays: 5, maxDays: 15 },
    freeShippingThreshold: country.code === 'ES' ? 500 : 750,
    vatRate: 0.21,
    phonePrefix: country.phonePrefix,
    isEurozone: country.isEurozone,
  };
  return acc;
}, {});

// Generic Pan-European fallback
MARKETS.EU = {
  countryCode: 'EU',
  name: 'Europe (All European Countries)',
  flag: '🇪🇺',
  defaultLocale: 'en',
  currency: 'EUR',
  delivery: { minDays: 5, maxDays: 15 },
  freeShippingThreshold: 750,
  vatRate: 0.21,
  phonePrefix: '+34',
  isEurozone: true,
};

export const DEFAULT_MARKET = 'ES';

export function getMarket(marketCode) {
  if (!marketCode) return MARKETS[DEFAULT_MARKET];
  const upper = marketCode.toUpperCase();
  return MARKETS[upper] || MARKETS.EU || MARKETS[DEFAULT_MARKET];
}

export function getMarketForLocale(locale) {
  const match = Object.values(MARKETS).find((m) => m.defaultLocale === locale);
  return match || MARKETS[DEFAULT_MARKET];
}

export function getMarketForCountry(countryCode) {
  if (!countryCode) return MARKETS[DEFAULT_MARKET];
  const upper = countryCode.toUpperCase();
  return MARKETS[upper] || MARKETS.EU || MARKETS[DEFAULT_MARKET];
}
