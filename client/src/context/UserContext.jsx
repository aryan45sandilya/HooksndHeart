import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('userToken'));
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  // Check if user is logged in on mount
  useEffect(() => {
    if (token) {
      verifyToken();
      fetchCart();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.data);
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data.data);
      setCartCount(response.data.data.items.length);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        name,
        email,
        password,
        phone
      });

      const { token: newToken, data } = response.data;
      
      setToken(newToken);
      setUser(data);
      localStorage.setItem('userToken', newToken);
      await fetchCart();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password
      });

      const { token: newToken, data } = response.data;
      
      setToken(newToken);
      setUser(data);
      localStorage.setItem('userToken', newToken);
      await fetchCart();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCart(null);
    setCartCount(0);
    localStorage.removeItem('userToken');
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      return { success: false, message: 'Please login first' };
    }

    try {
      const response = await axios.post(
        `${API_URL}/cart/add`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCart(response.data.data);
      setCartCount(response.data.data.items.length);
      return { success: true, message: 'Added to cart!' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add to cart'
      };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const response = await axios.put(
        `${API_URL}/cart/update`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCart(response.data.data);
      setCartCount(response.data.data.items.length);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCart(response.data.data);
      setCartCount(response.data.data.items.length);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    cart,
    cartCount,
    login,
    register,
    logout,
    addToCart,
    updateCartItem,
    removeFromCart,
    fetchCart,
    isAuthenticated: !!user
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
