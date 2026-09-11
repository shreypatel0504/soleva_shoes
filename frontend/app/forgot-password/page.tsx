'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { authApi } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoToken, setDemoToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      setSubmitted(true);
      if (res.data?.data?.resetToken) {
        setDemoToken(res.data.data.resetToken);
      }
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-[#EDEDED]">
      <div className="bg-[#141416] rounded-2xl p-8 sm:p-12 border border-[#222228] shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-nike text-3xl text-white tracking-tight">RESET PASSWORD</h1>
          <p className="text-xs text-[#8E8E93]">
            Enter your account email to receive secure recovery instructions.
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-neutral-300">
              If an account with <span className="font-bold text-white">{email}</span> exists, we have generated recovery instructions.
            </p>
            {demoToken && (
              <div className="p-3 bg-[#18181C] border border-[#28282E] rounded-xl text-left space-y-2">
                <p className="text-[11px] font-bold text-neutral-400">Local Simulation Token:</p>
                <Link
                  href={`/reset-password?token=${demoToken}`}
                  className="block text-xs font-mono text-white underline break-all hover:text-neutral-300"
                >
                  Click here to proceed to password reset
                </Link>
              </div>
            )}
            <Link
              href="/login"
              className="inline-block text-xs font-bold text-white hover:text-neutral-300 underline"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Account Email
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
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
              <span>Send Recovery Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
