import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CURRENCY_METADATA, DEFAULT_EXCHANGE_RATES } from '@/lib/currency/currency-service';

// In-memory runtime cache for currency settings
let currencySettingsCache = {
  baseCurrency: 'EUR',
  rates: { ...DEFAULT_EXCHANGE_RATES },
  enabledCurrencies: Object.keys(CURRENCY_METADATA),
  roundingStrategy: 'standard', // standard, 99_cents, integer
  lastUpdated: new Date().toISOString(),
};

/**
 * GET /api/currencies
 * Returns the current global currency settings, base currency, exchange rates, and metadata.
 */
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      settings: currencySettingsCache,
      metadata: CURRENCY_METADATA,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/currencies
 * Updates global base currency, exchange rate overrides, or enabled currencies.
 */
export async function PUT(request) {
  try {
    const body = await request.json();
    const { baseCurrency, rates, enabledCurrencies, roundingStrategy } = body;

    if (baseCurrency) currencySettingsCache.baseCurrency = baseCurrency;
    if (rates && typeof rates === 'object') {
      currencySettingsCache.rates = {
        ...currencySettingsCache.rates,
        ...rates,
      };
    }
    if (Array.isArray(enabledCurrencies)) {
      currencySettingsCache.enabledCurrencies = enabledCurrencies;
    }
    if (roundingStrategy) {
      currencySettingsCache.roundingStrategy = roundingStrategy;
    }
    currencySettingsCache.lastUpdated = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: 'Currency settings updated successfully',
      settings: currencySettingsCache,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
