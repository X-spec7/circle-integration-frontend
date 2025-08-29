'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import type { User, LoginRequest, RegisterRequest } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, name: string, userType: 'investor' | 'sme') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    console.log('AuthContext useEffect: Checking for existing session');
    // Check for existing session
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    console.log('AuthContext: Token found:', !!token);
    console.log('AuthContext: Current auth state:', authState);
    
    if (token) {
      // Verify token by getting current user
      console.log('AuthContext: Verifying token...');
      apiService.getCurrentUser().then((response) => {
        if (response.data) {
          setAuthState({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // Token is invalid, clear it
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
          }
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }).catch(() => {
        // Error getting user, clear token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
        }
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }

    // Listen for token expiration events
    const handleTokenExpired = () => {
      console.log('AuthContext: Token expired event received');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('tokenExpired', handleTokenExpired);

      // Cleanup event listener
      return () => {
        window.removeEventListener('tokenExpired', handleTokenExpired);
      };
    }
  }, []);

  const login = async (username: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await apiService.login({ username, password });
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data?.access_token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', response.data.access_token);
        }
        
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string,
    name: string,
    userType: 'investor' | 'sme'
  ) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await apiService.register({
        email,
        username,
        password,
        name,
        user_type: userType,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        // After successful registration, login the user
        await login(username, password);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  console.log('AuthProvider rendering with state:', authState);
  
  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 