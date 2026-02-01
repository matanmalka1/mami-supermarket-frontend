import { Timer, Zap } from "lucide-react";
import ProductCard from "./ProductCard";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";

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
    <section className="bg-[#fdf1e6] border border-[#ffd7b3] rounded-[3rem] p-10 shadow-xl space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#ff6f1e]">
            <Zap size={16} aria-hidden /> Flash Deals
          </p>
          <h2 className="text-4xl text-gray-900 tracking-tight">Ending Soon</h2>
        </div>
        <div className="flex items-center gap-4 rounded-3xl border border-[#ffd7b3] bg-white/90 px-6 py-3 shadow-sm">
          <Timer size={24} className="text-orange-500" />
          <div className="flex flex-col leading-none">
            <span className="text-2xl text-gray-900 tabular-nums">
              {timeLeft}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              Remaining
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <LoadingState label="Loading flash deals..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : deals.length === 0 ? (
          <EmptyState title="No deals available right now." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {deals.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FlashDeals;
