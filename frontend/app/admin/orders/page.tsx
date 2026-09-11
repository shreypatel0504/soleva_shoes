'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Search,
  ChevronDown,
  Eye,
  CheckCircle2,
  Clock,
  X,
  Loader2,
  Package,
} from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import { adminApi } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { formatCurrency, formatDate } from '@/lib/utils';

const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Returned',
  'Refunded',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Selected order details modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const res = await adminApi.getOrders(params);
      if (res.data?.data?.orders) {
        setOrders(res.data.data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setStatusUpdateLoading(true);
    try {
      const res = await adminApi.updateOrderStatus(orderId, newStatus);
      if (res.data?.data?.order) {
        showToast({
          type: 'success',
          title: 'Order Updated',
          message: `Order marked as ${newStatus}`,
        });
        setOrders(orders.map((o) => (o._id === orderId ? res.data.data.order : o)));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.data.data.order);
        }
      }
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Failed to update order status.' });
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleUpdatePayment = async (orderId: string, newPayment: string) => {
    try {
      const res = await adminApi.updatePaymentStatus(orderId, newPayment);
      if (res.data?.data?.order) {
        showToast({
          type: 'success',
          title: 'Payment Status Updated',
          message: `Payment status marked as ${newPayment}`,
        });
        setOrders(orders.map((o) => (o._id === orderId ? res.data.data.order : o)));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.data.data.order);
        }
      }
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Failed to update payment status.' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
          Fulfillment Operations
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1 font-display">
          Client Orders ({orders.length})
        </h1>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-3 flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, recipient name, or email..."
            className="w-full bg-transparent text-xs text-zinc-900 placeholder-zinc-400 outline-none"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto appearance-none bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 pr-8 text-xs font-bold text-zinc-800 focus:outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Items</th>
                <th className="py-3.5 px-6">Total</th>
                <th className="py-3.5 px-6">Order Status</th>
                <th className="py-3.5 px-6">Payment</th>
                <th className="py-3.5 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-400">
                    Loading orders ledger...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-400">
                    No orders matched your search or status criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-zinc-950 font-mono">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-6 text-zinc-500">{formatDate(order.createdAt)}</td>
                    <td className="py-3.5 px-6">
                      <p className="font-bold text-zinc-900">{order.shippingAddress?.fullName}</p>
                      <p className="text-[11px] text-zinc-400">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                    </td>
                    <td className="py-3.5 px-6 font-semibold">
                      {order.items.reduce((sum, i) => sum + i.quantity, 0)} pairs
                    </td>
                    <td className="py-3.5 px-6 font-black text-zinc-950">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="relative inline-block">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          className={`appearance-none font-extrabold text-[10px] px-3 py-1 pr-6 rounded-full uppercase cursor-pointer border ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : order.orderStatus === 'Cancelled'
                              ? 'bg-red-50 text-red-800 border-red-200'
                              : 'bg-brand-50 text-brand-700 border-brand-200'
                          }`}
                        >
                          {ORDER_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => handleUpdatePayment(order._id, e.target.value)}
                        className={`text-[10px] font-bold uppercase rounded-lg px-2 py-0.5 border bg-white ${
                          order.paymentStatus === 'paid'
                            ? 'text-emerald-700 border-emerald-200'
                            : 'text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-zinc-500 hover:text-zinc-950 rounded-lg hover:bg-zinc-100"
                        title="View Full Order"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-zinc-200 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-600">
                  Order Details
                </span>
                <h3 className="text-lg font-bold text-zinc-950">
                  #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Items */}
              <div>
                <h4 className="font-bold text-zinc-900 uppercase tracking-wider mb-2">
                  Items ({selectedOrder.items.length})
                </h4>
                <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-2xl p-3 bg-zinc-50">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="py-2 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg bg-white overflow-hidden flex-shrink-0">
                        <Image src={it.image} alt={it.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-zinc-900">{it.name}</p>
                        <p className="text-zinc-500">Size {it.size} • Color {it.color} • Qty {it.quantity}</p>
                      </div>
                      <span className="font-extrabold text-zinc-950">{formatCurrency(it.total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                <h4 className="font-bold text-zinc-900 uppercase tracking-wider mb-1">
                  Recipient Information
                </h4>
                <p className="font-bold text-zinc-800">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-zinc-600">{selectedOrder.shippingAddress.address}</p>
                <p className="text-zinc-600">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pincode}
                </p>
                <p className="text-zinc-500 pt-1">
                  {selectedOrder.shippingAddress.email} • {selectedOrder.shippingAddress.phone}
                </p>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-zinc-900">{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Shipping</span>
                  <span className="font-bold text-zinc-900">{formatCurrency(selectedOrder.shippingFee)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Tax</span>
                  <span className="font-bold text-zinc-900">{formatCurrency(selectedOrder.tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-zinc-950 pt-2 border-t border-zinc-200">
                  <span>Grand Total</span>
                  <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
