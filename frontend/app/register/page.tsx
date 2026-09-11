'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast({
        type: 'error',
        title: 'Password Mismatch',
        message: 'The password and confirmation password do not match.',
      });
      return;
    }

    if (password.length < 6) {
      showToast({
        type: 'error',
        title: 'Weak Password',
        message: 'Password must be at least 6 characters.',
      });
      return;
    }

    setLoading(true);
    const success = await register({ name, email, phone, password });
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
            BECOME A SOLEVA MEMBER
          </h1>
          <p className="text-xs text-neutral-400">
            Create your Soleva Member profile and get first access to the very best of products and athletic community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Full Name *
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-neutral-500 absolute left-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Miller"
                className="w-full bg-[#18181C] border border-[#2A2A30] rounded-lg pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Email Address *
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Phone Number (Optional)
            </label>
            <div className="relative flex items-center">
              <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full bg-[#18181C] border border-[#2A2A30] rounded-lg pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Password *
            </label>
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

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Confirm Password *
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              <span>Join Us</span>
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-[#222228] text-xs text-neutral-400">
          Already have a member account?{' '}
          <Link href="/login" className="font-semibold text-white hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
