
import React, { useState } from "react";
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { Link } from "react-router";
import OpsSidebar from "./layout/OpsSidebar";
import OpsHeader from "./layout/OpsHeader";
import StoreHeader from "./layout/StoreHeader";
import Breadcrumbs from "./ui/Breadcrumbs";
import Modal from "./ui/Modal";
import { Lock, Instagram, Twitter, Facebook, Info } from "lucide-react";
import { useCatalogCategories } from "@/hooks/useCatalogCategories";

interface LayoutProps {
  children: React.ReactNode;
  mode: 'ops' | 'store';
  userRole?: 'ADMIN' | 'USER' | null;
}

const Layout: React.FC<LayoutProps> = ({ children, mode, userRole }) => {
  const [infoModal, setInfoModal] = useState<{ isOpen: boolean; title: string } | null>(null);
  const { categories, loading } = useCatalogCategories();

  const handleStaticLink = (label: string) => {
    setInfoModal({ isOpen: true, title: label });
  };

  if (mode === 'store') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Fix: StoreHeader handles its own auth state via hook, removing invalid prop to fix IntrinsicAttributes error */}
        <StoreHeader />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
          <Breadcrumbs />
          {children}
        </main>
        <footer className="bg-gray-50 border-t py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
              <div className="space-y-6">
                <h4 className="font-black text-sm uppercase tracking-widest">Departments</h4>
                {loading ? (
                  <p className="text-sm text-gray-400 font-bold">Loading departments...</p>
                ) : categories.length === 0 ? (
                  <p className="text-sm text-gray-400 font-bold">Departments unavailable (backend feed missing)</p>
                ) : (
                  <ul className="text-sm text-gray-500 space-y-3 font-medium">
                    {categories.slice(0, 4).map((cat) => (
                      <li key={cat.id}>
                        <Link to={`/store/category/${cat.id}`} className="hover:text-[#008A45] transition-colors">
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="space-y-6">
                <h4 className="font-black text-sm uppercase tracking-widest">About FreshMarket</h4>
                <ul className="text-sm text-gray-500 space-y-3 font-medium">
                  <li onClick={() => handleStaticLink('Our Mission')} className="hover:text-[#008A45] cursor-pointer transition-colors">Our Mission</li>
                  <li onClick={() => handleStaticLink('Verified Farmers')} className="hover:text-[#008A45] cursor-pointer transition-colors">Verified Farmers</li>
                  <li onClick={() => handleStaticLink('Sustainability')} className="hover:text-[#008A45] cursor-pointer transition-colors">Sustainability</li>
                  <li onClick={() => handleStaticLink('Careers')} className="hover:text-[#008A45] cursor-pointer transition-colors">Careers</li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="font-black text-sm uppercase tracking-widest">Client Care</h4>
                <ul className="text-sm text-gray-500 space-y-3 font-medium">
                  <li><Link to="/store/account/settings" className="hover:text-[#008A45] transition-colors">Help Center</Link></li>
                  <li><Link to="/store/account/orders" className="hover:text-[#008A45] transition-colors">Track Delivery</Link></li>
                  <li><Link to="/store/account/settings" className="hover:text-[#008A45] transition-colors">Return Policy</Link></li>
                  <li><Link to="/store/account/settings" className="hover:text-[#008A45] transition-colors">Contact Support</Link></li>
                </ul>
              </div>
              <div className="space-y-10">
                <div className="space-y-4">
                  <h4 className="font-black text-sm uppercase tracking-widest">Internal Access</h4>
                  <Link to="/" className="inline-flex items-center gap-2 bg-[#008A45]/5 text-[#008A45] px-4 py-2.5 rounded-xl text-xs font-black hover:bg-[#008A45]/10 transition-all italic border border-emerald-100">
                    <Lock size={14} /> OPS PORTAL
                  </Link>
                </div>
                <div className="space-y-4">
                  <h4 className="font-black text-[10px] uppercase tracking-widest text-gray-300">Social Connect</h4>
                  <div className="flex gap-4 text-gray-400">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                      <Instagram size={20} className="hover:text-[#008A45] cursor-pointer transition-colors" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                      <Twitter size={20} className="hover:text-[#008A45] cursor-pointer transition-colors" />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                      <Facebook size={20} className="hover:text-[#008A45] cursor-pointer transition-colors" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">© 2026 FreshMarket Ecosystem • All Rights Reserved</p>
              <div className="flex gap-8 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                <span onClick={() => handleStaticLink('Privacy Policy')} className="hover:text-gray-900 cursor-pointer">Privacy</span>
                <span onClick={() => handleStaticLink('Terms of Service')} className="hover:text-gray-900 cursor-pointer">Terms</span>
                <span onClick={() => handleStaticLink('Compliance')} className="hover:text-gray-900 cursor-pointer">Compliance</span>
              </div>
            </div>
          </div>
        </footer>

        <Modal 
          isOpen={!!infoModal} 
          onClose={() => setInfoModal(null)} 
          title={infoModal?.title || 'Information'}
        >
          <div className="py-6 space-y-4">
            <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-start gap-4">
              <Info className="text-emerald-600 shrink-0 mt-1" size={24} />
              <div className="space-y-2">
                <p className="text-sm font-bold text-emerald-900 leading-relaxed italic">
                  This section provides detailed documentation regarding {infoModal?.title.toLowerCase()}. 
                  Our commitment to transparency and quality is the cornerstone of the FreshMarket ecosystem.
                </p>
                <p className="text-xs text-emerald-700/70">Last Updated: January 2026</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Full legal texts and operational procedures are available for download in our main documentation portal. 
              Please contact our compliance team for further inquiries.
            </p>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50/50">
      <OpsSidebar userRole={userRole} />
      <div className="flex-1 ml-64 min-w-0">
        <OpsHeader />
        <main className="p-8 max-w-[1600px] mx-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
