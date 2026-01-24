import React, { useState } from 'react';
import { Star, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';

const ProductTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Specifications');

  const specs = [
    { label: 'Dimensions', value: '78cm W x 82cm H x 74cm D' },
    { label: 'Designer', value: 'Helle Mardahl Studio' },
    { label: 'Material', value: 'Solid White Oak, Kvadrat Wool' },
    { label: 'Weight Capacity', value: 'Up to 150 kg' },
    { label: 'Assembly', value: 'Fully Assembled' },
    { label: 'Weight', value: '14.5 kg' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Specifications':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-24 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {specs.map((spec, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 md:border-0">
                <span className="text-sm font-medium text-gray-400">{spec.label}</span>
                <span className="text-sm font-bold text-gray-900">{spec.value}</span>
              </div>
            ))}
          </div>
        );
      case 'Details & Care':
        return (
          <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-gray-600 leading-relaxed font-medium">This product is crafted from natural oak. For maintenance, use a damp cloth and mild soap. Avoid direct sunlight to prevent wood discoloration.</p>
            <div className="flex gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100"><ShieldCheck className="text-emerald-600 mb-2" size={20} /><p className="text-[10px] font-black uppercase">Sustainable Wood</p></div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100"><RefreshCcw className="text-blue-600 mb-2" size={20} /><p className="text-[10px] font-black uppercase">100% Recyclable</p></div>
            </div>
          </div>
        );
      case 'Reviews (124)':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {[1, 2].map(i => (
              <div key={i} className="space-y-2 border-b border-gray-50 pb-6">
                <div className="flex text-emerald-500 gap-1"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
                <h4 className="font-bold text-gray-900">Absolute masterpiece</h4>
                <p className="text-sm text-gray-500 font-medium">The quality of the oak is exceptional. Fits perfectly in my minimalist living room.</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Verified Buyer • 2 days ago</p>
              </div>
            ))}
          </div>
        );
      case 'Shipping & Returns':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0"><Truck size={20} /></div>
              <div><p className="font-bold text-gray-900">Free Express Shipping</p><p className="text-sm text-gray-500 font-medium">Delivered within 3-5 business days across Israel.</p></div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shrink-0"><RefreshCcw size={20} /></div>
              <div><p className="font-bold text-gray-900">30-Day Easy Returns</p><p className="text-sm text-gray-500 font-medium">Not happy with your chair? We'll pick it up for free.</p></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border-t border-gray-100 pt-12">
      <div className="flex gap-12 border-b border-gray-50 mb-12 overflow-x-auto no-scrollbar whitespace-nowrap">
        {['Specifications', 'Details & Care', 'Reviews (124)', 'Shipping & Returns'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab ? 'text-emerald-600' : 'text-gray-300 hover:text-gray-500'
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
          </button>
        ))}
      </div>
      <div className="min-h-[200px]">{renderContent()}</div>
    </div>
  );
};

export default ProductTabs;