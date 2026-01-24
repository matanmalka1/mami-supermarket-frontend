
import React, { useState } from 'react';
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { NavLink, Outlet, useNavigate } from 'react-router';
import { Package, MapPin, User, LogOut, ChevronRight, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AvatarBadge from '@/components/ui/AvatarBadge';

interface AccountLayoutProps {
  onLogout: () => void;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(true);

  const menuItems = [
    { label: 'My Orders', icon: Package, path: 'orders' },
    { label: 'Addresses', icon: MapPin, path: 'addresses' },
    { label: 'Profile Settings', icon: User, path: 'settings' },
  ];

  const togglePremium = () => {
    setIsPremium(!isPremium);
    toast.success(isPremium ? "Membership downgraded to Standard" : "Welcome to Premium Membership!", {
      icon: isPremium ? '⚪' : '💎',
      style: { borderRadius: '1rem', fontWeight: 'bold' }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-12 gap-12">
      <aside className="col-span-12 lg:col-span-3 space-y-8">
        <div className="bg-gray-50/50 rounded-[2.5rem] p-8 space-y-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="relative">
               <AvatarBadge name="John Doe" size={64} className="rounded-2xl border-4 border-white shadow-md" />
               {isPremium && (
                 <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#008A45] rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
                   <Star size={12} fill="currentColor" />
                 </div>
               )}
            </div>
            <div>
              <h2 className="font-black text-xl italic tracking-tight">John Doe</h2>
              <button 
                onClick={togglePremium}
                className={`text-[10px] font-black uppercase tracking-widest transition-all ${isPremium ? 'text-[#008A45] hover:underline' : 'text-gray-400 hover:text-emerald-600'}`}
              >
                {isPremium ? 'Premium Member' : 'Standard Account'}
              </button>
            </div>
          </div>
          
          <nav className="space-y-1">
            {menuItems.map(item => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({ isActive }) => `
                  flex items-center justify-between p-4 rounded-2xl transition-all font-bold group
                  ${isActive ? 'bg-white text-[#008A45] shadow-md border border-emerald-50' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="text-sm">{item.label}</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            ))}
          </nav>

          <button 
            onClick={() => { onLogout(); navigate('/login'); }}
            className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 font-bold transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>

        {isPremium && (
          <div className="p-8 bg-emerald-900 text-white rounded-[2.5rem] shadow-xl space-y-4 relative overflow-hidden group">
             <Star size={120} className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform" />
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Premium Perk</h4>
             <p className="text-sm font-bold italic leading-relaxed">You're currently saving ₪45.00 on delivery fees this month.</p>
          </div>
        )}
      </aside>

      <main className="col-span-12 lg:col-span-9 animate-in fade-in duration-700">
        <Outlet />
      </main>
    </div>
  );
};

export default AccountLayout;
