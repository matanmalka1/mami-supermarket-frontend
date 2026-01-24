
import React, { useState, useEffect } from 'react';
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { useSearchParams, Link } from 'react-router';
import { Search, ArrowLeft, Filter, X, Check } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';
import { EmptyState } from '@/components/ui/Feedback';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSort, setActiveSort] = useState('Relevance');
  const [activePrefs, setActivePrefs] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setResults([
        { id: 20, name: 'Sourdough Toasting Loaf', category: 'Bakery', price: 18.00, tag: 'Matches', image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=400&q=80' },
        { id: 21, name: 'Whole Wheat Sourdough', category: 'Bakery', price: 21.00, tag: 'Matches', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80' }
      ].filter(item => item.name.toLowerCase().includes(query.toLowerCase())));
      setLoading(false);
    }, 600);
  }, [query, activeSort, activePrefs]);

  const handleApply = () => {
    setIsFilterOpen(false);
    toast.success("Search parameters applied", { icon: '🔍' });
  };

  const handleClear = () => {
    setActivePrefs([]);
    setActiveSort('Relevance');
    toast("Filters cleared", { icon: '🧹' });
  };

  const togglePref = (p: string) => {
    setActivePrefs(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b pb-12">
        <div className="space-y-4">
          <Link to="/store" className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-[#008A45] uppercase tracking-widest group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Store
          </Link>
          <div className="space-y-1">
            <h1 className="text-5xl font-black italic text-gray-900 tracking-tight">Search Results</h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">Showing results for: <span className="text-[#008A45]">"{query}"</span></p>
          </div>
        </div>
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-gray-800 transition-all active:scale-95"
        >
          <Filter size={18} /> Advanced Filters
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {[1, 2, 3, 4].map(i => <div key={i} className="aspect-square bg-gray-50 rounded-[2rem] animate-pulse" />)}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 animate-in fade-in duration-700">
          {results.map(item => <ProductCard key={item.id} item={item} />)}
        </div>
      ) : (
        <div className="py-20">
          <EmptyState 
            title="No matches found" 
            message={`We couldn't find any products matching "${query}". Try searching for categories like "Produce" or "Bakery".`} 
          />
        </div>
      )}

      {/* Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <aside className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-8 border-b flex items-center justify-between">
              <h2 className="text-2xl font-black italic">Refine Search</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              <FilterGroup title="Sort By">
                {['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest Arrivals'].map(s => (
                  <button 
                    key={s} 
                    onClick={() => setActiveSort(s)}
                    className={`w-full text-left py-2 text-sm font-bold transition-colors flex items-center justify-between ${activeSort === s ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-600'}`}
                  >
                    {s} {activeSort === s && <Check size={14} />}
                  </button>
                ))}
              </FilterGroup>
              <FilterGroup title="Dietary & Preferences">
                {['Organic Only', 'Gluten Free', 'Vegan friendly', 'On Flash Sale'].map(p => (
                  <label key={p} className="flex items-center gap-3 cursor-pointer group">
                    <div 
                      onClick={() => togglePref(p)}
                      className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${activePrefs.includes(p) ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 group-hover:border-emerald-500'}`}
                    >
                      <div className={`w-2 h-2 rounded-sm bg-emerald-500 transition-transform ${activePrefs.includes(p) ? 'scale-100' : 'scale-0'}`} />
                    </div>
                    <span className={`text-sm font-bold ${activePrefs.includes(p) ? 'text-gray-900' : 'text-gray-600'}`}>{p}</span>
                  </label>
                ))}
              </FilterGroup>
            </div>
            <div className="p-8 bg-gray-50 border-t flex gap-4">
              <Button variant="ghost" className="flex-1" onClick={handleClear}>Clear All</Button>
              <Button variant="emerald" className="flex-[2] rounded-2xl font-black italic" onClick={handleApply}>Apply Filters</Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

const FilterGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-4">
    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{title}</h4>
    <div className="space-y-3">{children}</div>
  </div>
);

export default SearchResults;
