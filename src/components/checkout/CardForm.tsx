import React from "react";
import { CreditCard } from "lucide-react";

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
    <div className="space-y-3">
      <label className="text-xs uppercase text-gray-400 tracking-widest">
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
          onChange={onCardNumberChange}
          placeholder="XXXX-XXXX-XXXX-XXXX"
          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-6 pl-16 pr-6 font-mono text-lg focus:border-[#008A45] outline-none transition-all"
        />
      </div>
    </div>
    <div className="space-y-3">
      <label className="text-xs uppercase text-gray-400 tracking-widest">
        Card Holder Name
      </label>
      <input
        type="text"
        autoComplete="cc-name"
        value={cardHolderName}
        onChange={onCardHolderNameChange}
        placeholder="Full Name"
        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-lg focus:border-[#008A45] outline-none transition-all"
      />
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-3">
        <label className="text-xs uppercase text-gray-400 tracking-widest">
          Expiry Date
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={expiry}
          onChange={onExpiryChange}
          placeholder="MM/YY"
          maxLength={5}
          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-lg focus:border-[#008A45] outline-none transition-all"
        />
      </div>
      <div className="space-y-3">
        <label className="text-xs uppercase text-gray-400 tracking-widest">
          CVV
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={cvv}
          onChange={onCvvChange}
          placeholder="CVV"
          maxLength={4}
          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-lg focus:border-[#008A45] outline-none transition-all"
        />
      </div>
    </div>
  </div>
);

export default CardForm;
