import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { apiService } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, userType: 'investor' | 'sme', company?: string) => Promise<void>;
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
    // Check for existing session
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token by getting current user
      apiService.getCurrentUser().then((response) => {
        if (response.data) {
          setAuthState({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('token');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }).catch(() => {
        // Error getting user, clear token
        localStorage.removeItem('token');
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

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await apiService.login({ username: email, password });
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data?.access_token) {
        localStorage.setItem('token', response.data.access_token);
        
        // Get user profile
        const userResponse = await apiService.getCurrentUser();
        if (userResponse.data) {
          setAuthState({
            user: userResponse.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          throw new Error('Failed to get user profile');
        }
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
    password: string, 
    name: string, 
    userType: 'investor' | 'sme',
    company?: string
  ) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await apiService.register({
        email,
        username: email, // Using email as username for simplicity
        password,
        name,
        user_type: userType,
        company,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        // After successful registration, login the user
        await login(email, password);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
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