
import React, { useState, useRef } from 'react';
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { Link, useNavigate } from 'react-router';
import { TrendingUp, Clock, Leaf, Sparkles, MapPin, ChevronRight } from 'lucide-react';
import ProductCard from '../components/store/ProductCard';
import FlashDeals from '../components/store/FlashDeals';
import RecentlyViewed from '../components/store/RecentlyViewed';
import Section from '../components/ui/Section';
import Grid from '../components/ui/Grid';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { CATEGORIES, FEATURED_ITEMS } from '../constants';
import { HeroSection, BenefitCard } from '../components/store/StorefrontComponents';

const Storefront: React.FC = () => {
  const navigate = useNavigate();
  const categoryRef = useRef<HTMLDivElement>(null);
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);

  const scrollToCategories = () => categoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-24">
      <HeroSection onStart={scrollToCategories} onExplore={() => setIsFarmModalOpen(true)} />

      <div ref={categoryRef} className="scroll-mt-32">
        <Grid cols={6} gap={6}>
          {CATEGORIES.map(cat => (
            <Link key={cat.id} to={`/store/category/${cat.id}`} className="group flex flex-col items-center p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:bg-white hover:border-[#008A45] hover:shadow-xl hover:shadow-emerald-900/5 transition-all text-center space-y-4">
              <span className="text-4xl group-hover:scale-125 transition-transform">{cat.icon}</span>
              <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-[#008A45]">{cat.name}</span>
            </Link>
          ))}
        </Grid>
      </div>

      <FlashDeals />

      <Section title="Today's Selection" subtitle={<><TrendingUp size={16} className="text-[#008A45]" /> Trending in your area</>} linkTo="/store/search">
        <Grid>{FEATURED_ITEMS.map((item: any) => <ProductCard key={item.id} item={item} />)}</Grid>
      </Section>

      <RecentlyViewed />

      <Grid cols={3} gap={12}>
        <BenefitCard icon={<Clock />} title="1-Hour Delivery" desc="Fast, temperature-controlled delivery guaranteed." bg="bg-emerald-50" color="text-[#008A45]" />
        <BenefitCard icon={<Leaf />} title="Zero-Waste Pack" desc="Sustainable packaging for a cleaner planet." bg="bg-blue-50" color="text-blue-600" />
        <BenefitCard icon={<Sparkles />} title="Certified Organic" desc="100% pesticide-free produce from local farms." bg="bg-orange-50" color="text-orange-500" />
      </Grid>

      <Modal isOpen={isFarmModalOpen} onClose={() => setIsFarmModalOpen(null)} title="Verified Local Producers" subtitle="Direct from Israeli soil">
        <div className="py-6 space-y-4">
          {[
            { name: "Kfar Azar Orchards", location: "Central", specialty: "Citrus" },
            { name: "Golan Heights Artisans", location: "Northern", specialty: "Cheeses" }
          ].map(farm => (
            <div key={farm.name} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between group hover:bg-emerald-50 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm"><MapPin size={20} /></div>
                 <div><h4 className="font-bold text-gray-900">{farm.name}</h4><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{farm.location} • {farm.specialty}</p></div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-emerald-500 transition-all" size={20} />
            </div>
          ))}
          <Button fullWidth onClick={() => { setIsFarmModalOpen(false); navigate('/store/category/produce'); }} className="mt-4 rounded-2xl">View All Local Produce</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Storefront;
