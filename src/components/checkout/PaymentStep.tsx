import React from "react";
import { CreditCard } from "lucide-react";
import Button from "../ui/Button";
import { currencyILS } from "../../utils/format";

type Props = {
  itemsCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  loading: boolean;
  onBack: () => void;
  onConfirm: () => void;
};

export const PaymentStep: React.FC<Props> = ({
  itemsCount,
  subtotal,
  deliveryFee,
  total,
  loading,
  onBack,
  onConfirm,
}) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
    <h2 className="text-4xl font-black italic">Final Payment</h2>
    <div className="p-8 bg-gray-50 rounded-3xl space-y-6 border border-gray-100">
      <div className="flex justify-between items-center font-bold text-gray-500 uppercase text-xs tracking-widest border-b pb-6">
        <span>Order Summary</span>
        <span>{itemsCount} Items</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between font-bold text-gray-900">
          <span>Subtotal</span>
          <span>{currencyILS(subtotal)}</span>
        </div>
        <div className="flex justify-between font-bold text-emerald-600">
          <span>Delivery</span>
          <span>{deliveryFee === 0 ? "FREE" : currencyILS(deliveryFee)}</span>
        </div>
        <div className="flex justify-between text-2xl font-black italic pt-4 border-t">
          <span>Total</span>
          <span>{currencyILS(total)}</span>
        </div>
      </div>
    </div>
    <div className="space-y-4">
      <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Card Details</label>
      <div className="relative">
        <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={24} />
        <input
          type="text"
          placeholder="XXXX XXXX XXXX XXXX"
          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-6 pl-16 pr-6 font-mono text-lg focus:border-[#008A45] outline-none transition-all"
        />
      </div>
    </div>
    <div className="flex gap-4">
      <Button variant="ghost" className="flex-1 h-16" onClick={onBack}>
        Back
      </Button>
      <Button size="lg" className="flex-[2] h-16 rounded-2xl" loading={loading} onClick={onConfirm}>
        Confirm & Pay {currencyILS(total)}
      </Button>
    </div>
  </div>
);

export default PaymentStep;
