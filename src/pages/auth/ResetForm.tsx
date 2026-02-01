import React, { useState } from "react";
import { Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import Button from "@/components/ui/Button";

type ResetFormProps = {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
  loading: boolean;
  error?: string | null;
  showError?: boolean;
  buttonLabel?: React.ReactNode;
  onEmailChange: (value: string) => void;
  onTokenChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const ResetForm: React.FC<ResetFormProps> = ({
  email,
  token,
  newPassword,
  confirmPassword,
  loading,
  error,
  showError = true,
  buttonLabel = "Update Password",
  onEmailChange,
  onTokenChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
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
        <div className="relative">
          <input
            required
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => onNewPasswordChange(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-4 pr-12 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
            placeholder="Enter a strong password"
            minLength={8}
          />
          <button
            type="button"
            aria-label={showNewPassword ? "Hide new password" : "Show new password"}
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <p className="text-[11px] text-gray-500">
          at least 8 characters, must include at least one letter and one digit. Allowed special characters: ! @ # $ % ^ & * ( ) _ + = -
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Confirm Password</label>
        <div className="relative">
          <input
            required
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-4 pr-12 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
            placeholder="Repeat your new password"
            minLength={8}
          />
          <button
            type="button"
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {showError && error && (
        <p className="text-sm font-bold text-red-500 text-center">{error}</p>
      )}

      <Button fullWidth size="lg" loading={loading} type="submit">
        {buttonLabel}
      </Button>
    </form>
  );
};

export default ResetForm;
