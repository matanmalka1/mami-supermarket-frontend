import React, { useState } from "react";
import OrderSummary from "./OrderSummary";
import CardForm from "./CardForm";
import ErrorMessage from "@/components/ui/ErrorMessage";
import PaymentActions from "./PaymentActions";
import type { CartItem } from "@/context/cart-context";

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
      <h2 className="text-4xl ">Final Payment</h2>
      <OrderSummary
        itemsCount={itemsCount}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
      />
      <CardForm
        cardNumber={cardNumber}
        cardHolderName={cardHolderName}
        expiry={expiry}
        cvv={cvv}
        onCardNumberChange={handleCardNumberChange}
        onCardHolderNameChange={(e) => setCardHolderName(e.target.value)}
        onExpiryChange={handleExpiryChange}
        onCvvChange={handleCvvChange}
      />
      <ErrorMessage message={error} />
      <PaymentActions
        loading={loading}
        onBack={onBack}
        onConfirm={handleConfirmAndPay}
        total={total}
      />
    </div>
  );
};

export default PaymentStep;
