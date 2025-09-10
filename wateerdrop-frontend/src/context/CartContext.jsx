import { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the context
const CartContext = createContext();

// 2. Create a custom hook for easy access to the context
export const useCart = () => useContext(CartContext);

// 3. Create the Provider component
export const CartProvider = ({ children }) => {
  // The state that holds the array of products in the cart
  const [cart, setCart] = useState([]);

  // Load the cart from localStorage when the app starts
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      // If parsing fails, start with an empty cart
      setCart([]);
    }
  }, []);

  // Save the cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Function to add a product to the cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Check if the product already exists in the cart
      const existingProduct = prevCart.find((p) => p._id === product._id);
      
      if (existingProduct) {
        // If it exists, map over the cart and increase the quantity
        return prevCart.map((p) =>
          p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      
      // If it's a new product, add it to the cart with quantity 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Function to remove a product from the cart by its ID
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((p) => p._id !== productId));
  };

  // Function to completely empty the cart
  const clearCart = () => {
    setCart([]);
  };

  // The value object provides the cart data and functions to all child components
  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};