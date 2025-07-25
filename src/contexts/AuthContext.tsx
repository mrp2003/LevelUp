"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'

interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (name: string, username: string, email: string, password: string) => Promise<boolean>;
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
          // Fetch user profile when signed in
          const { data: userProfile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userProfile) {
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
        // Fetch user profile from your users table
        const { data: userProfile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
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

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // First, find the user by username to get their email
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('email, id')
        .eq('username', username)
        .single();

      if (userError || !userProfile) {
        console.error('User not found:', userError);
        console.error('Searching for username:', username);
        console.error('Error details:', JSON.stringify(userError, null, 2));
        return false;
      }

      // Sign in with the user's email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userProfile.email,
        password: password
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      if (data.user) {
        // Fetch full user profile from our custom users table
        const { data: fullProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          return false;
        }

        const userData = {
          id: fullProfile.id,
          name: fullProfile.name,
          username: fullProfile.username,
          email: fullProfile.email,
          createdAt: fullProfile.created_at
        };

        setUser(userData);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };


  const register = async (name: string, username: string, email: string, password: string): Promise<boolean> => {
    try {
      // First, check if username is already taken
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        console.error('Username already taken');
        return false;
      }

      // Check if email is already taken
      const { data: existingEmail, error: emailCheckError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      if (existingEmail) {
        console.error('Email already taken');
        return false;
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
        console.error('Supabase auth signup error:', error);
        return false;
      }

      if (data.user) {
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
            console.error('Profile error details:', JSON.stringify(profileError, null, 2));
            // For now, continue with registration even if custom table fails
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
            console.error('User profile error details:', JSON.stringify(userProfileError, null, 2));
            // Don't fail registration if this fails
          }
        } catch (dbError) {
          console.error('Database error during registration:', dbError);
          // Continue with registration using Supabase auth data only
        }

        const userData = {
          id: data.user.id,
          name: name,
          username: username,
          email: email,
          createdAt: data.user.created_at || new Date().toISOString()
        };

        setUser(userData);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
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