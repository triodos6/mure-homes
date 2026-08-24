/**
 * Central Currency & Price Formatting Engine
 * Single source of truth for all Pan-European and Global currencies,
 * exchange rate resolution, live conversion, and formatting.
 */

export const CURRENCY_METADATA = {
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', region: 'Eurozone', decimals: 2, position: 'prefix', defaultRate: 1.0 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', region: 'United Kingdom', decimals: 2, position: 'prefix', defaultRate: 0.854 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', region: 'Global / Americas', decimals: 2, position: 'prefix', defaultRate: 1.085 },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', region: 'Switzerland', decimals: 2, position: 'prefix', defaultRate: 0.962 },
  PLN: { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', flag: '🇵🇱', region: 'Poland', decimals: 2, position: 'suffix', defaultRate: 4.315 },
  SEK: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', flag: '🇸🇪', region: 'Nordics', decimals: 2, position: 'suffix', defaultRate: 11.45 },
  DKK: { code: 'DKK', symbol: 'kr', name: 'Danish Krone', flag: '🇩🇰', region: 'Nordics', decimals: 2, position: 'suffix', defaultRate: 7.458 },
  NOK: { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', flag: '🇳🇴', region: 'Nordics', decimals: 2, position: 'suffix', defaultRate: 11.62 },
  CZK: { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', flag: '🇨🇿', region: 'Central Europe', decimals: 2, position: 'suffix', defaultRate: 25.25 },
  HUF: { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', flag: '🇭🇺', region: 'Central Europe', decimals: 0, position: 'suffix', defaultRate: 395.0 },
  RON: { code: 'RON', symbol: 'lei', name: 'Romanian Leu', flag: '🇷🇴', region: 'Eastern Europe', decimals: 2, position: 'suffix', defaultRate: 4.975 },
  BGN: { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev', flag: '🇧🇬', region: 'Eastern Europe', decimals: 2, position: 'suffix', defaultRate: 1.956 },
  HRK: { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna', flag: '🇭🇷', region: 'Southern Europe', decimals: 2, position: 'suffix', defaultRate: 7.534 },
  RSD: { code: 'RSD', symbol: 'din', name: 'Serbian Dinar', flag: '🇷🇸', region: 'Balkans', decimals: 2, position: 'suffix', defaultRate: 117.2 },
  TRY: { code: 'TRY', symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷', region: 'Eurasia', decimals: 2, position: 'prefix', defaultRate: 36.50 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', region: 'Asia', decimals: 0, position: 'prefix', defaultRate: 165.0 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', region: 'Oceania', decimals: 2, position: 'prefix', defaultRate: 1.66 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', region: 'Americas', decimals: 2, position: 'prefix', defaultRate: 1.49 },
};

// Global default exchange rates (1 EUR = X currency)
export const DEFAULT_EXCHANGE_RATES = Object.fromEntries(
  Object.entries(CURRENCY_METADATA).map(([code, meta]) => [code, meta.defaultRate])
);

export const LOCALE_FORMAT_MAP = {
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  lt: 'lt-LT',
  en: 'en-GB',
  nl: 'nl-NL',
  pl: 'pl-PL',
  sv: 'sv-SE',
  da: 'da-DK',
  no: 'no-NO',
  fi: 'fi-FI',
  cs: 'cs-CZ',
  sk: 'sk-SK',
  hu: 'hu-HU',
  ro: 'ro-RO',
  bg: 'bg-BG',
  el: 'el-GR',
  hr: 'hr-HR',
  lv: 'lv-LV',
  et: 'et-EE',
  pt: 'pt-PT',
};

/**
 * Format a price with pure Intl.NumberFormat
 * @param {number} amount - Numeric price
 * @param {string} currency - 3-letter ISO currency code (EUR, GBP, USD, etc.)
 * @param {string} locale - Linguistic locale (es, fr, de, it, etc.)
 * @returns {string} Formatted localized price string
 */
export function formatPrice(amount, currency = 'EUR', locale = 'es') {
  if (typeof amount !== 'number' || isNaN(amount)) {
    amount = 0;
  }
  const currCode = (currency || 'EUR').toUpperCase();
  const meta = CURRENCY_METADATA[currCode];
  const decimals = meta ? meta.decimals : 2;
  const intlLocale = LOCALE_FORMAT_MAP[locale] || LOCALE_FORMAT_MAP.es;
  
  try {
    return new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currency: currCode,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  } catch {
    const formatted = amount.toFixed(decimals);
    if (meta?.position === 'prefix') {
      return `${meta.symbol} ${formatted}`;
    }
    return `${formatted} ${meta ? meta.symbol : currCode}`;
  }
}

/**
 * Resolve display price for a product in a given market/currency.
 * Uses global base EUR price multiplied by global exchange rate setting.
 * Allows optional product-level market price overrides if explicitly defined.
 *
 * @param {object} product - Product object
 * @param {string} marketCode - Market code (e.g. 'GB', 'ES', 'US')
 * @param {string} targetCurrency - Desired currency ('GBP', 'EUR', 'USD', etc.)
 * @param {object} customRates - Optional cached rates override
 * @returns {{ price: number, currency: string, isConverted: boolean }}
 */
export function resolveProductPrice(product, marketCode = 'ES', targetCurrency = 'EUR', customRates = null) {
  if (!product) {
    return { price: 0, currency: targetCurrency, isConverted: false };
  }

  const basePriceEUR = Number(product.price) || 0;
  const curr = (targetCurrency || 'EUR').toUpperCase();

  // 1. Check fixed commercial market price override if explicitly set by admin
  if (product.marketPrices) {
    const fixedPrice = product.marketPrices[marketCode] ?? product.marketPrices[curr];
    if (fixedPrice !== undefined && fixedPrice !== null && !isNaN(Number(fixedPrice)) && Number(fixedPrice) > 0) {
      return {
        price: Number(fixedPrice),
        currency: curr,
        isConverted: false,
      };
    }
  }

  // 2. If target currency is EUR, return base EUR price
  if (curr === 'EUR') {
    return {
      price: basePriceEUR,
      currency: 'EUR',
      isConverted: false,
    };
  }

  // 3. Otherwise, convert via global exchange rates
  const rates = customRates || DEFAULT_EXCHANGE_RATES;
  const rate = Number(rates[curr]) || DEFAULT_EXCHANGE_RATES[curr] || 1.0;
  const meta = CURRENCY_METADATA[curr];
  
  let convertedPrice = basePriceEUR * rate;
  if (meta && meta.decimals === 0) {
    convertedPrice = Math.round(convertedPrice);
  } else {
    convertedPrice = Math.round(convertedPrice * 100) / 100;
  }

  return {
    price: convertedPrice,
    currency: curr,
    isConverted: true,
  };
}
