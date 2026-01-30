import React, { useState } from "react";
import { CreditCard } from "lucide-react";
import Button from "../ui/Button";
import { currencyILS } from "../../utils/format";
import type { CartItem } from "@/context/CartContext";

type Props = {
  itemsCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  loading: boolean;
  onBack: () => void;
  onConfirm: (paymentTokenId: number) => void;
  onCreatePaymentToken?: (
    cardDetails: any,
  ) => Promise<{ paymentTokenId: number }>;
  cartItems?: CartItem[];
};

const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1-").replace(/-$/, "");
};

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (!digits) return "";
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export const PaymentStep: React.FC<Props> = ({
  itemsCount,
  subtotal,
  deliveryFee,
  total,
  loading,
  onBack,
  onConfirm,
  onCreatePaymentToken,
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handleCardNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCardNumber(formatCardNumber(event.target.value));
  };

  const handleExpiryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExpiry(formatExpiry(event.target.value));
  };

  const handleCvvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(event.target.value.replace(/\D/g, "").slice(0, 4));
  };

  const [error, setError] = useState<string | null>(null);

  const handleConfirmAndPay = async () => {
    setError(null);
    try {
      let paymentTokenId = 1;
      if (onCreatePaymentToken) {
        const result = await onCreatePaymentToken({
          cardNumber,
          cardHolderName,
          expiry,
          cvv,
        });
        paymentTokenId = result.paymentTokenId;
      }
      onConfirm(paymentTokenId);
    } catch (e: any) {
      setError(e?.message || "Failed to create payment token");
    }
  };

  return (
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
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-black uppercase text-gray-400 tracking-widest">
            Card Number
          </label>
          <div className="relative">
            <CreditCard
              className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"
              size={24}
            />
            <input
              type="text"
              inputMode="numeric"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-6 pl-16 pr-6 font-mono text-lg focus:border-[#008A45] outline-none transition-all"
            />
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-xs font-black uppercase text-gray-400 tracking-widest">
            Card Holder Name
          </label>
          <input
            type="text"
            autoComplete="cc-name"
            value={cardHolderName}
            onChange={(event) => setCardHolderName(event.target.value)}
            placeholder="Full Name"
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-lg focus:border-[#008A45] outline-none transition-all"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Expiry Date
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={expiry}
              onChange={handleExpiryChange}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-lg focus:border-[#008A45] outline-none transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-gray-400 tracking-widest">
              CVV
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={cvv}
              onChange={handleCvvChange}
              placeholder="CVV"
              maxLength={4}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-lg focus:border-[#008A45] outline-none transition-all"
            />
          </div>
        </div>
      </div>
      {error && (
        <div className="text-red-600 font-bold text-center">{error}</div>
      )}
      <div className="flex gap-4">
        <Button variant="ghost" className="flex-1 h-16" onClick={onBack}>
          Back
        </Button>
        <Button
          size="lg"
          className="flex-[2] h-16 rounded-2xl"
          loading={loading}
          onClick={handleConfirmAndPay}
        >
          Confirm & Pay {currencyILS(total)}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;
