"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Dumbbell, UserPlus, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    try {
      // Check if username exists in Supabase database
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('username', username.toLowerCase())
        .single();

      if (error && error.code === 'PGRST116') {
        // No rows returned - username is available
        setUsernameAvailable(true);
      } else if (data) {
        // Username found - not available
        setUsernameAvailable(false);
      } else {
        // Other error occurred
        console.error('Username check error:', error);
        setUsernameAvailable(null);
      }
    } catch (error) {
      console.error('Username availability check failed:', error);
      setUsernameAvailable(null);
    }
  };

  const handleUsernameChange = (username: string) => {
    setFormData({ ...formData, username });
    checkUsernameAvailability(username);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    if (usernameAvailable === false) {
      setError('Username is already taken');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await register(formData.name, formData.username, formData.email, formData.password);
      if (result.success) {
        // If there's an error message but success is true, it means email verification is required
        if (result.error) {
          // Show success message for email verification
          setSuccessMessage(result.error);
          setError(''); // Clear any previous errors
          // Don't redirect immediately, let user see the verification message
          return;
        }
        router.push('/');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 theme-gradient rounded-2xl">
              <Dumbbell className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">LevelUp</h1>
              <p className="text-sm text-zinc-400">Fitness Tracker</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-zinc-400">Start your fitness transformation today</p>
        </div>

        {/* Registration Form */}
        <div className="bg-zinc-800/50 p-8 rounded-2xl border border-zinc-700/50 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm">
                {successMessage}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus focus:border-transparent transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 pr-12 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus focus:border-transparent transition-all"
                  placeholder="Choose a unique username"
                  required
                />
                {formData.username.length >= 3 && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {usernameAvailable === null ? (
                      <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                    ) : usernameAvailable ? (
                      <Check className="h-5 w-5 text-green-400" />
                    ) : (
                      <X className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                )}
              </div>
              {formData.username.length >= 3 && usernameAvailable !== null && (
                <p className={`text-xs mt-1 ${usernameAvailable ? 'text-green-400' : 'text-red-400'}`}>
                  {usernameAvailable ? 'Username is available' : 'Username is already taken'}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus focus:border-transparent transition-all"
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 pr-12 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus focus:border-transparent transition-all"
                  placeholder="Create a secure password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-1">Must be at least 6 characters long</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 pr-12 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 theme-focus focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || usernameAvailable === false}
              className="w-full theme-gradient text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-zinc-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="theme-text hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-zinc-500 text-sm">
            © 2025 LevelUp. Transform your fitness journey.
          </p>
        </div>
      </div>
    </div>
  );
}