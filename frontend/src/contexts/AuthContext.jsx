import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

  useEffect(() => {
    if (accessToken) {
      fetchUser();
    } else {
      tryRefreshToken();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      if (error.response?.status === 401) {
        await tryRefreshToken();
      } else {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const tryRefreshToken = async () => {
    try {
      const response = await api.post('/auth/refresh');
      const newAccessToken = response.data.accessToken;
      
      localStorage.setItem('accessToken', newAccessToken);
      setAccessToken(newAccessToken);
      
      // Fetch user with new token
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data.user);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (accessToken, userData) => {
    localStorage.setItem('accessToken', accessToken);
    setAccessToken(accessToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setAccessToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'superadmin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};