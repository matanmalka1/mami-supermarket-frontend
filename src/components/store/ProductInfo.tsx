
import React, { useState } from 'react';
import { Star, Minus, Plus, ShoppingCart, Share2, Truck, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types/domain';

interface ProductInfoProps {
  product?: Product | null;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  /* Fix: Corrected fallback object type and fields to match Product interface, resolving oldPrice property access errors */
  const productData: Product = product || {
    id: 'nordic-chair-1',
    name: 'Nordic Minimalist Lounge Chair',
    price: 1299,
    oldPrice: undefined,
    imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80",
    category: 'Scandinavian Series',
    description: 'Experience the pinnacle of comfort and Scandinavian design. This lounge chair features a solid oak frame and premium textured wool upholstery.',
    sku: 'ND-CH-01',
    availableQuantity: 10,
    reservedQuantity: 0,
    status: 'Steady'
  } as Product;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem(productData);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: productData.name,
      text: `Check out this amazing ${productData.name} I found at FreshMarket!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="space-y-6 flex-1">
        <div>
          <span className="text-[10px] font-black tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md uppercase mb-4 inline-block">
            {productData.category}
          </span>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight italic">
            {productData.name}
          </h1>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-1 text-emerald-500">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
          </div>
          <span className="text-gray-900">4.8</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-400">124 Reviews</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold text-gray-900 font-mono">₪ {productData.price}</span>
          {productData.oldPrice && (
            <span className="text-lg text-gray-300 line-through">₪ {productData.oldPrice}</span>
          )}
          <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded">-20%</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          In Stock - Ready to ship
        </div>

        <p className="text-gray-500 leading-relaxed text-sm font-medium">
          {productData.description}
        </p>

        <div className="pt-8 space-y-6 border-t border-gray-100">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Quantity</label>
            <div className="flex items-center w-fit border border-gray-100 rounded-xl overflow-hidden bg-gray-50/50">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-4 hover:bg-gray-100 transition-colors">
                <Minus size={16} className="text-gray-400" />
              </button>
              <span className="w-12 text-center font-black text-sm">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="p-4 hover:bg-gray-100 transition-colors">
                <Plus size={16} className="text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleAddToCart}
              variant="emerald" 
              className="flex-1 h-14 rounded-xl text-sm font-black italic tracking-wide" 
              icon={<ShoppingCart size={18} />}
            >
              Add to Cart
            </Button>
            <button 
              onClick={handleShare}
              className="w-14 h-14 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all active:scale-95 shadow-sm"
            >
              <Share2 size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                <Truck size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 uppercase text-[9px] tracking-widest">Shipping</p>
                <p className="font-medium">Free Worldwide</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 uppercase text-[9px] tracking-widest">Warranty</p>
                <p className="font-medium">2 Year Full Cover</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
