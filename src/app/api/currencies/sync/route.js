import { NextResponse } from 'next/server';
import { CURRENCY_METADATA } from '@/lib/currency/currency-service';

/**
 * POST /api/currencies/sync
 * Fetches real-time market exchange rates from open exchange API
 */
export async function POST() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/EUR', {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch live exchange rates');
    }

    const data = await res.json();
    const liveRates = data.rates || {};

    const updatedRates = {};
    for (const code of Object.keys(CURRENCY_METADATA)) {
      if (liveRates[code]) {
        updatedRates[code] = Number(liveRates[code]);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Live exchange rates synchronized successfully',
      rates: updatedRates,
      source: 'Open Exchange API (ECB / Market benchmark)',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
