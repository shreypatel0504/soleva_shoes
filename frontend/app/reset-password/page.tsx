'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast({
        type: 'error',
        title: 'Mismatch',
        message: 'Passwords do not match.',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword({ token, newPassword });
      if (res.data.success) {
        setSuccess(true);
        showToast({
          type: 'success',
          title: 'Password Updated',
          message: 'You can now sign in with your new password.',
        });
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Reset Error',
        message: err.response?.data?.message || 'Invalid or expired token.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-[#EDEDED]">
      <div className="bg-[#141416] rounded-2xl p-8 sm:p-12 border border-[#222228] shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-nike text-3xl text-white tracking-tight">SET NEW PASSWORD</h1>
          <p className="text-xs text-[#8E8E93]">
            Please choose a strong password of at least 6 characters.
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-neutral-300">
              Your password has been successfully updated.
            </p>
            <Link
              href="/login"
              className="btn-nike-white text-xs px-6 py-3"
            >
              Sign In Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                New Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#18181C] border border-[#2A2A30] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#18181C] border border-[#2A2A30] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-nike-white w-full py-3.5 text-xs flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save New Password</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs">Loading reset portal...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
