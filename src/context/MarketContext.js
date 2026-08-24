'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { MARKETS, DEFAULT_MARKET, getMarket, getMarketForLocale } from '@/lib/markets/config';
import { formatPrice as formatPriceUtil, resolveProductPrice } from '@/lib/currency/currency-service';
import { useI18n } from './I18nContext';

const MarketContext = createContext({
  market: MARKETS[DEFAULT_MARKET],
  marketCode: DEFAULT_MARKET,
  currency: 'EUR',
  setMarketCode: () => {},
  formatPrice: (amount) => String(amount),
  resolvePrice: (product) => ({ price: 0, currency: 'EUR', isConverted: false }),
});

export function MarketProvider({ children, initialMarketCode = DEFAULT_MARKET }) {
  const { locale } = useI18n();
  const [marketCode, setMarketCodeState] = useState(() => {
    return initialMarketCode || DEFAULT_MARKET;
  });

  useEffect(() => {
    try {
      // Allow user's explicit saved market preference if set manually via a country selector
      const saved = localStorage.getItem('murahomes_market');
      if (saved && MARKETS[saved]) {
        setTimeout(() => {
          setMarketCodeState(saved);
        }, 0);
      }
    } catch { }
  }, []);

  const setMarketCode = useCallback((newMarketCode) => {
    const validMarket = getMarket(newMarketCode);
    setMarketCodeState(validMarket.countryCode);
    try {
      localStorage.setItem('murahomes_market', validMarket.countryCode);
      document.cookie = `murahomes_market=${validMarket.countryCode}; path=/; max-age=31536000; SameSite=Lax`;
    } catch { }
  }, []);

  const market = useMemo(() => getMarket(marketCode), [marketCode]);
  const currency = market.currency || 'EUR';

  const formatPrice = useCallback((amount, customCurrency = null, customLocale = null) => {
    return formatPriceUtil(amount, customCurrency || currency, customLocale || locale);
  }, [currency, locale]);

  const resolvePrice = useCallback((product) => {
    return resolveProductPrice(product, marketCode, currency);
  }, [marketCode, currency]);

  const value = useMemo(() => ({
    market,
    marketCode,
    currency,
    setMarketCode,
    formatPrice,
    resolvePrice,
  }), [market, marketCode, currency, setMarketCode, formatPrice, resolvePrice]);

  return (
    <MarketContext.Provider value={value}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
}
