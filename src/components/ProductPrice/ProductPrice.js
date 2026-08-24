'use client';

import React from 'react';
import { useMarket } from '@/context/MarketContext';

export default function ProductPrice({ product, className = 'text-2xl font-medium text-foreground mb-8' }) {
  const { formatPrice, resolvePrice, currency } = useMarket();
  const priceInfo = resolvePrice(product);
  const displayPrice = priceInfo.price || product?.price || 0;

  return (
    <div className="flex items-baseline gap-2 mb-8">
      <p className={className}>
        {formatPrice(displayPrice)}
      </p>
      {priceInfo.isConverted && (
        <span className="text-xs text-muted-foreground font-mono">
          ({currency})
        </span>
      )}
    </div>
  );
}
