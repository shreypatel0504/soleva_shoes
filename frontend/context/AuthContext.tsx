'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../lib/types';
import { authApi } from '../lib/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (credentials: any) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    // Check localStorage on boot
    const storedToken = localStorage.getItem('soleva_token');
    const storedUser = localStorage.getItem('soleva_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Verify token with backend
        authApi
          .getMe()
          .then((res) => {
            if (res.data && res.data.data && res.data.data.user) {
              setUser(res.data.data.user);
              localStorage.setItem('soleva_user', JSON.stringify(res.data.data.user));
            }
          })
          .catch(() => {
            // Silently handle expired token
            localStorage.removeItem('soleva_token');
            localStorage.removeItem('soleva_user');
            setToken(null);
            setUser(null);
          })
          .finally(() => setIsLoading(false));
      } catch {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: any): Promise<boolean> => {
    try {
      const res = await authApi.login(credentials);
      if (res.data.success && res.data.data) {
        const { user: loggedInUser, token: authToken } = res.data.data;
        setUser(loggedInUser);
        setToken(authToken);
        localStorage.setItem('soleva_token', authToken);
        localStorage.setItem('soleva_user', JSON.stringify(loggedInUser));

        showToast({
          type: 'success',
          title: 'Welcome back!',
          message: `Signed in as ${loggedInUser.name}`,
        });
        return true;
      }
      return false;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast({
        type: 'error',
        title: 'Authentication Error',
        message,
      });
      return false;
    }
  };

  const register = async (data: any): Promise<boolean> => {
    try {
      const res = await authApi.register(data);
      if (res.data.success && res.data.data) {
        const { user: registeredUser, token: authToken } = res.data.data;
        setUser(registeredUser);
        setToken(authToken);
        localStorage.setItem('soleva_token', authToken);
        localStorage.setItem('soleva_user', JSON.stringify(registeredUser));

        showToast({
          type: 'success',
          title: 'Welcome to SOLEVA!',
          message: 'Your member account was created successfully.',
        });
        return true;
      }
      return false;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      showToast({
        type: 'error',
        title: 'Registration Error',
        message,
      });
      return false;
    }
  };

  const logout = () => {
    authApi.logout().catch(() => {});
    localStorage.removeItem('soleva_token');
    localStorage.removeItem('soleva_user');
    setUser(null);
    setToken(null);
    showToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been logged out of your session.',
    });
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('soleva_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
