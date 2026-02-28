import { useCallback, useState } from 'react';
import type { ProgramId } from '../types';

const MAX_COMPARE_ITEMS = 2;

export const useCompareCart = () => {
  const [cartItems, setCartItems] = useState<ProgramId[]>([]);

  const addToCart = useCallback((id: ProgramId) => {
    setCartItems((prev) => {
      if (prev.includes(id)) return prev;
      if (prev.length >= MAX_COMPARE_ITEMS) return prev;
      return [...prev, id];
    });
  }, []);

  const removeFromCart = useCallback((id: ProgramId) => {
    setCartItems((prev) => prev.filter((item) => item !== id));
  }, []);

  const toggleCartItem = useCallback((id: ProgramId) => {
    setCartItems((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= MAX_COMPARE_ITEMS) return prev;
      return [...prev, id];
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const isInCart = useCallback(
    (id: ProgramId) => cartItems.includes(id),
    [cartItems],
  );

  const isFull = cartItems.length >= MAX_COMPARE_ITEMS;
  const canCompare = cartItems.length >= 2;

  return {
    cartItems,
    addToCart,
    removeFromCart,
    toggleCartItem,
    clearCart,
    isInCart,
    isFull,
    canCompare,
  };
};
