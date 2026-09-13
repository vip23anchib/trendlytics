import React, { createContext, useContext, useState, useEffect } from 'react';
import { trackEvent } from '../utils/telemetry';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('tl_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('tl_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState('TREND20');

  useEffect(() => {
    localStorage.setItem('tl_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tl_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, size = 'M', quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, size, quantity }];
    });

    trackEvent('add_to_cart', {
      productId: product.id,
      metadata: {
        price: parseFloat(product.price),
        size: size,
        brand: product.brand,
      },
    });
  };

  const removeFromCart = (productId, size) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)));
    trackEvent('remove_from_cart', { productId });
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product) => {
    const isPresent = wishlist.some((item) => item.id === product.id);
    if (isPresent) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      trackEvent('wishlist_remove', { productId: product.id });
    } else {
      setWishlist((prev) => [...prev, product]);
      trackEvent('wishlist_add', {
        productId: product.id,
        metadata: { price: parseFloat(product.price), brand: product.brand },
      });
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Calculations
  const rawSubtotal = cart.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);
  
  let discountAmount = 0;
  if (coupon === 'TREND20') {
    discountAmount = rawSubtotal * 0.20;
  } else if (coupon === 'FIRST500') {
    discountAmount = Math.min(500, rawSubtotal * 0.30);
  } else if (coupon === 'MYNTRASTYLE') {
    discountAmount = rawSubtotal * 0.15;
  }

  const deliveryFee = rawSubtotal >= 999 || rawSubtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, rawSubtotal - discountAmount + deliveryFee);
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        coupon,
        setCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        rawSubtotal,
        discountAmount,
        deliveryFee,
        grandTotal,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
