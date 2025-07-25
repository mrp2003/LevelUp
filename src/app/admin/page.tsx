"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('admin-logged-in') === 'true';
    if (isAdminLoggedIn) {
      router.push('/admin-settings');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
      const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'levelup2025';

      if (credentials.username === ADMIN_USERNAME && credentials.password === ADMIN_PASSWORD) {
        localStorage.setItem('admin-logged-in', 'true');
        localStorage.setItem('admin-login-time', Date.now().toString());
        router.push('/admin-settings');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center px-4 z-50">
      <div className="max-w-sm w-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-3">Admin Access</h2>
          <p className="text-zinc-400 text-base">Authorized personnel only</p>
        </div>

        <div className="bg-zinc-800/80 backdrop-blur-md border border-zinc-700/50 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              required
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
              placeholder="Username"
            />
            <input
              type="password"
              required
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
              placeholder="Password"
            />

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:from-orange-600 hover:to-pink-700 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 text-base"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}