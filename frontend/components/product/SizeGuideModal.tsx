'use client';

import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIZE_CHART = [
  { us: '7', uk: '6', eu: '40', cm: '25.0' },
  { us: '7.5', uk: '6.5', eu: '40.5', cm: '25.5' },
  { us: '8', uk: '7', eu: '41', cm: '26.0' },
  { us: '8.5', uk: '7.5', eu: '42', cm: '26.5' },
  { us: '9', uk: '8', eu: '42.5', cm: '27.0' },
  { us: '9.5', uk: '8.5', eu: '43', cm: '27.5' },
  { us: '10', uk: '9', eu: '44', cm: '28.0' },
  { us: '10.5', uk: '9.5', eu: '44.5', cm: '28.5' },
  { us: '11', uk: '10', eu: '45', cm: '29.0' },
  { us: '11.5', uk: '10.5', eu: '45.5', cm: '29.5' },
  { us: '12', uk: '11', eu: '46', cm: '30.0' },
  { us: '13', uk: '12', eu: '47.5', cm: '31.0' },
];

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'US' | 'UK' | 'EU' | 'CM'>('US');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141416] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-[#28282E] text-white">
        {/* Header */}
        <div className="p-6 border-b border-[#222228] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Ruler className="w-5 h-5 text-white" />
            <h3 className="text-lg font-bold tracking-tight text-white">SOLEVA Size Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-[#222228] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <p className="text-xs text-[#8E8E93] leading-relaxed">
            SOLEVA silhouettes run true to standard athletic sizing. If you possess a wider forefoot or prefer a relaxed toe-box fit, we advise selecting a half-size larger.
          </p>

          {/* Table */}
          <div className="border border-[#28282E] rounded-xl overflow-hidden bg-[#18181C]">
            <table className="w-full text-center text-xs">
              <thead className="bg-[#202026] text-white font-bold border-b border-[#28282E]">
                <tr>
                  <th className="py-2.5 px-3">US</th>
                  <th className="py-2.5 px-3">UK / India</th>
                  <th className="py-2.5 px-3">EU</th>
                  <th className="py-2.5 px-3">Foot Length (CM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#24242A] font-medium text-neutral-300">
                {SIZE_CHART.map((row) => (
                  <tr key={row.us} className="hover:bg-[#222228] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-white">{row.us}</td>
                    <td className="py-2.5 px-3">{row.uk}</td>
                    <td className="py-2.5 px-3">{row.eu}</td>
                    <td className="py-2.5 px-3 text-[#8E8E93]">{row.cm} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-[#18181C] border border-[#28282E] text-xs text-[#8E8E93]">
            <p className="font-bold text-white mb-1">How to Measure Your Foot Length:</p>
            <p>
              Step onto a flat sheet of paper with your heel against a wall. Trace the tip of your longest toe and measure the distance in centimeters.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-[#222228] bg-[#111114] text-right">
          <button
            onClick={onClose}
            className="btn-nike-white text-xs px-6 py-2.5"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
