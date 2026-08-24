'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useI18n } from '@/context/I18nContext';
import { event } from '@/lib/pixel';

export default function ProductActions({ product }) {
  const { addToCart } = useCart();
  const { t } = useI18n();

  const handleAddToCart = () => {
    addToCart(product);
    event('AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      content_category: product.category,
      value: product.price,
      currency: 'EUR',
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-12">
      <Button
        size="lg"
        className="flex-1 py-6 text-sm uppercase tracking-widest cursor-pointer"
        onClick={handleAddToCart}
      >
        {t('product.addToCart') || t('common.addToCart') || 'Añadir a la Cesta'}
      </Button>
    </div>
  );
}
