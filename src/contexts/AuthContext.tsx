"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  createdAt: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<AuthResult>;
  register: (name: string, username: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Try to fetch user profile when signed in
          const { data: userProfile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user profile on auth change:', error);

            // If user profile doesn't exist in our custom table, create a fallback user object
            if (error.code === 'PGRST116') {
              console.log('User profile not found in custom table, using Supabase auth data');
              setUser({
                id: session.user.id,
                name: session.user.user_metadata?.name || 'User',
                username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'user',
                email: session.user.email || '',
                createdAt: session.user.created_at || new Date().toISOString()
              });
            }
          } else if (userProfile) {
            setUser({
              id: userProfile.id,
              name: userProfile.name,
              username: userProfile.username,
              email: userProfile.email,
              createdAt: userProfile.created_at
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Try to fetch user profile from your users table
        const { data: userProfile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);

          // If user profile doesn't exist in our custom table, create a fallback user object
          if (error.code === 'PGRST116') {
            console.log('User profile not found in custom table, using Supabase auth data');
            setUser({
              id: session.user.id,
              name: session.user.user_metadata?.name || 'User',
              username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'user',
              email: session.user.email || '',
              createdAt: session.user.created_at || new Date().toISOString()
            });
          }
          return;
        }

        if (userProfile) {
          setUser({
            id: userProfile.id,
            name: userProfile.name,
            username: userProfile.username,
            email: userProfile.email,
            createdAt: userProfile.created_at
          });
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<AuthResult> => {
    try {
      // First, find the user by username to get their email
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('email, id')
        .eq('username', username)
        .single();

      if (userError || !userProfile) {
        if (userError?.code === 'PGRST116') {
          return { success: false, error: 'Username not found. Please check your username or sign up for a new account.' };
        }
        return { success: false, error: 'Unable to find user account. Please try again.' };
      }

      // Sign in with the user's email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userProfile.email,
        password: password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'Invalid password. Please check your password and try again.' };
        }
        if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'Please verify your email address before signing in.' };
        }
        if (error.message.includes('Too many requests')) {
          return { success: false, error: 'Too many login attempts. Please wait a moment and try again.' };
        }
        return { success: false, error: error.message || 'Login failed. Please try again.' };
      }

      if (data.user) {
        // Fetch full user profile from our custom users table
        const { data: fullProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          return { success: false, error: 'Unable to load user profile. Please try again.' };
        }

        const userData = {
          id: fullProfile.id,
          name: fullProfile.name,
          username: fullProfile.username,
          email: fullProfile.email,
          createdAt: fullProfile.created_at
        };

        setUser(userData);
        return { success: true };
      }

      return { success: false, error: 'Login failed. Please try again.' };
    } catch (error) {
      return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
  };


  const register = async (name: string, username: string, email: string, password: string): Promise<AuthResult> => {
    try {
      // Try to check if username is already taken (skip if table doesn't exist)
      try {
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('username')
          .eq('username', username)
          .single();

        if (existingUser) {
          return { success: false, error: 'Username is already taken. Please choose a different username.' };
        }

        // Check if email is already taken
        const { data: existingEmail, error: emailCheckError } = await supabase
          .from('users')
          .select('email')
          .eq('email', email)
          .single();

        if (existingEmail) {
          return { success: false, error: 'Email address is already registered. Please use a different email or try logging in.' };
        }
      } catch (tableError) {
        // If tables don't exist, skip the checks and continue with registration
        console.log('Custom tables not available, skipping duplicate checks');
      }

      // Sign up with Supabase Auth using the real email
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
            username: username
          }
        }
      });

      if (error) {
        if (error.message.includes('Password should be at least')) {
          return { success: false, error: 'Password must be at least 6 characters long.' };
        }
        if (error.message.includes('Invalid email')) {
          return { success: false, error: 'Please enter a valid email address.' };
        }
        if (error.message.includes('User already registered')) {
          return { success: false, error: 'This email is already registered. Please try logging in instead.' };
        }
        if (error.message.includes('Signup is disabled')) {
          return { success: false, error: 'Account registration is currently disabled. Please contact support.' };
        }
        return { success: false, error: error.message || 'Registration failed. Please try again.' };
      }

      if (data.user) {
        // Always create user profile records, regardless of email verification status
        try {
          // Insert user profile into our custom users table
          const { error: profileError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                name: name,
                username: username,
                email: email,
                password_hash: 'handled_by_supabase_auth'
              }
            ]);

          if (profileError) {
            console.error('Error creating user profile:', profileError);

            // If the table doesn't exist, that's okay - we'll use fallback data
            if (profileError.code === '42P01' || profileError.message.includes('relation "public.users" does not exist')) {
              console.log('Custom users table does not exist, continuing with Supabase auth only');
            } else {
              // For other errors, log but continue - don't fail registration
              console.log('User profile creation failed, but continuing with registration');
            }
          }

          // Create user profile record for extended data
          const { error: userProfileError } = await supabase
            .from('user_profiles')
            .insert([
              {
                user_id: data.user.id,
                theme: 'dawn'
              }
            ]);

          if (userProfileError) {
            console.error('Error creating user profile record:', userProfileError);
            // This is less critical, so we can continue
          }
        } catch (dbError) {
          console.error('Database error during registration:', dbError);
          // Don't fail registration for database issues - the user can still use the app with Supabase auth
          console.log('Continuing with registration despite database error');
        }

        // Check if email confirmation is required
        if (data.user && !data.session) {
          // Don't set user in state yet since they haven't verified email
          return {
            success: true,
            error: 'Registration successful! Please check your email and click the verification link to complete your account setup.'
          };
        }

        // If no email verification required, set user and proceed
        const userData = {
          id: data.user.id,
          name: name,
          username: username,
          email: email,
          createdAt: data.user.created_at || new Date().toISOString()
        };

        setUser(userData);
        return { success: true };
      }

      return { success: false, error: 'Registration failed. Please try again.' };
    } catch (error) {
      return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('user');
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if Supabase logout fails
      localStorage.removeItem('user');
      setUser(null);
      router.push('/auth/login');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
      login,
      register,
      logout
    }}>
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