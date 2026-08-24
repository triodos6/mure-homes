'use client';

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/i18n/config';
import { getMessage } from '@/i18n/get-messages';

const defaultT = (key, params) => key;
const defaultGetLocalizedHref = (path) => path || '/';

const I18nContext = createContext({
  locale: DEFAULT_LOCALE,
  messages: {},
  t: defaultT,
  getLocalizedHref: defaultGetLocalizedHref,
});

export function I18nProvider({ children, locale: initialLocale, messages: initialMessages }) {
  const pathname = usePathname() || '/';

  // Extract active locale dynamically from current pathname
  const activeLocale = useMemo(() => {
    try {
      const segments = (pathname || '').split('/').filter(Boolean);
      const firstSegment = segments[0];
      if (firstSegment && SUPPORTED_LOCALES.includes(firstSegment) && firstSegment !== DEFAULT_LOCALE) {
        return firstSegment;
      }
    } catch { }
    return DEFAULT_LOCALE;
  }, [pathname]);

  // Dynamically load messages when locale changes on client-side navigation
  const [dynamicMessages, setDynamicMessages] = useState(null);
  const [loadedLocale, setLoadedLocale] = useState(initialLocale || DEFAULT_LOCALE);

  useEffect(() => {
    // If the active locale matches what was initially served, use server-provided messages
    if (activeLocale === (initialLocale || DEFAULT_LOCALE)) {
      setDynamicMessages(null);
      setLoadedLocale(activeLocale);
      return;
    }
    // If we already loaded this locale, skip
    if (activeLocale === loadedLocale && dynamicMessages) return;

    // Dynamically import the correct dictionary
    let cancelled = false;
    import(`../../messages/${activeLocale}.json`)
      .then((mod) => {
        if (!cancelled) {
          setDynamicMessages(mod.default || mod);
          setLoadedLocale(activeLocale);
        }
      })
      .catch(() => {
        // Fallback to default
        if (!cancelled) {
          setDynamicMessages(null);
          setLoadedLocale(activeLocale);
        }
      });
    return () => { cancelled = true; };
  }, [activeLocale, initialLocale, loadedLocale, dynamicMessages]);

  // Use dynamically loaded messages if available, otherwise server-provided
  const activeMessages = useMemo(() => dynamicMessages || initialMessages || {}, [dynamicMessages, initialMessages]);

  // Reactive translation function
  const t = useMemo(() => {
    return (keyPath, params = {}) => getMessage(activeMessages, keyPath, params);
  }, [activeMessages]);

  // URL localization helper
  const getLocalizedHref = useMemo(() => {
    return (path) => {
      if (!path) return '/';
      if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:') || path.startsWith('tel:') || path.startsWith('#')) {
        return path;
      }
      const clean = path.startsWith('/') ? path : `/${path}`;
      if (activeLocale === DEFAULT_LOCALE) {
        return clean;
      }
      return `/${activeLocale}${clean}`;
    };
  }, [activeLocale]);

  const value = useMemo(() => ({
    locale: activeLocale,
    messages: activeMessages,
    t,
    getLocalizedHref,
  }), [activeLocale, activeMessages, t, getLocalizedHref]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  return context || {
    locale: DEFAULT_LOCALE,
    messages: {},
    t: defaultT,
    getLocalizedHref: defaultGetLocalizedHref,
  };
}

