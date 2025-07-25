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
  register: (name: string, username: string, password: string) => Promise<boolean>;
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
      // Convert username to email format for Supabase auth
      const email = `${username}@levelup.local`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) throw error;

      if (data.user) {
        // Fetch user profile from our custom users table
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          return false;
        }

        const userData = {
          id: userProfile.id,
          name: userProfile.name,
          username: userProfile.username,
          email: userProfile.email,
          createdAt: userProfile.created_at
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


  const register = async (name: string, username: string, password: string): Promise<boolean> => {
    try {
      // First, sign up with Supabase Auth using username as email (temporary approach)
      const email = `${username}@levelup.local`; // Create a pseudo-email from username

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

      if (error) throw error;

      if (data.user) {
        // Insert user profile into our custom users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              name: name,
              username: username,
              email: email,
              password_hash: 'handled_by_supabase_auth' // Placeholder since Supabase handles this
            }
          ]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Don't fail registration if profile creation fails
        }

        // Create user profile record
        await supabase
          .from('user_profiles')
          .insert([
            {
              user_id: data.user.id,
              theme: 'dawn'
            }
          ]);

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