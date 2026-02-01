import React, { useState } from "react";
import { KeyRound, Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import EmailField from "@/components/ui/form/EmailField";
import TextField from "@/components/ui/form/TextField";
import PasswordField from "@/components/ui/form/PasswordField";
import ErrorMessage from "@/components/ui/ErrorMessage";

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
      <EmailField
        label="Email Address"
        value={email}
        onChange={(e) => onEmailChange((e.target as HTMLInputElement).value)}
        leftIcon={<Mail size={20} />}
        required
      />

      <TextField
        label="Reset Token"
        required
        value={token}
        onChange={(e) => onTokenChange((e.target as HTMLInputElement).value)}
        placeholder="Paste token from email"
        leftIcon={<KeyRound size={20} />}
        inputClassName="font-mono text-sm"
      />

      <PasswordField
        label="New Password"
        required
        value={newPassword}
        onChange={(e) => onNewPasswordChange((e.target as HTMLInputElement).value)}
        show={showNewPassword}
        onToggle={() => setShowNewPassword((prev) => !prev)}
        placeholder="strong password"
        helperText="At least 8 chars, one letter and one digit. Allowed: ! @ # $ % ^ & * ( ) _ + = -"
      />

      <PasswordField
        label="Confirm Password"
        required
        value={confirmPassword}
        onChange={(e) => onConfirmPasswordChange((e.target as HTMLInputElement).value)}
        show={showConfirmPassword}
        onToggle={() => setShowConfirmPassword((prev) => !prev)}
      />

      {showError && error && <ErrorMessage message={error} className="text-sm text-red-500" />}

      <Button fullWidth size="lg" loading={loading} type="submit">
        {buttonLabel}
      </Button>
    </form>
  );
};

export default ResetForm;
