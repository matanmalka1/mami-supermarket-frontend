import React from "react";
import { CreditCard } from "lucide-react";
import TextField from "@/components/ui/form/TextField";

interface CardFormProps {
  cardNumber: string;
  cardHolderName: string;
  expiry: string;
  cvv: string;
  onCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCardHolderNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExpiryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCvvChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CardForm: React.FC<CardFormProps> = ({
  cardNumber,
  cardHolderName,
  expiry,
  cvv,
  onCardNumberChange,
  onCardHolderNameChange,
  onExpiryChange,
  onCvvChange,
}) => (
  <div className="space-y-6">
    <TextField
      label="Card Number"
      type="text"
      inputMode="numeric"
      value={cardNumber}
      onChange={onCardNumberChange}
      placeholder="XXXX-XXXX-XXXX-XXXX"
      leftIcon={<CreditCard className="text-gray-300" size={24} />}
      inputClassName="py-6 font-mono text-lg"
    />

    <TextField
      label="Card Holder Name"
      type="text"
      autoComplete="cc-name"
      value={cardHolderName}
      onChange={onCardHolderNameChange}
      placeholder="Full Name"
      inputClassName="text-lg"
    />

    <div className="grid gap-4 sm:grid-cols-2">
      <TextField
        label="Expiry Date"
        type="text"
        inputMode="numeric"
        value={expiry}
        onChange={onExpiryChange}
        placeholder="MM/YY"
        maxLength={5}
        inputClassName="text-lg"
      />
      <TextField
        label="CVV"
        type="text"
        inputMode="numeric"
        value={cvv}
        onChange={onCvvChange}
        placeholder="CVV"
        maxLength={3}
        inputClassName="text-lg"
      />
    </div>
  </div>
);

export default CardForm;
