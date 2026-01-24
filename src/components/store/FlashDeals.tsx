import React, { useState, useEffect } from 'react';
import { Timer, Zap } from 'lucide-react';
import ProductCard from './ProductCard';

const DEAL_ITEMS = [
  { id: 5, name: 'Imported Hass Avocados (2pk)', category: 'Produce', price: 9.90, oldPrice: 15.00, tag: '50% OFF', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400&q=80' },
  { id: 6, name: 'Cold Pressed Orange Juice', category: 'Drinks', price: 12.50, oldPrice: 18.90, tag: 'Deal', image: 'https://images.unsplash.com/photo-1624517535389-c967a6114251?auto=format&fit=crop&w=400&q=80' }
];

const FlashDeals: React.FC = () => {
  const [timeLeft] = useState('02:45:12');

  return (
    <section className="bg-orange-50 rounded-[3rem] p-12 space-y-10 border border-orange-100">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-orange-600 font-black uppercase text-xs tracking-widest">
            <Zap size={16} fill="currentColor" /> Flash Deals
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight italic">Ending Soon</h2>
        </div>
        <div className="bg-white px-8 py-4 rounded-3xl border border-orange-200 shadow-sm flex items-center gap-4">
          <Timer size={24} className="text-orange-500" />
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-gray-900 tabular-nums">{timeLeft}</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Remaining</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {DEAL_ITEMS.map(item => <ProductCard key={item.id} item={item} />)}
        <div className="hidden lg:flex bg-white/50 backdrop-blur rounded-[2rem] border border-orange-200/50 flex-col items-center justify-center p-8 text-center space-y-4">
          <h4 className="font-black text-xl text-orange-800">More Deals<br/>Coming Up!</h4>
          <p className="text-xs font-bold text-orange-600/60 uppercase">Check back in 3 hours</p>
        </div>
      </div>
    </section>
  );
};

export default FlashDeals;
