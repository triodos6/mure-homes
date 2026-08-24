'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/I18nContext";
import { useMarket } from "@/context/MarketContext";
import { ShoppingBag, X, ArrowRight, Minus, Plus, Lock, Shield } from "lucide-react";
import CheckoutModal from '@/components/CheckoutModal/CheckoutModal';

export default function CartDrawer({ open, setOpen }) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const { t, locale } = useI18n();
  const { formatPrice, resolvePrice } = useMarket();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md bg-white p-0 flex flex-col h-full border-l border-border shadow-2xl z-[100]">
          <SheetHeader className="p-6 border-b border-border bg-secondary/10">
            <div className="flex items-center justify-between">
              <SheetTitle className="font-serif text-2xl font-medium flex items-center gap-2">
                <ShoppingBag size={22} className="text-amber-500" /> {t('cart.title')}
              </SheetTitle>
            </div>
            <SheetDescription className="text-xs font-light uppercase tracking-widest text-muted-foreground mt-1">
              {cartCount} {cartCount === 1 ? (locale === 'es' ? 'Artículo' : 'Item') : (locale === 'es' ? 'Artículos' : 'Items')}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-grow overflow-y-auto px-6 py-4 space-y-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground/30">
                  <ShoppingBag size={32} />
                </div>
                <p className="text-muted-foreground font-light italic">{t('cart.empty')}</p>
                <button onClick={() => setOpen(false)} className="text-xs font-bold uppercase tracking-widest text-black border-b border-black/20 hover:border-black transition-all">
                  {t('cart.explore')}
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemPriceInfo = resolvePrice(item);
                const itemUnitPrice = itemPriceInfo.price || item.price;
                return (
                  <div key={item.id} className="group relative flex gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-secondary/30 relative">
                      <Image src={item.images?.[0] || '/images/img1.jpg'} alt={item.name || 'Producto'} width={96} height={96} className="h-full w-full object-cover" unoptimized />
                    </div>
                    <div className="flex flex-grow flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-base font-medium text-foreground leading-tight">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive p-1 transition-colors" aria-label={t('cart.remove')}>
                            <X size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground font-light uppercase tracking-tight mt-0.5">{item.brand}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] bg-secondary px-2 py-0.5 rounded text-foreground capitalize font-medium w-fit">
                            {t('common.inStock')}
                          </span>
                          <div className="flex items-center border border-border rounded-lg overflow-hidden h-8 w-24 bg-white shadow-xs">
                            <button onClick={() => updateQuantity(item.id, -1)} className="flex-1 flex items-center justify-center hover:bg-secondary transition-colors" aria-label="Reducir">
                              <Minus size={12} />
                            </button>
                            <span className="flex-1 flex items-center justify-center text-xs font-medium border-x border-border">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="flex-1 flex items-center justify-center hover:bg-secondary transition-colors" aria-label="Aumentar">
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">{formatPrice(itemUnitPrice * item.quantity)}</p>
                          {item.quantity > 1 && <p className="text-[10px] text-muted-foreground">{formatPrice(itemUnitPrice)} c/u</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {cart.length > 0 && (
            <SheetFooter className="p-6 border-t border-border bg-white mt-auto block">
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-light uppercase tracking-widest text-muted-foreground">{t('cart.subtotal')}</span>
                  <span className="text-xl font-medium text-foreground">
                    {formatPrice(cart.reduce((sum, item) => sum + ((resolvePrice(item).price || item.price || 0) * item.quantity), 0))}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground italic leading-relaxed">{t('cart.taxShippingNote')}</p>
                <div className="grid grid-cols-1 gap-3 pt-2">
                  <button onClick={handleCheckout} className="w-full bg-black text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black/80 transition-all flex items-center justify-center gap-2 group shadow-md active:scale-[0.99]">
                    {t('cart.checkout')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center justify-center gap-3 py-1">
                    <div className="flex items-center gap-1 text-emerald-600">
                      <Lock size={11} />
                      <span className="text-[10px] font-semibold">SSL 256-bit</span>
                    </div>
                    <span className="text-border">·</span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Shield size={11} />
                      <span className="text-[10px]">{t('product.warrantyBadge')}</span>
                    </div>
                    <span className="text-border">·</span>
                    <span className="text-[10px] text-muted-foreground">{t('product.returnBadge')}</span>
                  </div>
                  <button onClick={() => setOpen(false)} className="w-full bg-transparent text-muted-foreground py-2 text-xs font-medium hover:text-foreground transition-colors">
                    {t('common.close')}
                  </button>
                </div>
              </div>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} cart={cart} cartTotal={cartTotal} onSuccess={clearCart} />
    </>
  );
}
