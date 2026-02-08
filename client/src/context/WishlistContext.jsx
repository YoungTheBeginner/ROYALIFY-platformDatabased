import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatCurrency } from '../utils/currency';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (!savedWishlist) return [];
      const parsed = JSON.parse(savedWishlist);
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
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev;
      }
      const price = typeof product.price === 'number' ? product.price : 0;
      const currency = product.currency || 'USD';
      return [...prev, {
        ...product,
        currency,
        priceDisplay: formatCurrency(price, { currency })
      }];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
