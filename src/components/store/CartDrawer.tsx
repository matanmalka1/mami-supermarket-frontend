import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Link, useNavigate } from "react-router";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import { currencyILS } from "../../utils/format";

const FREE_DELIVERY_THRESHOLD = 150;

const CartDrawer: React.FC = () => {
  const { items, removeItem, updateQuantity, total, isOpen, setIsOpen } =
    useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const progress = Math.min(100, (total / FREE_DELIVERY_THRESHOLD) * 100);

  const handleCheckoutClick = () => {
    setIsOpen(false);
    setTimeout(() => {
      navigate("/store/checkout");
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      <aside className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-8 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-[#008A45]" size={24} />
            <h2 className="text-2xl ">Your Cart</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {/* Delivery Progress */}
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-gray-500">
                Free Delivery Status
              </span>
              <span className="text-xs text-[#008A45]">
                {total >= FREE_DELIVERY_THRESHOLD
                  ? "Unlocked! ✓"
                  : `${currencyILS(FREE_DELIVERY_THRESHOLD - total)} to go`}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#008A45] transition-all duration-1000 shadow-[0_0_10px_rgba(0,138,69,0.3)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {items.length === 0 ? (
            <EmptyState title="Your cart is feeling light..." />
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 group animate-in slide-in-from-right-4"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      className="w-20 h-20 rounded-xl object-cover border shadow-sm group-hover:scale-105 transition-transform"
                      alt={item.name}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-xl">
                      {item.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-gray-900 leading-tight group-hover:text-[#008A45] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[#008A45] text-sm">
                      {currencyILS(item.price)}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex bg-white rounded-lg p-0.5 border border-gray-100 shadow-sm">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-3 py-1 text-gray-400 hover:text-gray-900"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold w-8 flex items-center justify-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-3 py-1 text-gray-400 hover:text-gray-900"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-8 bg-gray-50 border-t space-y-6 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-end">
            <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              Subtotal
            </span>
            <span className="text-3xl  tracking-tighter">
              {currencyILS(total)}
            </span>
          </div>
          <Button
            className="w-full h-16 rounded-2xl text-lg  shadow-xl shadow-emerald-900/20"
            disabled={items.length === 0}
            onClick={handleCheckoutClick}
          >
            Checkout Now <ArrowRight size={20} className="ml-2" />
          </Button>
          <p className="text-[10px] text-center font-bold text-gray-400 uppercase tracking-widest opacity-60">
            Taxes and fees calculated at checkout
          </p>
        </div>
      </aside>
    </div>
  );
};

export default CartDrawer;
