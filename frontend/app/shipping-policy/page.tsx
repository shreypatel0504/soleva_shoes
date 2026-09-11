import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8 text-[#EDEDED]">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#8E8E93]">Domestic Logistics</span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1 font-display">
          Shipping &amp; Delivery Policy (India)
        </h1>
        <p className="text-xs text-neutral-400 mt-1">Last revised: September 2026</p>
      </div>

      <div className="max-w-none text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">Complimentary Pan-India Delivery</h2>
          <p>
            SOLEVA provides free secure tracked delivery across all eligible Indian PIN codes on all orders totaling ₹14,000 or more. For orders under ₹14,000, standard flat-rate ground shipping of ₹499 is applied at checkout.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">Dispatch &amp; Delivery Timelines</h2>
          <div className="border border-[#222228] bg-[#141416] rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#18181C] text-white font-bold border-b border-[#222228]">
                <tr>
                  <th className="py-3 px-4">Logistics Partner &amp; Tier</th>
                  <th className="py-3 px-4">Estimated Delivery</th>
                  <th className="py-3 px-4">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222228]">
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Standard Ground Courier (Delhivery / Shadowfax)</td>
                  <td className="py-3 px-4">3–5 Business Days</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">Free over ₹14,000 / ₹499 flat</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">Priority Blue Dart Air Express</td>
                  <td className="py-3 px-4">1–2 Business Days</td>
                  <td className="py-3 px-4 text-white font-semibold">₹750 flat</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">OTP &amp; Tamper-Evident Delivery</h2>
          <p>
            To protect your luxury footwear investments, our courier partners require an OTP (One-Time Password) sent to your registered mobile number upon delivery at your doorstep.
          </p>
        </section>
      </div>
    </div>
  );
}
