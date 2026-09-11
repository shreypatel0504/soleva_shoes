'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { utilityApi } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await utilityApi.submitInquiry(formData);
      setSubmitted(true);
      showToast({
        type: 'success',
        title: 'Message Transmitted',
        message: 'A client advisor will reach out to you within 24 hours.',
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Submission Error',
        message: err.response?.data?.message || 'Failed to submit inquiry. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 text-[#EDEDED]">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8E8E93]">
          Concierge Services
        </span>
        <h1 className="font-nike text-4xl sm:text-6xl text-white tracking-tight leading-tight">
          WE&apos;RE HERE TO ASSIST
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Have an inquiry regarding footwear sizing, custom client orders, or international logistics? Our specialized concierges are at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#141416] border border-[#222228] text-white shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight">SOLEVA Atelier &amp; Flagship</h3>
            <div className="space-y-4 text-xs text-neutral-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                <p>
                  UB City, Level 14, Concorde Block, Vittal Mallya Road<br />
                  Bengaluru, Karnataka 560001, India
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-white flex-shrink-0" />
                <p>+91 1800 209 8888 (Toll Free) / +91 80 4123 9000</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white flex-shrink-0" />
                <p>concierge@soleva.in</p>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                <p>
                  Monday – Saturday: 10:00 – 20:00 IST<br />
                  Sunday: 11:00 – 18:00 IST
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#141416] border border-[#222228] shadow-sm space-y-3 text-xs text-neutral-400">
            <h4 className="font-bold text-white">Immediate Logistics Support</h4>
            <p>
              Looking to track a recent dispatch or initiate a return? You can also review your orders directly within the{' '}
              <a href="/account?tab=orders" className="text-white font-bold underline">
                Member Portal
              </a>
              .
            </p>
          </div>
        </div>

        {/* Right Column: Contact Inquiry Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#141416] rounded-2xl p-8 sm:p-12 border border-[#222228] shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Message Received</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Thank you. Your inquiry has been routed to our client relations team.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-nike-white text-xs px-6 py-2.5"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-[#18181C] border border-[#2A2A30] rounded-xl px-4 py-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="aarav.sharma@example.com"
                    className="w-full bg-[#18181C] border border-[#2A2A30] rounded-xl px-4 py-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#18181C] border border-[#2A2A30] rounded-xl px-4 py-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Sizing inquiry, order status, etc."
                    className="w-full bg-[#18181C] border border-[#2A2A30] rounded-xl px-4 py-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our footwear advisors assist you today?"
                  className="w-full bg-[#18181C] border border-[#2A2A30] rounded-xl px-4 py-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white resize-none transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-nike-white w-full py-4 text-xs tracking-wider flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Transmit Inquiry</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
