'use client';

import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { utilityApi } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { formatDate } from '@/lib/utils';
import { api } from '@/lib/api';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact');
      if (res.data?.data?.inquiries) {
        setInquiries(res.data.data.inquiries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/contact/${id}/status`, { status });
      showToast({ type: 'success', title: 'Status Updated', message: `Marked as ${status}` });
      setInquiries(inquiries.map((inq) => (inq._id === id ? { ...inq, status } : inq)));
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Failed to update inquiry status.' });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
          Client Feedback
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1 font-display">
          Concierge Inquiries ({inquiries.length})
        </h1>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-zinc-400">Loading messages...</div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-zinc-200 text-center text-xs text-zinc-500">
            No incoming inquiries recorded.
          </div>
        ) : (
          inquiries.map((inq) => (
            <div
              key={inq._id}
              className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 gap-2">
                <div>
                  <h3 className="text-sm font-bold text-zinc-950">{inq.subject}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    From <span className="font-semibold text-zinc-800">{inq.name}</span> ({inq.email}
                    {inq.phone ? ` • ${inq.phone}` : ''}) • {formatDate(inq.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={inq.status}
                    onChange={(e) => handleUpdateStatus(inq._id, e.target.value)}
                    className="text-xs font-bold bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 uppercase"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-zinc-700 leading-relaxed whitespace-pre-wrap">{inq.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
