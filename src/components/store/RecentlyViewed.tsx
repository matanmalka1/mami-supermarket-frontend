import React, { useState, useEffect } from 'react';
import { History, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { toast } from 'react-hot-toast';

const MOCK_RECENT = [
  { id: 7, name: 'Almond Flour (1kg)', category: 'Pantry', price: 45.00, tag: 'Viewed', image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=400&q=80' },
  { id: 8, name: 'Extra Virgin Olive Oil', category: 'Pantry', price: 38.00, tag: 'Viewed', image: 'https://images.unsplash.com/photo-1474979266404-7eaacabc88c5?auto=format&fit=crop&w=400&q=80' }
];

const RecentlyViewed: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('mami_recent_items');
    setItems(saved ? JSON.parse(saved) : MOCK_RECENT);
  }, []);

  const handleClear = () => {
    setItems([]);
    localStorage.removeItem('mami_recent_items');
    toast.success("History cleared", { style: { borderRadius: '1rem', fontWeight: 'bold' } });
  };

  if (items.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100">
            <History size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 ">Recently Viewed</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pick up where you left off</p>
          </div>
        </div>
        <button 
          onClick={handleClear}
          className="text-gray-400 hover:text-[#008A45] font-black text-xs uppercase tracking-widest flex items-center gap-2 group transition-all"
        >
          Clear History <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      <div className="flex gap-10 overflow-x-auto pb-4 no-scrollbar">
        {items.map(item => (
          <div key={item.id} className="min-w-[280px]">
            <ProductCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;