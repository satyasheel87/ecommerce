import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('cartItems');
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  const addToCart = (product, qty = 1) => {
    const exists = cartItems.find((x) => x._id === product._id);
    let updated;
    if (exists) {
      updated = cartItems.map((x) =>
        x._id === product._id ? { ...x, qty: x.qty + qty } : x
      );
    } else {
      updated = [...cartItems, { ...product, qty }];
    }
    saveCart(updated);
  };

  const removeFromCart = (id) => {
    saveCart(cartItems.filter((x) => x._id !== id));
  };

  const updateQty = (id, qty) => {
    saveCart(cartItems.map((x) => (x._id === id ? { ...x, qty } : x)));
  };

  const clearCart = () => saveCart([]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
