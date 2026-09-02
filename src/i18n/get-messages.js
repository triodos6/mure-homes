import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './config.js';

/**
 * Server-side dictionary loader.
 * Dynamically loads the dictionary for the requested locale, falling back to 'es'.
 * @param {string} locale
 * @returns {object} Full message dictionary
 */
export async function getMessages(locale = DEFAULT_LOCALE) {
  const safeLocale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  try {
    const mod = await import(`../../messages/${safeLocale}.json`, { with: { type: 'json' } });
    return mod.default || mod;
  } catch (error) {
    try {
      const mod = await import(`../../messages/${safeLocale}.json`);
      return mod.default || mod;
    } catch (e) {
      return {};
    }
  }
}

/**
 * Helper to retrieve a nested message string safely.
 * @param {object} messages - Dictionary object
 * @param {string} keyPath - Dot notation path (e.g. "navigation.home")
 * @param {object} params - Optional interpolation parameters { count: 5, name: 'Sofa' }
 * @returns {string}
 */
export function getMessage(messages, keyPath, params = {}) {
  if (!keyPath) return '';
  const keys = keyPath.split('.');
  
  // 1. Try active messages dictionary
  let current = messages;
  let found = true;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      found = false;
      break;
    }
  }

  // 2. Fallback safely if not found
  if (!found || typeof current !== 'string') {
    return '';
  }

  let text = current;
  for (const [pKey, pVal] of Object.entries(params)) {
    text = text.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
  }
  return text;
}
