
import React from 'react';
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { Link } from 'react-router';
import { ChevronDown } from 'lucide-react';

interface DeptMegaMenuProps {
  items: any[];
  onClose: () => void;
}

const DeptMegaMenu: React.FC<DeptMegaMenuProps> = ({ items, onClose }) => (
  <div className="absolute top-full left-0 right-0 bg-white border-b shadow-2xl animate-in slide-in-from-top-4 duration-300">
    <div className="max-w-7xl mx-auto p-12 grid grid-cols-4 gap-12">
      <div className="col-span-1 space-y-6">
        <h3 className="text-2xl font-black italic tracking-tight">Grocery<br/>Departments</h3>
        <p className="text-sm font-medium text-gray-400 leading-relaxed">Browse our carefully curated selection of local and organic products.</p>
        <Link to="/store" onClick={onClose} className="inline-flex items-center gap-2 text-xs font-black text-[#008A45] uppercase tracking-widest group">
          View All Products <ChevronDown size={14} className="-rotate-90 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className="col-span-3 grid grid-cols-3 gap-6">
        {items.map(cat => (
          <Link key={cat.id} to={`/store/category/${cat.id}`} onClick={onClose} className="flex items-center gap-4 p-6 rounded-3xl bg-gray-50 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all group">
            <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
            <div>
              <p className="font-black text-sm text-gray-900 group-hover:text-[#008A45]">{cat.name}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shop items</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
    <div className="bg-emerald-900 py-3 text-center">
      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Free 1-hour delivery for premium members on orders over ₪150</p>
    </div>
  </div>
);

export default DeptMegaMenu;
