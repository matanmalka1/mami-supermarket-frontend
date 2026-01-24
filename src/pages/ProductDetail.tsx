import React, { useEffect, useState, useRef } from "react";
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { useParams, Link } from "react-router";
import {
  ChevronRight,
  Star,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Clock,
} from "lucide-react";
import ProductGallery from "../components/store/ProductGallery";
import ProductInfo from "../components/store/ProductInfo";
import ProductTabs from "../components/store/ProductTabs";
import { LoadingSpinner } from "../components/ui/Feedback";
import { apiService } from "../services/api";
import { Product } from "../types/domain";

const SIMILAR_ITEMS = [
  {
    id: 101,
    name: "Beam Floor Lamp",
    category: "Lighting & Ambiance",
    price: 450,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 102,
    name: "Core Side Table",
    category: "Compact Furniture",
    price: 890,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 103,
    name: "Static Wool Rug",
    category: "Textiles",
    price: 2100,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1575414003591-ece8d0416c7a?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 104,
    name: "Mono Decor",
    category: "Decor",
    price: 320,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80",
  },
];

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await apiService.catalog.getProduct(id);
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading)
    return (
      <div className="py-40">
        <LoadingSpinner label="Gathering product details..." />
      </div>
    );

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 pt-8">
          <ProductGallery
            images={product?.imageUrl ? [product.imageUrl] : undefined}
          />
          <ProductInfo product={product} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16 border-y border-gray-100 mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <Leaf size={24} />
            </div>
            <div>
              <p className="font-black text-xs uppercase tracking-widest text-gray-900">
                Locally Sourced
              </p>
              <p className="text-xs text-gray-400 font-bold">
                Picked this morning at Kfar Azar
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="font-black text-xs uppercase tracking-widest text-gray-900">
                Quality Assured
              </p>
              <p className="text-xs text-gray-400 font-bold">
                Triple-checked for freshness
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="font-black text-xs uppercase tracking-widest text-gray-900">
                1-Hour Arrival
              </p>
              <p className="text-xs text-gray-400 font-bold">
                Available for express delivery
              </p>
            </div>
          </div>
        </div>

        <ProductTabs />

        <div className="py-24 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight italic">
              You May Also Like
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all active:scale-95 shadow-sm"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all active:scale-95 shadow-sm"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-4"
          >
            {SIMILAR_ITEMS.map((item) => (
              <div
                key={item.id}
                className="min-w-[280px] group cursor-pointer space-y-4"
              >
                <Link to={`/store/product/${item.id}`} className="block">
                  <div className="aspect-[4/5] bg-[#F9F9F9] rounded-2xl overflow-hidden relative">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt={item.name}
                    />
                  </div>
                  <div className="space-y-1 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                        <Star size={10} fill="currentColor" /> {item.rating}
                      </div>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      {item.category}
                    </p>
                    <p className="text-lg font-black text-gray-900">
                      ₪ {item.price}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
