
import React, { useState } from 'react';
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { Link, useNavigate } from 'react-router';
import { ShoppingCart, Bell, ShoppingBag, ChevronDown, MapPin, Grid as GridIcon, Lock, ShieldCheck, LayoutDashboard } from 'lucide-react';
import SearchInput from '../ui/SearchInput';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { CATEGORIES, STORE_NOTIFICATIONS } from '../../constants';
import NotifDropdown from './store-header/NotifDropdown';
import AccountDropdown from './store-header/AccountDropdown';
import DeptMegaMenu from './store-header/DeptMegaMenu';
import AvatarBadge from '../ui/AvatarBadge';

const StoreHeader: React.FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [activeMenu, setActiveMenu] = useState<'notif' | 'account' | 'dept' | null>(null);
  const { setIsOpen, items } = useCart();
  const { userRole, logout } = useAuth();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/store/search?q=${encodeURIComponent(searchValue.trim())}`);
      setActiveMenu(null);
    }
  };

  const isActuallyAdmin = userRole === 'ADMIN';

  return (
    <div className="flex flex-col sticky top-0 z-50">
      {isActuallyAdmin && (
        <div className="bg-[#003333] text-white py-2.5 px-6 flex items-center justify-between border-b border-teal-800 shadow-2xl animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500/20 p-1.5 rounded-lg border border-teal-500/30 animate-pulse">
              <ShieldCheck size={16} className="text-teal-400" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">
              System Admin Session <span className="text-teal-400 ml-2 opacity-60">• Operational Override Active</span>
            </p>
          </div>
          <Link 
            to="/" 
            onClick={() => sessionStorage.removeItem('mami_manual_store_visit')}
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-[#003333] px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-xl group"
          >
            Switch to Ops Portal <LayoutDashboard size={14} className="group-hover:rotate-12 transition-transform" />
          </Link>
        </div>
      )}

      <header className="border-b bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/store" className="flex items-center gap-2 text-[#008A45] font-black text-2xl tracking-tighter italic shrink-0" onClick={() => setActiveMenu(null)}>
              <div className="w-10 h-10 bg-[#008A45] rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-900/20">
                <ShoppingBag size={24} />
              </div>
              FRESHMARKET
            </Link>
            
            <nav className="hidden lg:flex items-center gap-1">
              <button 
                onClick={() => setActiveMenu(activeMenu === 'dept' ? null : 'dept')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeMenu === 'dept' ? 'bg-emerald-50 text-[#008A45]' : 'text-gray-400 hover:text-[#008A45]'}`}
              >
                <GridIcon size={16} /> Departments <ChevronDown size={14} className={`transition-transform duration-300 ${activeMenu === 'dept' ? 'rotate-180' : ''}`} />
              </button>
              <div className="h-4 w-px bg-gray-100 mx-2" />
              <div className="flex items-center gap-2 px-4 py-2 text-gray-400 cursor-pointer group">
                <MapPin size={16} className="text-[#008A45]" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-tighter leading-none opacity-50">Deliver to</span>
                  <span className="text-[11px] font-bold text-gray-900 group-hover:text-[#008A45] transition-colors leading-tight">Tel Aviv, IL</span>
                </div>
              </div>
            </nav>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <form onSubmit={handleSearch}>
              <SearchInput 
                variant="store" 
                placeholder="Search items..." 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </form>
          </div>

          <div className="flex items-center gap-3">
            {isActuallyAdmin && (
              <Link to="/" onClick={() => sessionStorage.removeItem('mami_manual_store_visit')} className="hidden md:flex items-center gap-2 bg-[#006666] text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-teal-900/20 hover:bg-[#005555] transition-all italic border border-teal-400/20">
                <Lock size={14} /> OPS PORTAL
              </Link>
            )}

            <div className="relative">
              <button 
                onClick={() => setActiveMenu(activeMenu === 'notif' ? null : 'notif')}
                className={`p-2.5 transition-all rounded-xl hover:bg-gray-50 ${activeMenu === 'notif' ? 'text-[#008A45] bg-emerald-50' : 'text-gray-400'}`}
              >
                <Bell size={22} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              {activeMenu === 'notif' && <NotifDropdown items={STORE_NOTIFICATIONS} onClose={() => setActiveMenu(null)} />}
            </div>

            <button onClick={() => { setIsOpen(true); setActiveMenu(null); }} className="p-2.5 text-gray-400 hover:text-[#008A45] hover:bg-gray-50 rounded-xl relative transition-all">
              <ShoppingCart size={22} />
              {items.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#008A45] text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-md">
                  {items.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </button>

            <div className="relative ml-2">
              <div 
                onClick={() => setActiveMenu(activeMenu === 'account' ? null : 'account')}
                className={`w-10 h-10 rounded-xl bg-gray-50 border-2 overflow-hidden cursor-pointer transition-all shadow-sm flex items-center justify-center ${activeMenu === 'account' ? 'border-[#008A45] ring-4 ring-emerald-50' : 'border-transparent hover:border-emerald-100'}`}
              >
                <AvatarBadge name={isActuallyAdmin ? 'Admin User' : 'Customer'} size={36} className="border-0" />
              </div>
              {activeMenu === 'account' && <AccountDropdown onClose={() => setActiveMenu(null)} userRole={userRole} onLogout={logout} />}
            </div>
          </div>
        </div>

        {activeMenu === 'dept' && <DeptMegaMenu items={CATEGORIES} onClose={() => setActiveMenu(null)} />}
      </header>
    </div>
  );
};

export default StoreHeader;
