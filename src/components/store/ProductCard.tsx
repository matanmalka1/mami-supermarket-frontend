
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router';
import { currencyILS } from '../../utils/format';
import { useWishlist } from '@/hooks/useWishlist';

type CardProduct = {
  id: string;
  name: string;
  category?: string;
  price: number;
  tag?: string;
  image?: string;
  oldPrice?: number;
  unit?: string;
};

interface ProductCardProps {
  item: CardProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const initials = (text?: string) =>
    (text || "?")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "?";

  const isLiked = isWishlisted(item.id);
  const toggleWishlistHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item.id);
    toast(
      isLiked
        ? "Removed from wishlist"
        : "Added to wishlist",
      {
        icon: isLiked ? '🟣' : '🧡',
        style: { borderRadius: '1rem', fontWeight: 'bold' },
      },
    );
  };

  return (
    <Link to={`/store/product/${item.id}`} className="group cursor-pointer block">
      <div className="relative rounded-2xl overflow-hidden aspect-square mb-4 bg-gray-100">
        {item.image ? (
          <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl font-black text-gray-300">
            {initials(item.name)}
          </div>
        )}
        {item.tag && <span className="absolute top-4 left-4 bg-[#008A45] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{item.tag}</span>}
        <button 
          onClick={toggleWishlistHandler}
          className={`absolute top-4 right-4 w-10 h-10 backdrop-blur rounded-full flex items-center justify-center transition-all shadow-md z-10 ${
            isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        </button>
        <div className="absolute inset-x-4 bottom-4 translate-y-[150%] group-hover:translate-y-0 transition-transform duration-300 z-10">
          <button 
            onClick={(e) => { 
              e.preventDefault();
              e.stopPropagation(); 
              addItem(item); 
            }}
            className="w-full bg-[#008A45] text-white py-3 rounded-xl font-black flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/20 active:scale-95"
          >
            <ShoppingCart size={18} /> Add to Cart
          </button>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.category}</p>
        <h4 className="font-bold text-lg leading-tight truncate">{item.name}</h4>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black text-[#008A45]">{currencyILS(item.price)}{item.unit}</span>
          {item.oldPrice && <span className="text-sm text-gray-400 line-through">{currencyILS(item.oldPrice)}</span>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
