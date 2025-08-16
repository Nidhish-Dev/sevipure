import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  totalAmount: number;
  addToCart: (product: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Memoize the useCart hook to prevent recreation on every render
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const { isAuthenticated, token, user } = useAuth();
  const navigate = useNavigate();

  // Calculate total amount and cart count when items change
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setTotalAmount(total);
    setCartCount(count);
  }, [items]);

  // Load cart from server when user is authenticated
  useEffect(() => {
    if (isAuthenticated && token && user) {
      console.log('Loading cart for user:', user.id);
      loadCartFromServer();
    }
  }, [isAuthenticated, token, user]);

  const loadCartFromServer = useCallback(async () => {
    try {
      console.log('Fetching cart from server...');
      const response = await fetch('http://localhost:3000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Cart loaded from server:', data);
        setItems(data.cart.items || []);
      } else {
        console.error('Failed to load cart:', response.status);
      }
    } catch (error) {
      console.error('Error loading cart from server:', error);
    }
  }, [token]);

  const addToCart = useCallback(async (product: CartItem) => {
    if (!isAuthenticated || !token) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    try {
      console.log('Adding to cart:', product);
      const response = await fetch('http://localhost:3000/api/cart/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: product.productId,
          quantity: product.quantity
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Cart updated:', data);
        setItems(data.cart.items);
      } else {
        console.error('Failed to add to cart:', response.status);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }, [isAuthenticated, token, navigate]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (!isAuthenticated || !token) return;

    try {
      const response = await fetch('http://localhost:3000/api/cart/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          quantity
        })
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.cart.items);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }, [isAuthenticated, token]);

  const removeFromCart = useCallback(async (productId: string) => {
    if (!isAuthenticated || !token) return;

    try {
      const response = await fetch(`http://localhost:3000/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.cart.items);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  }, [isAuthenticated, token]);

  const clearCart = useCallback(async () => {
    if (!isAuthenticated || !token) return;

    try {
      const response = await fetch('http://localhost:3000/api/cart/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setItems([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }, [isAuthenticated, token]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo<CartContextType>(() => ({
    items,
    totalAmount,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  }), [items, totalAmount, cartCount, addToCart, updateQuantity, removeFromCart, clearCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
