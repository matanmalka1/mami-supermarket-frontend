import React, { useMemo, useState } from "react";
import OrderSummary from "./OrderSummary";
import CardForm from "./CardForm";
import ErrorMessage from "@/components/ui/ErrorMessage";
import PaymentActions from "./PaymentActions";
import type { CartItem } from "@/context/cart-context";

export interface CardDetails {
  cardNumber: string;
  cardHolderName: string;
  expiry: string;
  cvv: string;
}

type Props = {
  itemsCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  loading: boolean;
  onBack: () => void;
  onConfirm: (paymentTokenId: number) => void;
  onCreatePaymentToken?: (
    cardDetails: CardDetails,
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

const validateExpiry = (value: string): boolean => {
  if (!value || !value.includes("/")) return false;
  const [month, year] = value.split("/");
  if (!month || !year || month.length !== 2 || year.length !== 2) return false;

  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10);

  if (expMonth < 1 || expMonth > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;

  return true;
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
  const [error, setError] = useState<string | null>(null);

  const cardDetails = useMemo<CardDetails>(
    () => ({
      cardNumber,
      cardHolderName,
      expiry,
      cvv,
    }),
    [cardNumber, cardHolderName, expiry, cvv],
  );

  const cardComplete = useMemo(
    () =>
      [cardNumber, cardHolderName, expiry, cvv].every(
        (value) => value.trim().length > 0,
      ),
    [cardNumber, cardHolderName, expiry, cvv],
  );

  const handleCardNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCardNumber(formatCardNumber(event.target.value));
    setError(null);
  };

  const handleExpiryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExpiry(formatExpiry(event.target.value));
    setError(null);
  };

  const handleCvvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(event.target.value.replace(/\D/g, "").slice(0, 3));
    setError(null);
  };

  const handleConfirmAndPay = async () => {
    setError(null);
    if (!cardComplete) {
      setError("Please complete all card fields");
      return;
    }
    if (!validateExpiry(expiry)) {
      setError("Card has expired or invalid expiry date");
      return;
    }
    try {
      let paymentTokenId = 1;
      if (onCreatePaymentToken) {
        const result = await onCreatePaymentToken(cardDetails);
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
        confirmDisabled={!cardComplete}
      />
    </div>
  );
};

export default PaymentStep;
