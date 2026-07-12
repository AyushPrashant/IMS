// CartContext.js
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cart2, setCart2] = useState([]);
  const itemCount = cart.length;
  const itemCount2 = cart2.length;
  // console.log(itemCount);
  const id = 0;
  const id2 = 0;
  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex(
      (item) => item.ProductName === product.ProductName
    );

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].Quantity =
        Number(cart[existingProductIndex].Quantity) + Number(product.Quantity);
    } else {
      // If the product does not exist, add it to the cart
      setCart([...cart, product]);
    }
  };

  const addToCart2 = (product) => {
    const existingProductIndex = cart2.findIndex(
      (item) => item.ProductName === product.ProductName
    );

    if (existingProductIndex !== -1) {
      cart2[existingProductIndex].Quantity =
        Number(cart2[existingProductIndex].Quantity) + Number(product.Quantity);
    } else {
      // If the product does not exist, add it to the cart
      setCart2([...cart2, product]);
    }
  };

  const decreaseQuantity = (productName) => {
    const updatedCart = cart.map((item) => {
      if (item.ProductName === productName && item.Quantity > 0) {
        return { ...item, Quantity: item.Quantity - 1 };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const decreaseQuantity2 = (productName) => {
    const updatedCart = cart2.map((item) => {
      if (item.ProductName === productName && item.Quantity > 0) {
        return { ...item, Quantity: item.Quantity - 1 };
      }
      return item;
    });
    setCart2(updatedCart);
  };

  const increaseQuantity = (productName) => {
    const updatedCart = cart.map((item) => {
      if (item.ProductName === productName) {
        return { ...item, Quantity: Number(item.Quantity) + 1 };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const increaseQuantity2 = (productName) => {
    const updatedCart = cart2.map((item) => {
      if (item.ProductName === productName) {
        return { ...item, Quantity: Number(item.Quantity) + 1 };
      }
      return item;
    });
    setCart2(updatedCart);
  };

  const removeFromCart = (ProductName) => {
    setCart(cart.filter((item) => item.ProductName !== ProductName));
  };

  const removeFromCart2 = (ProductName) => {
    setCart2(cart2.filter((item) => item.ProductName !== ProductName));
  };

  const clearCart = () => {
    setCart2([]);
  };


  return (
    <CartContext.Provider
      value={{
        cart,
        clearCart,
        setCart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        itemCount,
        cart2,
        addToCart2,
        increaseQuantity2,
        removeFromCart2,
        decreaseQuantity2,
        itemCount2,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
