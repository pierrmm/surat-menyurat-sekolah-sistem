"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

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
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      console.log('Attempting login with:', { email, password });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        const { supabase } = await import('@/lib/supabase');
        
        // Pertama cek apakah email ada
        const { data: emailCheck, error: emailError } = await supabase
          .from('admin_users')
          .select('email')
          .eq('email', email)
          .single();

        console.log('Email check:', { emailCheck, emailError });

        // Jika email tidak ditemukan
        if (emailError || !emailCheck) {
          console.log('Email not found');
          return { 
            error: { 
              message: 'Email tidak ditemukan',
              type: 'email'
            } 
          };
        }

        // Jika email ada, cek password dan status aktif
        const { data: adminUser, error: loginError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .eq('password', password)
          .eq('is_active', true)
          .single();

        console.log('Login attempt:', { adminUser, loginError });

        // Jika password salah atau user tidak aktif
        if (loginError || !adminUser) {
          // Cek apakah user ada tapi tidak aktif
          const { data: inactiveUser } = await supabase
            .from('admin_users')
            .select('is_active')
            .eq('email', email)
            .single();

          if (inactiveUser && !inactiveUser.is_active) {
            return { 
              error: { 
                message: 'Akun Anda tidak aktif. Hubungi administrator.',
                type: 'account'
              } 
            };
          }

          // Password salah
          return { 
            error: { 
              message: 'Password salah',
              type: 'password'
            } 
          };
        }

        const userObj = {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
          is_active: adminUser.is_active
        };

        setUser(userObj);
        localStorage.setItem('admin_user', JSON.stringify(userObj));
        console.log('User logged in successfully:', userObj);
        
        return { error: null };

      } catch (supabaseError) {
        console.error('Supabase connection error:', supabaseError);
        return { 
          error: { 
            message: 'Koneksi ke database gagal. Periksa koneksi internet Anda.',
            type: 'connection'
          } 
        };
      }

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}