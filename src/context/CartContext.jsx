/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
const CART_KEY = "mg_fashions_cart";

export const useCart = () => useContext(CartContext);

function buildLineId(product) {
  return `${product.id}:${product.selectedSize || "default"}`;
}

function readInitialCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      ...item,
      cartLineId: item.cartLineId || `${item.id}:${item.selectedSize || "default"}`,
    }));
  } catch {
    return [];
  }
}

export default function CartProvider({ children }) {
  const [cart, setCart] = useState(() => readInitialCart());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    if (!product?.inStock) return;
    const cartLineId = buildLineId(product);

    setCart((prev) => {
      const existing = prev.find((item) => item.cartLineId === cartLineId);
      if (existing) {
        return prev.map((item) =>
          item.cartLineId === cartLineId
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, cartLineId, quantity: 1 }];
    });
    setOpen(true);
  };

  const removeFromCart = (cartLineId) => {
    setCart((prev) => prev.filter((item) => item.cartLineId !== cartLineId));
  };

  const updateQuantity = (cartLineId, nextQuantity) => {
    if (nextQuantity <= 0) {
      removeFromCart(cartLineId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartLineId === cartLineId
          ? { ...item, quantity: nextQuantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const total = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        total,
        open,
        setOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
