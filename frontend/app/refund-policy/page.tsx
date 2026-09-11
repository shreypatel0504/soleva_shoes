import React from 'react';

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Client Assurance</span>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight mt-1 font-display">
          Returns &amp; Refund Policy
        </h1>
        <p className="text-xs text-zinc-400 mt-1">Last revised: September 2026</p>
      </div>

      <div className="prose prose-zinc max-w-none text-xs sm:text-sm text-zinc-700 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-950">30-Day Guaranteed Returns</h2>
          <p>
            We take tremendous pride in the precision assembly of every pair of SOLEVA shoes. If you are not completely thrilled with the fit, aesthetics, or performance, you may return your unworn items within 30 days of delivery for a full refund or size exchange.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-950">Return Conditions</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Footwear must be in unworn condition with original shoebox and tags intact.</li>
            <li>We encourage trying shoes indoors on clean carpeted surfaces.</li>
            <li>Customized or final archive sale items are not eligible for refunds.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-950">Refund Processing Timeline</h2>
          <p>
            Once our fulfillment center inspects your return, refunds are credited back to your original payment method within 3–5 business days.
          </p>
        </section>
      </div>
    </div>
  );
}
