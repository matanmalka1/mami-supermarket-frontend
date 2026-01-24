import React, { useState } from 'react';
import { Link, Outlet } from 'react-router';
import StoreHeader from './StoreHeader';
import Breadcrumbs from '../ui/Breadcrumbs';
import Modal from '../ui/Modal';
import { Lock } from 'lucide-react';
import { CATEGORIES } from '../../core/constants';

const StoreLayout: React.FC = () => {
  const [infoModal, setInfoModal] = useState<{ isOpen: boolean; title: string } | null>(null);

  const handleStaticLink = (label: string) => {
    setInfoModal({ isOpen: true, title: label });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <StoreHeader />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <Breadcrumbs />
        <Outlet />
      </main>
      <footer className="bg-gray-50 border-t py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="space-y-6">
              <h4 className="font-black text-sm uppercase tracking-widest">Departments</h4>
              <ul className="text-sm text-gray-500 space-y-3 font-medium">
                {CATEGORIES.slice(0, 4).map(cat => (
                  <li key={cat.id}>
                    <Link to={`/store/category/${cat.id}`} className="hover:text-[#008A45] transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="font-black text-sm uppercase tracking-widest">About FreshMarket</h4>
              <ul className="text-sm text-gray-500 space-y-3 font-medium">
                <li onClick={() => handleStaticLink('Our Mission')} className="hover:text-[#008A45] cursor-pointer transition-colors">Our Mission</li>
                <li onClick={() => handleStaticLink('Verified Farmers')} className="hover:text-[#008A45] cursor-pointer transition-colors">Verified Farmers</li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="font-black text-sm uppercase tracking-widest">Client Care</h4>
              <ul className="text-sm text-gray-500 space-y-3 font-medium">
                <li><Link to="/store/account/settings" className="hover:text-[#008A45] transition-colors">Help Center</Link></li>
                <li><Link to="/store/account/orders" className="hover:text-[#008A45] transition-colors">Track Delivery</Link></li>
              </ul>
            </div>
            <div className="space-y-10">
              <div className="space-y-4">
                <h4 className="font-black text-sm uppercase tracking-widest">Internal Access</h4>
                <Link to="/" className="inline-flex items-center gap-2 bg-[#008A45]/5 text-[#008A45] px-4 py-2.5 rounded-xl text-xs font-black hover:bg-[#008A45]/10 transition-all italic border border-emerald-100">
                  <Lock size={14} /> OPS PORTAL
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <Modal isOpen={!!infoModal} onClose={() => setInfoModal(null)} title={infoModal?.title || 'Information'}>
        <div className="py-6 space-y-4">
          <p className="text-gray-500 text-sm leading-relaxed">
            Detailed documentation regarding {infoModal?.title.toLowerCase()} is available in our portal.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default StoreLayout;