'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { event } from '@/lib/pixel';

const CartContext = createContext(undefined);

const GUEST_CART_KEY = 'santiago-cart-guest';

export function CartProvider({ children }) {
  const { isLoaded, isSignedIn, user } = useAuth();
  const [cart, setCart] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (!isLoaded) return;

    queueMicrotask(() => {
      const key = isSignedIn && user ? `santiago-cart-${user.id}` : GUEST_CART_KEY;
      const saved = localStorage.getItem(key);
      if (saved) {
        try { setCart(JSON.parse(saved)); } catch { setCart([]); }
      } else {
        setCart([]);
      }
      setIsInitialized(true);
    });
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (!isInitialized) return;
    const key = isSignedIn && user ? `santiago-cart-${user.id}` : GUEST_CART_KEY;
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, isInitialized, isSignedIn, user]);

  const addToCart = (product) => {
    if (isAdmin) {
      toast.error('Admins cannot add items to cart.');
      return;
    }

    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      toast.info(`${product.name} quantity updated`);
    } else {
      toast.success(`${product.name} added to cart`);
      event('AddToCart', { content_ids: [product.id], content_name: product.name, value: product.price, currency: 'EUR' });
    }

    setCart((prev) => {
      const isItemInCart = prev.find((item) => item.id === product.id);
      if (isItemInCart) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, status: 'in-cart' }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    toast.error('Item removed from cart');
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === productId);
      if (!item) return prev;
      const newQty = item.quantity + delta;
      if (newQty <= 0) return prev.filter((i) => i.id !== productId);
      return prev.map((i) => i.id === productId ? { ...i, quantity: newQty } : i);
    });
  };

  const updateStatus = (productId, newStatus) => {
    setCart((prev) => prev.map((item) => item.id === productId ? { ...item, status: newStatus } : item));
    toast.success(`Item status updated to ${newStatus}`);
  };

  const clearCart = () => {
    setCart([]);
    const key = isSignedIn && user ? `santiago-cart-${user.id}` : GUEST_CART_KEY;
    localStorage.removeItem(key);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, updateStatus, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
}
