import { Timer, Zap } from "lucide-react";
import ProductCard from "./ProductCard";

type FlashDealsProps = {
  deals: any[];
  loading: boolean;
  error: string | null;
  timeLeft: string;
};

const FlashDeals: React.FC<FlashDealsProps> = ({
  deals,
  loading,
  error,
  timeLeft,
}) => {
  return (
    <section className="bg-orange-50 rounded-[3rem] p-12 space-y-10 border border-orange-100">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-orange-600 uppercase text-xs tracking-widest">
            <Zap size={16} fill="currentColor" /> Flash Deals
          </div>
          <h2 className="text-3xl text-gray-900 tracking-tight ">
            Ending Soon
          </h2>
        </div>
        <div className="bg-white px-8 py-4 rounded-3xl border border-orange-200 shadow-sm flex items-center gap-4">
          <Timer size={24} className="text-orange-500" />
          <div className="flex items-baseline gap-1">
            <span className="text-2xl text-gray-900 tabular-nums">
              {timeLeft}
            </span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">
              Remaining
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-orange-600 uppercase text-xs tracking-widest">
        {loading ? (
          <h2 className="text-3xl text-gray-900 tracking-tight col-span-4 text-center text-orange-700 font-bold">
            Loading...
          </h2>
        ) : error ? (
          <p className="col-span-4 text-center text-orange-700 font-bold">
            {error}
          </p>
        ) : deals.length === 0 ? (
          <span className="text-2xl text-gray-900 tabular-nums">
            No deals available right now.
          </span>
        ) : (
          deals.map((item) => <ProductCard key={item.id} item={item} />)
        )}
      </div>
    </section>
  );
};

export default FlashDeals;
