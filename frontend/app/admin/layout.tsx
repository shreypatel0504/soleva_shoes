'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/account');
      }
    }
  }, [user, isAdmin, isLoading, router]);

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 text-xs font-bold text-zinc-500">
        Verifying administrator credentials...
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex bg-zinc-100/70 text-zinc-900">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-obsidian-950 text-white flex flex-col justify-between hidden md:flex flex-shrink-0 border-r border-zinc-800">
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-xl font-black tracking-tighter font-display text-white">
              SOLEVA
            </Link>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-brand-500 text-white">
              ADMIN
            </span>
          </div>

          <div className="pt-2 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Management</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-zinc-800/80 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors pt-2 border-t border-zinc-800/40 text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Admin Nav Strip */}
        <div className="md:hidden bg-obsidian-950 text-white p-4 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">SOLEVA Admin</span>
            <span className="text-[9px] bg-brand-500 px-1.5 py-0.5 rounded text-white font-bold">PORTAL</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xs text-zinc-400 hover:text-white">Store</Link>
            <button onClick={logout} className="text-xs text-red-400">Exit</button>
          </div>
        </div>

        {/* Horizontal Mobile Subnav */}
        <div className="md:hidden flex items-center overflow-x-auto bg-white border-b border-zinc-200 px-4 py-2 gap-2 text-xs font-bold">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                  isActive ? 'bg-zinc-950 text-white' : 'text-zinc-600 bg-zinc-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
