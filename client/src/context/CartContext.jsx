import React, { createContext, useContext, useEffect, useState } from 'react';
import { formatCurrency } from '../utils/currency';

export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('royalify_cart');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((item) => {
        const price = typeof item.price === 'number' ? item.price : 0;
        const currency = item.currency || 'USD';
        return {
          ...item,
          currency,
          priceDisplay: formatCurrency(price, { currency })
        };
      });
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('royalify_cart', JSON.stringify(items));
  }, [items]);

  function addItem(product, qty = 1) {
    setItems(prev => {
      const found = prev.find(i => i.id === product.id);
      if (found) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      const price = typeof product.price === 'number' ? product.price : 0;
      const currency = product.currency || 'USD';
      return [...prev, {
        id: product.id,
        name: product.name,
        price,
        priceDisplay: formatCurrency(price, { currency }),
        currency,
        image: product.image,
        qty
      }];
    });
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function updateQty(id, qty) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }

  function clear() { setItems([]); }

  const total = items.reduce((s, it) => s + (it.price || 0) * it.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear, total }}>
      {children}
    </CartContext.Provider>
  );
}
