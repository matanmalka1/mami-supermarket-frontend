import React, { useState } from "react";
import { CreditCard } from "lucide-react";
const Button = (props: any) => <button {...props} />;
const currencyILS = (n: number) => n;
import type { CartItem } from "../CartContext";

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
  ) => Promise<{ payment_token_id: number }>;
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
        paymentTokenId = result.payment_token_id;
      }
      onConfirm(paymentTokenId);
    } catch (e: any) {
      setError(e?.message || "Failed to create payment token");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-4xl font-black italic flex items-center gap-2">
        <CreditCard /> Payment
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={handleCardNumberChange}
          className="input input-bordered w-full"
          maxLength={19}
        />
        <input
          type="text"
          placeholder="Cardholder Name"
          value={cardHolderName}
          onChange={(e) => setCardHolderName(e.target.value)}
          className="input input-bordered w-full"
        />
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={handleExpiryChange}
            className="input input-bordered flex-1"
            maxLength={5}
          />
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={handleCvvChange}
            className="input input-bordered flex-1"
            maxLength={4}
          />
        </div>
      </div>
      {error && <div className="text-red-500 font-bold">{error}</div>}
      <div className="flex gap-4 mt-8">
        <Button variant="ghost" className="flex-1 h-16" onClick={onBack}>
          Back
        </Button>
        <Button
          size="lg"
          className="flex-[2] h-16 rounded-2xl"
          onClick={handleConfirmAndPay}
          disabled={
            loading || !cardNumber || !cardHolderName || !expiry || !cvv
          }
        >
          Pay {currencyILS(total)}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;
