import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Legal Compliance</span>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight mt-1 font-display">
          Privacy Policy
        </h1>
        <p className="text-xs text-zinc-400 mt-1">Last revised: September 2026</p>
      </div>

      <div className="prose prose-zinc max-w-none text-xs sm:text-sm text-zinc-700 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-950">1. Information We Collect</h2>
          <p>
            SOLEVA collects information you provide directly to us when creating a member profile, completing an order, subscribing to the newsletter, or contacting our concierge. This data includes your name, email, delivery coordinates, and purchase selections.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-950">2. Utilization of Data</h2>
          <p>
            We deploy collected data strictly to process and dispatch footwear orders, issue transactional confirmations, prevent fraudulent payment activities, and provide curated product releases.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-950">3. Payment Information Security</h2>
          <p>
            Payment transactions are processed through tokenized, encrypted PCI-DSS Level 1 payment gateways. SOLEVA never stores raw credit card numbers or security CVV codes on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-950">4. Cookies &amp; Local Storage</h2>
          <p>
            We use essential session cookies and browser storage solely to preserve your shopping bag contents, wishlist preferences, and authenticated session tokens.
          </p>
        </section>
      </div>
    </div>
  );
}
