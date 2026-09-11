'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getDashboardStats()
      .then((res) => {
        if (res.data?.data) {
          setStats(res.data.data);
        }
      })
      .catch((err) => console.error('Admin stats fetch error', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-zinc-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-zinc-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: 'text-brand-500',
      bg: 'bg-brand-50',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      title: 'Active Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
  ];

  const secondaryKpis = [
    { title: 'Pending Orders', value: stats?.pendingOrders || 0, icon: Clock, color: 'text-amber-600' },
    { title: 'Completed Orders', value: stats?.completedOrders || 0, icon: CheckCircle2, color: 'text-emerald-600' },
    { title: 'Low Stock Alerts (≤5)', value: stats?.lowStockProducts || 0, icon: AlertTriangle, color: 'text-red-600' },
  ];

  const monthlySales = stats?.monthlySales || [];
  const maxRevenue = Math.max(...monthlySales.map((m: any) => m.revenue), 1000);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
            Operations &amp; Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1 font-display">
            Executive Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-zinc-950 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{kpi.title}</p>
                <p className="text-2xl sm:text-3xl font-black text-zinc-950 mt-1">{kpi.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Status Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {secondaryKpis.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.title}
              className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center gap-3"
            >
              <Icon className={`w-5 h-5 ${sec.color} flex-shrink-0`} />
              <div>
                <span className="text-xs text-zinc-500">{sec.title}:</span>{' '}
                <span className="text-sm font-extrabold text-zinc-950 ml-1">{sec.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue & Sales Trend Chart (Visual Bar Visualization) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-950">Monthly Revenue &amp; Orders Velocity</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Aggregated performance across rolling 6 months</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-brand-600">
              <span className="w-3 h-3 rounded-full bg-brand-500" /> Revenue
            </span>
            <span className="flex items-center gap-1.5 text-zinc-600">
              <span className="w-3 h-3 rounded-full bg-zinc-900" /> Order Volume
            </span>
          </div>
        </div>

        {/* Chart Bars */}
        <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-64 pt-6 border-b border-zinc-100">
          {monthlySales.map((month: any, idx: number) => {
            const heightPercent = Math.max(8, (month.revenue / maxRevenue) * 100);
            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] text-zinc-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {formatCurrency(month.revenue)} ({month.orders})
                </div>
                <div className="w-full flex items-end justify-center gap-1 h-full max-h-48">
                  {/* Revenue Bar */}
                  <div
                    className="w-1/2 bg-brand-500 rounded-t-lg transition-all duration-500 group-hover:bg-brand-600"
                    style={{ height: `${heightPercent}%` }}
                  />
                  {/* Orders Bar */}
                  <div
                    className="w-1/3 bg-zinc-900 rounded-t-lg transition-all duration-500 group-hover:bg-black"
                    style={{ height: `${Math.min(100, Math.max(10, month.orders * 20))}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-zinc-600">{month.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Overview Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-6 pb-0 flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-950">Recent Customer Transactions</h3>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-y border-zinc-100 font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-3 px-6">Order #</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700 font-medium">
              {stats?.recentOrders?.map((order: any) => (
                <tr key={order._id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-zinc-900">
                    <Link href={`/admin/orders`} className="hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3.5 px-6">
                    <p className="font-semibold text-zinc-900">{order.shippingAddress?.fullName || 'Customer'}</p>
                    <p className="text-[11px] text-zinc-400">{order.shippingAddress?.email}</p>
                  </td>
                  <td className="py-3.5 px-6 text-zinc-500">{formatDate(order.createdAt)}</td>
                  <td className="py-3.5 px-6 font-extrabold text-zinc-900">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-brand-50 text-brand-700 border border-brand-200'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 uppercase text-[10px] font-bold text-emerald-600">
                    {order.paymentStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
