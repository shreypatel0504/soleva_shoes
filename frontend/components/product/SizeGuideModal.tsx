'use client';

import React, { useState, useEffect } from 'react';
import { X, Ruler, Shirt, Footprints } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'footwear' | 'clothing';
}

const FOOTWEAR_CHART = [
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

const APPAREL_CHART = [
  { size: 'XS', chestCm: '82 - 88', waistCm: '66 - 72', hipsCm: '84 - 90', chestIn: '32 - 34', waistIn: '26 - 28' },
  { size: 'S', chestCm: '88 - 96', waistCm: '72 - 80', hipsCm: '90 - 98', chestIn: '35 - 38', waistIn: '29 - 31' },
  { size: 'M', chestCm: '96 - 104', waistCm: '80 - 88', hipsCm: '98 - 106', chestIn: '38 - 41', waistIn: '32 - 34' },
  { size: 'L', chestCm: '104 - 112', waistCm: '88 - 96', hipsCm: '106 - 114', chestIn: '41 - 44', waistIn: '35 - 38' },
  { size: 'XL', chestCm: '112 - 124', waistCm: '96 - 108', hipsCm: '114 - 124', chestIn: '44 - 48', waistIn: '38 - 42' },
  { size: 'XXL', chestCm: '124 - 136', waistCm: '108 - 120', hipsCm: '124 - 134', chestIn: '48 - 53', waistIn: '42 - 47' },
];

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'footwear',
}) => {
  const [activeTab, setActiveTab] = useState<'footwear' | 'clothing'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141416] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-[#28282E] text-white">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#222228] flex items-center justify-between">
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

        {/* Tab Switcher */}
        <div className="flex border-b border-[#222228] bg-[#0E0E10]">
          <button
            onClick={() => setActiveTab('footwear')}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors border-b-2 ${
              activeTab === 'footwear'
                ? 'border-white text-white bg-[#141416]'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Footprints className="w-4 h-4" />
            <span>Footwear (UK / US / EU)</span>
          </button>
          <button
            onClick={() => setActiveTab('clothing')}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors border-b-2 ${
              activeTab === 'clothing'
                ? 'border-white text-white bg-[#141416]'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Apparel &amp; Clothing (XS - XXL)</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {activeTab === 'footwear' ? (
            <>
              <p className="text-xs text-[#8E8E93] leading-relaxed">
                SOLEVA athletic footwear is engineered to standard international sizing. If you have a wider foot or prefer additional toe-box room for long-distance training, we recommend sizing up a half size.
              </p>

              {/* Footwear Table */}
              <div className="border border-[#28282E] rounded-xl overflow-hidden bg-[#18181C]">
                <table className="w-full text-center text-xs">
                  <thead className="bg-[#202026] text-white font-bold border-b border-[#28282E]">
                    <tr>
                      <th className="py-2.5 px-3">US</th>
                      <th className="py-2.5 px-3 text-white font-black">UK / India</th>
                      <th className="py-2.5 px-3">EU</th>
                      <th className="py-2.5 px-3">Foot Length (CM)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#24242A] font-medium text-neutral-300">
                    {FOOTWEAR_CHART.map((row) => (
                      <tr key={row.us} className="hover:bg-[#222228] transition-colors">
                        <td className="py-2.5 px-3 font-bold text-white">{row.us}</td>
                        <td className="py-2.5 px-3 text-white font-semibold">{row.uk}</td>
                        <td className="py-2.5 px-3">{row.eu}</td>
                        <td className="py-2.5 px-3 text-[#8E8E93]">{row.cm} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-xl bg-[#18181C] border border-[#28282E] text-xs text-[#8E8E93]">
                <p className="font-bold text-white mb-1">How to Measure Your Foot:</p>
                <p>
                  Place your heel against a flat wall on a sheet of paper. Mark the tip of your longest toe and measure the distance in centimeters.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-[#8E8E93] leading-relaxed">
                SOLEVA performance and lifestyle apparel follows standard athletic cuts. For a tailored, aerodynamic fit, select your true size. For a streetwear relaxed drape, size up one size.
              </p>

              {/* Clothing Table */}
              <div className="border border-[#28282E] rounded-xl overflow-hidden bg-[#18181C]">
                <table className="w-full text-center text-xs">
                  <thead className="bg-[#202026] text-white font-bold border-b border-[#28282E]">
                    <tr>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Chest (cm)</th>
                      <th className="py-2.5 px-3">Waist (cm)</th>
                      <th className="py-2.5 px-3">Hips (cm)</th>
                      <th className="py-2.5 px-3">Chest (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#24242A] font-medium text-neutral-300">
                    {APPAREL_CHART.map((row) => (
                      <tr key={row.size} className="hover:bg-[#222228] transition-colors">
                        <td className="py-2.5 px-3 font-bold text-white">{row.size}</td>
                        <td className="py-2.5 px-3">{row.chestCm}</td>
                        <td className="py-2.5 px-3">{row.waistCm}</td>
                        <td className="py-2.5 px-3">{row.hipsCm}</td>
                        <td className="py-2.5 px-3 text-[#8E8E93]">{row.chestIn}&quot;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-xl bg-[#18181C] border border-[#28282E] text-xs text-[#8E8E93] space-y-1.5">
                <p className="font-bold text-white">How to Measure Apparel:</p>
                <p><strong className="text-white">Chest:</strong> Measure around the fullest part of your chest, keeping the measuring tape horizontal.</p>
                <p><strong className="text-white">Waist:</strong> Measure around your natural waistline, typically the narrowest point of your torso.</p>
                <p><strong className="text-white">Hips:</strong> Measure around the fullest part of your hips, standing with feet together.</p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
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
