'use client';

import { useEffect } from 'react';
import { event } from '@/lib/pixel';

export default function ProductPixelTracker({ product }) {
  useEffect(() => {
    if (!product) return;

    event('ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_category: product.category,
      value: product.price,
      currency: 'EUR',
    });
  }, [product]);

  return null;
}
