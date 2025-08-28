import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState } from '../types';
import { apiService } from '../services/api';

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

  console.log('AuthProvider render:', authState);

  useEffect(() => {
    console.log('AuthContext useEffect: Checking for existing session');
    // Check for existing session
    const token = localStorage.getItem('access_token');
    console.log('AuthContext: Token found:', !!token);
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
          localStorage.removeItem('access_token');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }).catch(() => {
        // Error getting user, clear token
        localStorage.removeItem('access_token');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
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
        localStorage.setItem('access_token', response.data.access_token);
        
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
    localStorage.removeItem('access_token');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

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