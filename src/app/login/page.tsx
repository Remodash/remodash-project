'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: {email?: string, password?: string} = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Login successful', { email, password });
        // Redirect or handle success
      } catch (error) {
        console.error('Login failed:', error);
        setErrors({
          ...errors,
          password: 'Invalid credentials. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Image Section - Hidden on mobile, shown on larger screens */}
      <div className="hidden lg:block lg:w-2/3 xl:w-3/4 relative">
        <Image
          src="/assets/images/villa_contemporaine.png"
          alt="Luxury Villa"
          layout="fill"
          objectFit="cover"
          priority
          quality={100}
          className="opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Login Form Section - Full width on mobile, smaller on desktop */}
      <div className="w-full lg:w-1/3 xl:w-1/4 p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-blue-950">
        <div className="mb-8 text-center">
          <Image 
            src="/assets/logo.png" 
            alt="Company Logo"
            width={120}
            height={60}
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl md:text-3xl font-bold text-blue-50">Welcome Back</h2>
          <p className="text-blue-200 mt-2">Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg bg-blue-800 border ${errors.email ? 'border-red-500' : 'border-blue-700'} text-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-blue-100">
                Password
              </label>
              <a href="#" className="text-xs text-blue-300 hover:text-blue-100 transition-colors">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg bg-blue-800 border ${errors.password ? 'border-red-500' : 'border-blue-700'} text-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-700 rounded bg-blue-800"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-200">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${isLoading ? 'bg-blue-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-blue-300">
            Don&apos;t have an account?{' '}
            <a href="#" className="font-medium text-blue-100 hover:text-white transition-colors">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}