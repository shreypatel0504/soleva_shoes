'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Check,
  CreditCard,
  Building,
  ArrowRight,
  Loader2,
  Lock,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { orderApi, couponApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Address State
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.addresses?.[0]?.street || user?.addresses?.[0]?.address || '',
    apartment: user?.addresses?.[0]?.apartment || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    pincode: user?.addresses?.[0]?.pincode || '',
    country: user?.addresses?.[0]?.country || 'India',
  });

  // Step 2: Delivery Option State
  const [deliveryOption, setDeliveryOption] = useState({
    id: 'standard',
    title: 'Standard Ground Delivery (India)',
    price: subtotal >= 14000 ? 0 : 499,
    estimatedDays: '3-5 Business Days',
  });

  useEffect(() => {
    if (deliveryOption.id === 'standard') {
      const price = subtotal >= 14000 ? 0 : 499;
      setDeliveryOption((prev) => ({
        ...prev,
        title: 'Standard Ground Delivery (India)',
        price,
      }));
    }
  }, [subtotal, deliveryOption.id]);

  // Step 3: Payment State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('customer@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardDetails] = useState({
    cardNumber: '4242 •••• •••• 4242',
    expDate: '12/28',
    cvv: '•••',
    nameOnCard: user?.name || 'Aarav Sharma',
  });

  // Coupon & Promo State
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: string;
    discountValue: number;
    discountAmount: number;
  } | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await couponApi.validateCoupon(couponCode.trim(), subtotal);
      if (res.data?.success && res.data?.data) {
        setAppliedCoupon(res.data.data);
        showToast({
          type: 'success',
          title: 'Coupon Applied!',
          message: `Promo code ${res.data.data.code} applied successfully!`,
        });
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Invalid Promo Code',
        message: err.response?.data?.message || 'Invalid or expired coupon code.',
      });
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const estimatedTax = Math.round(taxableAmount * 0.18);
  const shippingFee = deliveryOption.price;
  const grandTotal = taxableAmount + shippingFee;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.email || !address.address || !address.city || !address.pincode) {
      showToast({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please complete all mandatory address fields.',
      });
      return;
    }
    setStep(2);
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;

    setLoading(true);
    try {
      const orderPayload = {
        items: items.map((item) => ({
          product: typeof item.product === 'object' ? item.product._id : item.product,
          name: item.name,
          image: item.image,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          email: address.email,
          address: address.address,
          apartment: address.apartment,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          country: address.country,
        },
        deliveryOption: {
          id: deliveryOption.id,
          title: deliveryOption.title,
          price: deliveryOption.price,
          estimatedDays: deliveryOption.estimatedDays,
        },
        paymentMethod:
          paymentMethod === 'card'
            ? 'Credit Card'
            : paymentMethod === 'upi'
            ? 'UPI / NetBanking'
            : paymentMethod === 'cod'
            ? 'Cash on Delivery'
            : 'Credit Card',
        couponCode: appliedCoupon?.code || undefined,
        shippingFee,
        tax: estimatedTax,
        discount,
        subtotal,
        total: grandTotal,
      };

      const res = await orderApi.createOrder(orderPayload);
      if (res.data?.success && res.data?.data?.order) {
        const createdOrder = res.data.data.order;
        await clearCart();
        showToast({
          type: 'success',
          title: 'Order Placed Successfully!',
          message: `Order #${createdOrder.orderNumber || createdOrder._id.slice(-6)} has been registered.`,
        });
        router.push(`/order-confirmation/${createdOrder._id}`);
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Order Processing Failed',
        message: err.response?.data?.message || 'Unable to place order. Please check payment information.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 text-[#EDEDED]">
      {/* Checkout Progress Steps */}
      <div className="max-w-xl mx-auto mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#222228] -translate-y-1/2 -z-10" />

          {/* Step 1 */}
          <div className="flex flex-col items-center bg-[#0C0C0E] px-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= 1
                  ? 'bg-white text-black shadow-md'
                  : 'bg-[#18181C] text-neutral-500 border border-[#2D2D35]'
              }`}
            >
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <span className="text-xs font-semibold mt-1 text-white">Address</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center bg-[#0C0C0E] px-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= 2
                  ? 'bg-white text-black shadow-md'
                  : 'bg-[#18181C] text-neutral-500 border border-[#2D2D35]'
              }`}
            >
              {step > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <span className="text-xs font-semibold mt-1 text-white">Delivery</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center bg-[#0C0C0E] px-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= 3
                  ? 'bg-white text-black shadow-md'
                  : 'bg-[#18181C] text-neutral-500 border border-[#2D2D35]'
              }`}
            >
              3
            </div>
            <span className="text-xs font-semibold mt-1 text-white">Payment</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">
        {/* Left Column: Multi-Step Forms (7 cols) */}
        <div className="lg:col-span-7 bg-[#141416] rounded-2xl p-6 sm:p-10 border border-[#222228] shadow-2xl">
          {/* STEP 1: Shipping Address */}
          {step === 1 && (
            <form onSubmit={handleAddressSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">1. Shipping Address</h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Where should we dispatch your crafted footwear?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-[#18181C] border border-[#2A2A30] rounded-lg px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    placeholder="aarav.sharma@example.com"
                    className="w-full bg-[#18181C] border border-[#2A2A30] rounded-lg px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Phone Number (India +91) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#18181C] border border-[#2A2A30] rounded-lg px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Flat / House No., Building, Street *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    placeholder="Flat 402, Sea Green Apartments, Linking Road"
                    className="w-full bg-[#18181C] border border-[#2A2A30] rounded-lg px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Area / Locality / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={address.apartment}
                    onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                    placeholder="Near Mehboob Studio, Bandra West"
                    className="w-full bg-[#18181C] border border-[#2A2A30] rounded-lg px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="Mumbai"
                    className="w-full bg-[#18181C] border border-[#2A2A30] rounded-lg px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="Maharashtra"
                    className="w-full bg-[#18181C] border border-[#2A2A30] rounded-lg px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    PIN Code (6 Digits) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    placeholder="400050"
                    className="w-full bg-[#18181C] border border-[#2A2A30] rounded-lg px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Country *
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="India"
                    className="w-full bg-[#18181C]/70 border border-[#2A2A30] rounded-lg px-4 py-3 text-xs text-white/80 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="btn-nike-white px-8 py-3.5 flex items-center gap-2"
                >
                  <span>Continue to Delivery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Delivery Option */}
          {step === 2 && (
            <form onSubmit={handleDeliverySubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">2. Delivery Schedule (India)</h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Select your dispatch speed across all Indian postal zones.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: 'standard',
                    title: 'Standard Ground Delivery',
                    price: subtotal > 14000 ? 0 : 499,
                    estimatedDays: '3-5 Business Days',
                    desc: 'Tracked surface transit with sealed tamper-proof packaging across India.',
                  },
                  {
                    id: 'express',
                    title: 'Blue Dart / Delhivery Air Express',
                    price: 750,
                    estimatedDays: '1-2 Business Days',
                    desc: 'Priority air courier with OTP-verified delivery to your doorstep.',
                  },
                ].map((opt) => {
                  const isSelected = deliveryOption.id === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setDeliveryOption(opt)}
                      className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-white bg-[#1C1C22]'
                          : 'border-[#2A2A32] bg-[#18181C] hover:border-neutral-500'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                            isSelected
                              ? 'border-white bg-white text-black'
                              : 'border-neutral-600'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{opt.title}</p>
                          <p className="text-xs text-neutral-400 mt-0.5">{opt.desc}</p>
                          <p className="text-xs font-semibold text-white mt-1">
                            Estimated: {opt.estimatedDays}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-white">
                        {opt.price === 0 ? 'FREE' : formatCurrency(opt.price)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  &larr; Back to Address
                </button>
                <button
                  type="submit"
                  className="btn-nike-white px-8 py-3.5 flex items-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Payment & Authorization */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">3. Indian Payment Methods</h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  RBI Compliant &amp; 256-bit encrypted transaction gateway.
                </p>
              </div>

              {/* Payment Method Selector Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: '⚡' },
                  { id: 'card', label: 'Card / RuPay', icon: '💳' },
                  { id: 'netbanking', label: 'Net Banking', icon: '🏛️' },
                  { id: 'cod', label: 'Cash on Delivery', icon: '📦' },
                ].map((item) => {
                  const isActive = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id as any)}
                      className={`p-3 rounded-xl border-2 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                        isActive
                          ? 'border-white bg-white text-black shadow-md'
                          : 'border-[#2A2A32] bg-[#18181C] text-neutral-300 hover:border-neutral-500'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* UPI Form */}
              {paymentMethod === 'upi' && (
                <div className="p-5 rounded-xl bg-[#18181C] border border-[#26262E] space-y-4">
                  <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-[#26262E]">
                    <span className="flex items-center gap-1.5 text-white font-semibold">
                      <Lock className="w-3.5 h-3.5 text-green-400" />
                      Instant UPI Gateway (Google Pay / PhonePe / Paytm / Cred)
                    </span>
                    <span className="text-[10px] bg-green-950/60 text-green-400 border border-green-800 px-2 py-0.5 rounded font-medium">
                      0% Payment Fee
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Enter UPI ID / VPA
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="mobile-number@upi or name@okhdfcbank"
                        className="w-full bg-[#141416] border border-[#2E2E36] rounded-lg px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[11px] text-neutral-500 self-center mr-1">Supported handles:</span>
                    {['@okhdfcbank', '@okaxis', '@okicici', '@paytm', '@ybl'].map((handle) => (
                      <button
                        key={handle}
                        type="button"
                        onClick={() => {
                          const prefix = upiId.includes('@') ? upiId.split('@')[0] : upiId || 'customer';
                          setUpiId(`${prefix}${handle}`);
                        }}
                        className="text-[10px] bg-[#222228] text-neutral-300 hover:text-white px-2 py-1 rounded border border-[#2E2E36]"
                      >
                        {handle}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    A payment request will be sent to your UPI app once you authorize this order.
                  </p>
                </div>
              )}

              {/* Card Inputs Mock */}
              {paymentMethod === 'card' && (
                <div className="p-5 rounded-xl bg-[#18181C] border border-[#26262E] space-y-4">
                  <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-[#26262E]">
                    <span className="flex items-center gap-1.5 text-white font-semibold">
                      <Lock className="w-3.5 h-3.5 text-green-400" />
                      RuPay, Visa, Mastercard, Maestro Accepted
                    </span>
                    <span className="text-[10px] bg-[#24242C] px-2 py-0.5 rounded font-mono text-neutral-300">
                      RBI 2FA Verified
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      disabled
                      value={cardDetails.cardNumber}
                      className="w-full bg-[#141416] border border-[#2E2E36] rounded-lg px-4 py-2.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        Expires
                      </label>
                      <input
                        type="text"
                        disabled
                        value={cardDetails.expDate}
                        className="w-full bg-[#141416] border border-[#2E2E36] rounded-lg px-4 py-2.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="text"
                        disabled
                        value={cardDetails.cvv}
                        className="w-full bg-[#141416] border border-[#2E2E36] rounded-lg px-4 py-2.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking */}
              {paymentMethod === 'netbanking' && (
                <div className="p-5 rounded-xl bg-[#18181C] border border-[#26262E] space-y-4">
                  <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-[#26262E]">
                    <span className="flex items-center gap-1.5 text-white font-semibold">
                      <Building className="w-3.5 h-3.5 text-blue-400" />
                      Select Bank for Net Banking
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                          selectedBank === bank
                            ? 'border-white bg-[#222228] text-white font-bold'
                            : 'border-[#2A2A32] bg-[#141416] text-neutral-400 hover:text-white'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cash on Delivery */}
              {paymentMethod === 'cod' && (
                <div className="p-5 rounded-xl bg-[#18181C] border border-[#26262E] space-y-2">
                  <p className="text-xs font-bold text-white flex items-center gap-2">
                    <span>📦</span> Cash / UPI on Delivery Available
                  </p>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Pay securely using Cash or scan the courier delivery agent&apos;s dynamic UPI QR code upon arrival at your doorstep. Please keep exact change or your UPI app handy.
                  </p>
                </div>
              )}

              {/* Confirm Shipping Details Summary */}
              <div className="p-4 rounded-xl bg-[#18181C] border border-[#26262E] text-xs text-neutral-300 space-y-1">
                <p className="font-bold text-white">Delivering to:</p>
                <p>{address.fullName} • {address.address}, {address.city}, {address.state} - {address.pincode}, India</p>
                <p className="text-white font-semibold">{deliveryOption.title} ({deliveryOption.estimatedDays})</p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  &larr; Back to Delivery
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handlePlaceOrder}
                  className="btn-nike-white px-8 py-4 text-xs sm:text-sm font-semibold flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Authorize &amp; Place Order ({formatCurrency(grandTotal)})</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 bg-[#141416] rounded-2xl p-6 sm:p-8 border border-[#222228] shadow-2xl space-y-6">
          <h2 className="text-lg font-bold tracking-tight text-white border-b border-[#222228] pb-4">
            Items in Order ({items.length})
          </h2>

          <div className="divide-y divide-[#1F1F24] max-h-80 overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-lg bg-[#18181C] border border-[#24242A] overflow-hidden flex-shrink-0">
                  <Image src={item.image || '/products/apexlab/orange_profile.jpg'} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                  <p className="text-[11px] text-neutral-400">
                    Size: {item.size} • Qty: {item.quantity}
                  </p>
                </div>
                <span className="text-xs font-bold text-white">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Promo / Coupon Code Section */}
          <div className="pt-2">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <span>✓</span>
                  <span>Code <strong>{appliedCoupon.code}</strong> applied (-{formatCurrency(appliedCoupon.discountAmount)})</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-neutral-400 hover:text-white text-xs underline ml-2"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Promo code (e.g. WELCOME10)"
                  className="flex-1 bg-[#18181C] border border-[#2A2A32] rounded-xl px-3 py-2 text-xs text-white uppercase placeholder:normal-case placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={couponLoading || !couponCode.trim()}
                  className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-40"
                >
                  {couponLoading ? 'Checking...' : 'Apply'}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-2.5 pt-4 border-t border-[#222228] text-xs text-neutral-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Promo Discount ({appliedCoupon?.code})</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping ({deliveryOption.title})</span>
              <span className="font-semibold text-white">
                {deliveryOption.price === 0 ? 'FREE' : formatCurrency(deliveryOption.price)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GST (18% Included)</span>
              <span className="font-semibold text-white">{formatCurrency(Math.round(taxableAmount * (0.18 / 1.18)))}</span>
            </div>

            <div className="pt-3 border-t border-[#222228] flex justify-between items-end">
              <span className="text-sm font-bold uppercase text-white">Total</span>
              <span className="text-2xl font-bold text-white">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
