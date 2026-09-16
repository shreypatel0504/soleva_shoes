'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Package,
  Heart,
  MapPin,
  KeyRound,
  LogOut,
  Plus,
  Trash2,
  Loader2,
  Eye,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { orderApi, authApi } from '@/lib/api';
import { Order } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ProductCard } from '@/components/product/ProductCard';

function AccountContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const { user, token, logout, updateUser } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Profile edit form
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Address form modal/toggle
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [token, activeTab, router]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await orderApi.getMyOrders();
      if (res.data?.data?.orders) {
        setOrders(res.data.data.orders);
      }
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Unable to load orders.' });
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await authApi.updateProfile({ name: profileName, phone: profilePhone });
      if (res.data?.data?.user) {
        updateUser(res.data.data.user);
        showToast({ type: 'success', title: 'Profile Updated', message: 'Your member profile has been saved.' });
      }
    } catch {
      showToast({ type: 'error', title: 'Update Failed', message: 'Could not update profile.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast({ type: 'error', title: 'Weak Password', message: 'Password must be at least 6 characters.' });
      return;
    }

    setPasswordLoading(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      showToast({ type: 'success', title: 'Password Changed', message: 'Your credentials have been securely updated.' });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Change Failed',
        message: err.response?.data?.message || 'Current password was incorrect.',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authApi.addAddress(newAddress);
      if (res.data?.data?.addresses && user) {
        updateUser({ ...user, addresses: res.data.data.addresses });
        setIsAddingAddress(false);
        setNewAddress({
          fullName: '',
          phone: '',
          street: '',
          apartment: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India',
        });
        showToast({ type: 'success', title: 'Address Saved', message: 'New shipping address added.' });
      }
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Failed to add address.' });
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const res = await authApi.deleteAddress(addressId);
      if (res.data?.data?.addresses && user) {
        updateUser({ ...user, addresses: res.data.data.addresses });
        showToast({ type: 'info', title: 'Address Removed', message: 'Address has been deleted.' });
      }
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Failed to delete address.' });
    }
  };

  if (!user) return null;

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'orders', label: 'Order History', icon: Package, badge: orders.length },
    { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, badge: wishlistItems.length },
    { id: 'addresses', label: 'Shipping Addresses', icon: MapPin, badge: user.addresses?.length || 0 },
    { id: 'security', label: 'Password & Security', icon: KeyRound },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16 text-[#EDEDED]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-[#222228] gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Hello, {user.name}
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">{user.email}</p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-lg border border-[#2D2D35] bg-[#141416] text-xs font-semibold text-neutral-300 hover:text-white hover:border-white transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Account Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left py-3 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-white text-black shadow-md font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-[#18181C]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-neutral-800 text-white' : 'bg-[#222228] text-neutral-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Pane (9 cols) */}
        <div className="lg:col-span-9 bg-[#141416] rounded-2xl p-6 sm:p-10 border border-[#222228] shadow-2xl">
          {/* TAB 1: Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-bold text-white">Personal Information</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Update your account name and phone.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-[#18181C] border border-[#2A2A30] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Email Address (Read-Only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-[#111114] border border-[#222228] rounded-lg px-4 py-2.5 text-xs text-neutral-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-[#18181C] border border-[#2A2A30] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="btn-nike-white px-6 py-3 text-xs flex items-center gap-2"
                  >
                    {profileLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Order History</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Track and review past footwear purchases.</p>
              </div>

              {ordersLoading ? (
                <div className="py-12 text-center text-xs text-neutral-500 animate-pulse">
                  Loading order records...
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-400 space-y-3">
                  <p>You haven&apos;t placed any footwear orders yet.</p>
                  <Link
                    href="/shop"
                    className="btn-nike-white inline-block text-xs py-2.5"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="p-5 rounded-xl border border-[#222228] bg-[#18181C] hover:border-[#383842] transition-colors space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#222228] gap-2">
                        <div>
                          <span className="text-xs font-bold text-white">
                            #{order.orderNumber}
                          </span>
                          <span className="text-neutral-400 text-xs ml-2">
                            • Placed {formatDate(order.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-white">
                            {formatCurrency(order.totalAmount)}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                              order.orderStatus === 'Delivered'
                                ? 'bg-green-500/20 text-green-400'
                                : order.orderStatus === 'Cancelled'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-white/10 text-white'
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                          <Link
                            href={`/order-confirmation/${order._id}`}
                            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-[#222228]"
                            title="View Invoice"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>

                      {/* Items Snapshot */}
                      <div className="flex flex-wrap gap-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-[#141416] rounded-lg p-2 pr-3 border border-[#222228]">
                            <div className="relative w-10 h-10 rounded overflow-hidden bg-[#18181C] flex-shrink-0">
                              <Image src={item.image || '/products/apexlab/orange_profile.jpg'} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="text-[11px]">
                              <p className="font-bold text-white truncate max-w-[120px]">{item.name}</p>
                              <p className="text-neutral-400">Size {item.size} • Qty {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Saved Wishlist</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Footwear silhouettes you are watching.</p>
              </div>

              {wishlistItems.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-400 space-y-3">
                  <p>Your wishlist is currently empty.</p>
                  <Link
                    href="/shop"
                    className="btn-nike-white inline-block text-xs py-2.5"
                  >
                    Discover Footwear
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistItems.map((prod) => (
                    <ProductCard key={prod._id} product={prod} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Shipping Addresses</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">Manage default delivery destinations.</p>
                </div>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="btn-nike-white text-xs px-4 py-2 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              {/* Add Address Form */}
              {isAddingAddress && (
                <form onSubmit={handleAddAddress} className="p-5 rounded-xl bg-[#18181C] border border-[#26262E] space-y-3 animate-fade-in">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">Add New Shipping Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Recipient Full Name"
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      className="bg-[#141416] border border-[#2E2E36] rounded-lg px-3.5 py-2 text-xs text-white placeholder-neutral-500"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="bg-[#141416] border border-[#2E2E36] rounded-lg px-3.5 py-2 text-xs text-white placeholder-neutral-500"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Street Address"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="sm:col-span-2 bg-[#141416] border border-[#2E2E36] rounded-lg px-3.5 py-2 text-xs text-white placeholder-neutral-500"
                    />
                    <input
                      type="text"
                      placeholder="Apartment / Suite"
                      value={newAddress.apartment}
                      onChange={(e) => setNewAddress({ ...newAddress, apartment: e.target.value })}
                      className="bg-[#141416] border border-[#2E2E36] rounded-lg px-3.5 py-2 text-xs text-white placeholder-neutral-500"
                    />
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="bg-[#141416] border border-[#2E2E36] rounded-lg px-3.5 py-2 text-xs text-white placeholder-neutral-500"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="bg-[#141416] border border-[#2E2E36] rounded-lg px-3.5 py-2 text-xs text-white placeholder-neutral-500"
                    />
                    <input
                      type="text"
                      required
                      placeholder="PIN Code (6 digits)"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      className="bg-[#141416] border border-[#2E2E36] rounded-lg px-3.5 py-2 text-xs text-white placeholder-neutral-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="btn-nike-outline text-xs px-4 py-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-nike-white text-xs px-5 py-2"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Address Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses?.map((addr) => (
                  <div key={addr._id} className="p-5 rounded-xl border border-[#222228] bg-[#18181C] relative group space-y-1 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{addr.fullName}</span>
                      {addr._id && (
                        <button
                          onClick={() => handleDeleteAddress(addr._id!)}
                          className="text-neutral-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-neutral-300">{addr.street || addr.address}</p>
                    {addr.apartment && <p className="text-neutral-400">{addr.apartment}</p>}
                    <p className="text-neutral-300">{addr.city}, {addr.state} {addr.pincode}</p>
                    <p className="text-neutral-500 pt-1">{addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Security */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-bold text-white">Change Password</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Ensure your account uses a strong password.</p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#18181C] border border-[#2A2A30] rounded-lg px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#18181C] border border-[#2A2A30] rounded-lg px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="btn-nike-white px-6 py-3 text-xs flex items-center gap-2"
                  >
                    {passwordLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto py-20 text-center text-xs text-neutral-400">Loading member portal...</div>}>
      <AccountContent />
    </Suspense>
  );
}
