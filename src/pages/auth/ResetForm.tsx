import React from "react";
import { KeyRound, Mail } from "lucide-react";
import Button from "@/components/ui/Button";

type ResetFormProps = {
  email: string;
  token: string;
  newPassword: string;
  loading: boolean;
  error?: string | null;
  showError?: boolean;
  buttonLabel?: React.ReactNode;
  onEmailChange: (value: string) => void;
  onTokenChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
};

const ResetForm: React.FC<ResetFormProps> = ({
  email,
  token,
  newPassword,
  loading,
  error,
  showError = true,
  buttonLabel = "Update Password",
  onEmailChange,
  onTokenChange,
  onNewPasswordChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700">Email Address</label>
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
          placeholder="name@example.com"
        />
      </div>
    </div>

    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700">Reset Token</label>
      <div className="relative">
        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          required
          value={token}
          onChange={(e) => onTokenChange(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all font-mono text-sm"
          placeholder="Paste token from email"
        />
      </div>
    </div>

    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700">New Password</label>
      <input
        required
        type="password"
        value={newPassword}
        onChange={(e) => onNewPasswordChange(e.target.value)}
        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
        placeholder="Enter a strong password"
        minLength={8}
      />
    </div>

    {showError && error && (
      <p className="text-sm font-bold text-red-500 text-center">{error}</p>
    )}

    <Button fullWidth size="lg" loading={loading} type="submit">
      {buttonLabel}
    </Button>
  </form>
);

export default ResetForm;
