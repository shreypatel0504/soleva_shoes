'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login({ email, password });
    setLoading(false);
    if (success) {
      router.push('/account');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 text-[#EDEDED]">
      <div className="bg-[#141416] rounded-2xl p-8 sm:p-12 border border-[#222228] shadow-2xl max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <svg viewBox="0 0 48 24" fill="currentColor" className="w-8 h-4 text-white">
              <path d="M4 18 C 14 18, 26 12, 44 2 C 34 8, 20 14, 10 14 C 7 14, 4 16, 4 18 Z" />
            </svg>
            <span className="text-2xl font-black tracking-tighter text-white font-nike">
              SOLEVA
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            YOUR ACCOUNT FOR EVERYTHING SOLEVA
          </h1>
          <p className="text-xs text-neutral-400">
            Access your orders, saved sizes, and private member perks.
          </p>
        </div>

        {/* Quick Demo Credentials */}
        <div className="bg-[#18181C] p-3 rounded-xl border border-[#25252C] space-y-2">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block text-center">
            Quick Demo Accounts (Click to Autofill)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('customer@example.com');
                setPassword('Customer@123');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-[#222228] hover:bg-white hover:text-black transition-all text-left text-[11px] border border-white/5"
            >
              <span className="font-bold block text-white">Customer</span>
              <span className="text-[10px] text-neutral-400 block truncate">customer@example.com</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@soleva.com');
                setPassword('Admin@123456');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-[#222228] hover:bg-white hover:text-black transition-all text-left text-[11px] border border-white/5"
            >
              <span className="font-bold block text-[#CCFF00]">Admin Lab</span>
              <span className="text-[10px] text-neutral-400 block truncate">admin@soleva.com</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#18181C] border border-[#2A2A30] rounded-lg pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-neutral-400 hover:text-white underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#18181C] border border-[#2A2A30] rounded-lg pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-nike-white w-full py-3.5"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              <span>Sign In</span>
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-[#222228] text-xs text-neutral-400">
          Not yet a member?{' '}
          <Link href="/register" className="font-semibold text-white hover:underline">
            Join Us
          </Link>
        </div>
      </div>
    </div>
  );
}
