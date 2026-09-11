import React from 'react';

export default function TermsAndConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Legal Agreement</span>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight mt-1 font-display">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs text-zinc-400 mt-1">Last revised: September 2026</p>
      </div>

      <div className="prose prose-zinc max-w-none text-xs sm:text-sm text-zinc-700 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-950">1. Agreement to Terms</h2>
          <p>
            By accessing the SOLEVA digital store or finalizing an order, you agree to be bound by these Terms of Service. If you do not accept these terms in full, please refrain from transacting on this platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-950">2. Product Availability &amp; Pricing</h2>
          <p>
            All products displayed on SOLEVA are subject to availability. We reserve the right to discontinue or revise the pricing of any footwear item without prior notification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-950">3. Intellectual Property</h2>
          <p>
            The SOLEVA brand identity, kinetic designs, typography, imagery, and software architecture are protected under international copyright and trademark legislation.
          </p>
        </section>
      </div>
    </div>
  );
}
