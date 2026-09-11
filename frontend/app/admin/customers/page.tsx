'use client';

import React, { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, X } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCustomers({ search });
      if (res.data?.data?.customers) {
        setCustomers(res.data.data.customers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleToggleStatus = async (customer: any) => {
    try {
      const res = await adminApi.toggleCustomerStatus(customer._id);
      if (res.data?.data?.user) {
        const updated = res.data.data.user;
        showToast({
          type: 'success',
          title: 'Customer Status Updated',
          message: `${customer.name} is now ${updated.isActive ? 'Active' : 'Deactivated'}`,
        });
        setCustomers(
          customers.map((c) => (c._id === customer._id ? { ...c, isActive: updated.isActive } : c))
        );
      }
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Failed to update customer status.' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
          Client Relations
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1 font-display">
          Registered Customers ({customers.length})
        </h1>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or telephone number..."
          className="w-full bg-transparent text-xs text-zinc-900 placeholder-zinc-400 outline-none"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-zinc-400 hover:text-zinc-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Phone</th>
                <th className="py-3.5 px-6">Member Since</th>
                <th className="py-3.5 px-6">Total Orders</th>
                <th className="py-3.5 px-6">Lifetime Spend</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    Loading customer roster...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    No customers found matching search query.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900">{c.name}</p>
                          <p className="text-[11px] text-zinc-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-zinc-600">{c.phone || '—'}</td>
                    <td className="py-3.5 px-6 text-zinc-500">{formatDate(c.createdAt)}</td>
                    <td className="py-3.5 px-6 font-bold text-zinc-900">{c.orderCount || 0} orders</td>
                    <td className="py-3.5 px-6 font-black text-zinc-950">
                      {formatCurrency(c.totalSpent || 0)}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => handleToggleStatus(c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          c.isActive
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {c.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
