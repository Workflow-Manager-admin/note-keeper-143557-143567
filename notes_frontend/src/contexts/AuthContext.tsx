'use client';

// PUBLIC_INTERFACE
/**
 * Authentication context provider for managing user authentication state
 */

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User } from '@/types/api';
import { apiClient, ApiError } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const verifyToken = useCallback(async () => {
    try {
      const response = await apiClient.getProfile();
      setUser(response.data.user);
      setLoading(false);
    } catch {
      // Token is invalid, clear auth state
      clearAuthState();
      setLoading(false);
    }
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      // Verify token is still valid
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [verifyToken]);

  const clearAuthState = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiClient.login({ email, password });
      
      setUser(response.data.user);
      setToken(response.data.token);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Login failed. Please try again.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiClient.register({ email, password });
      
      setUser(response.data.user);
      setToken(response.data.token);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Registration failed. Please try again.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      // Even if logout fails on backend, clear local state
      console.warn('Logout request failed:', error);
    } finally {
      clearAuthState();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
