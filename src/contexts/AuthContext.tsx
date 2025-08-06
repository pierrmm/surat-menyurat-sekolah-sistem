'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import bcrypt from 'bcryptjs';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkUser = async () => {
      try {
        const savedUser = localStorage.getItem('admin_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          console.log('Found saved user:', parsedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error checking saved user:', error);
        localStorage.removeItem('admin_user');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting login with:', { email });
      
      // Call login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.error };
      }

      const userObj = {
        id: result.data.id,
        email: result.data.email,
        name: result.data.name,
        role: result.data.role,
        is_active: result.data.is_active
      };

      setUser(userObj);
      localStorage.setItem('admin_user', JSON.stringify(userObj));
      console.log('User logged in successfully:', userObj);
      
      return { error: null };

    } catch (error) {
      console.error('Login error:', error);
      return { 
        error: { 
          message: 'Terjadi kesalahan sistem. Silakan coba lagi.',
          type: 'system'
        } 
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log('Signing out user');
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  const value = {
    user,
    loading,
    signIn,
    signOut
  };

  console.log('AuthContext current state:', { user, loading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}