"use client";
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { IconEye, IconEyeOff, IconAlertCircle, IconMail, IconLock } from '@tabler/icons-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { signIn, loading } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');

    // Validasi client-side
    let hasError = false;

    if (!email) {
      setEmailError('Email harus diisi');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Format email tidak valid');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password harus diisi');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password minimal 6 karakter');
      hasError = true;
    }

    if (hasError) return;

    const result = await signIn(email, password);
    console.log('Login result:', result); // Debug log
    
    if (result.error) {
      const { message, type } = result.error;
      console.log('Error details:', { message, type }); // Debug log
      
      // Tampilkan error berdasarkan type
      switch (type) {
        case 'email':
          setEmailError(message);
          break;
        case 'password':
          setPasswordError(message);
          break;
        case 'account':
        case 'connection':
        case 'system':
        default:
          setError(message);
          break;
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-700 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-neutral-800 to-neutral-900 dark:from-white dark:to-gray-100 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-white dark:text-neutral-900 font-bold text-2xl">S</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Selamat Datang
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Masuk ke Sistem Surat Menyurat Sekolah
          </p>
        </div>

        {/* General Error Alert */}
        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800 animate-in slide-in-from-top-2 duration-300">
            <div className="flex">
              <IconAlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-400">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconMail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  placeholder="admin@sekolah.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-offset-2 transition-all duration-200 text-sm ${
                    emailError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10' 
                      : 'border-neutral-300 dark:border-neutral-600 focus:border-neutral-500 focus:ring-neutral-500'
                  } dark:bg-neutral-800 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500`}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-1 duration-200">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Password
              </label>
                            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconLock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-offset-2 transition-all duration-200 text-sm ${
                    passwordError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10' 
                      : 'border-neutral-300 dark:border-neutral-600 focus:border-neutral-500 focus:ring-neutral-500'
                  } dark:bg-neutral-800 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <IconEyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors" />
                  ) : (
                    <IconEye className="h-5 w-5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-1 duration-200">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-neutral-700 hover:to-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </div>
              ) : (
                'Masuk'
              )}
            </button>
          </form>
        </div>

      
      </div>
    </div>
  );
}