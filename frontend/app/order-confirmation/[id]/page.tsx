'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Package, Truck, ArrowRight, Printer, Home } from 'lucide-react';
import { Order } from '@/lib/types';
import { orderApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function OrderConfirmationPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    orderApi
      .getOrderById(id)
      .then((res) => {
        if (res.data?.data?.order) {
          setOrder(res.data.data.order);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch order confirmation', err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-pulse space-y-4">
        <div className="w-16 h-16 bg-zinc-200 rounded-full mx-auto" />
        <div className="h-8 w-64 bg-zinc-200 rounded mx-auto" />
        <div className="h-4 w-48 bg-zinc-200 rounded mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Order Not Located</h2>
        <p className="text-xs text-zinc-500 mb-6">Could not retrieve details for this order ID.</p>
        <Link href="/" className="px-6 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-bold uppercase">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10 text-[#EDEDED]">
      {/* Success Hero Header */}
      <div className="text-center space-y-3 bg-[#141416] rounded-2xl p-8 sm:p-12 border border-[#222228] shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#8E8E93]">
          Payment Verified
        </span>
        <h1 className="font-nike text-3xl sm:text-5xl text-white tracking-tight">
          THANK YOU FOR YOUR ORDER
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
          We have received your order <span className="font-bold text-white">#{order.orderNumber}</span>. A detailed confirmation invoice has been sent to {order.shippingAddress.email}.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => window.print()}
            className="btn-nike-black text-xs px-6 py-2.5 flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
          <Link
            href="/shop"
            className="btn-nike-white text-xs px-6 py-2.5 flex items-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Explore More</span>
          </Link>
        </div>
      </div>

      {/* Order Summary & Logistics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Items (7 cols) */}
        <div className="md:col-span-7 bg-[#141416] rounded-2xl p-6 sm:p-8 border border-[#222228] shadow-sm space-y-6">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white border-b border-[#222228] pb-3">
            Purchased Footwear
          </h3>
          <div className="divide-y divide-[#222228]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl bg-[#18181C] border border-[#26262E] overflow-hidden flex-shrink-0 p-1">
                  <Image src={item.image || '/products/apexlab/orange_profile.jpg'} alt={item.name} fill className="object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                  <p className="text-[11px] text-[#8E8E93] mt-0.5">
                    Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                  </p>
                </div>
                <span className="text-xs font-bold text-white">
                  {formatCurrency(item.total)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-[#222228] text-xs text-neutral-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-white">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping ({order.deliveryOption.title})</span>
              <span className="font-bold text-white">{formatCurrency(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax</span>
              <span className="font-bold text-white">{formatCurrency(order.tax)}</span>
            </div>
            <div className="pt-2 border-t border-[#222228] flex justify-between items-center text-sm font-bold text-white">
              <span>Total Paid</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Right: Shipping & Timeline (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          {/* Shipping Address */}
          <div className="bg-[#141416] rounded-2xl p-6 border border-[#222228] shadow-sm space-y-2 text-xs">
            <h3 className="font-extrabold uppercase tracking-wider text-white mb-2">
              Dispatch Destination
            </h3>
            <p className="font-bold text-white">{order.shippingAddress.fullName}</p>
            <p className="text-neutral-300">{order.shippingAddress.address}</p>
            {order.shippingAddress.apartment && (
              <p className="text-neutral-300">{order.shippingAddress.apartment}</p>
            )}
            <p className="text-neutral-300">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
            </p>
            <p className="text-neutral-300">{order.shippingAddress.country}</p>
            <p className="text-neutral-500 pt-2">{order.shippingAddress.phone}</p>
          </div>

          {/* Timeline Status */}
          <div className="bg-[#141416] rounded-2xl p-6 border border-[#222228] shadow-sm space-y-4 text-xs">
            <h3 className="font-extrabold uppercase tracking-wider text-white">
              Logistics Status: <span className="text-white font-bold">{order.orderStatus}</span>
            </h3>
            <div className="space-y-3">
              {order.timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-white mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-white">{item.status}</p>
                    {item.note && <p className="text-neutral-400 text-[11px]">{item.note}</p>}
                    <p className="text-[10px] text-neutral-500 mt-0.5">{formatDate(item.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
