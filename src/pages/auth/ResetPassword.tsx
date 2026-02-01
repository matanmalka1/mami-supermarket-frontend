import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import ForgotPasswordDone from "./ForgotPasswordDone";
import ResetForm from "./ResetForm";
import AuthHeader from "./AuthHeader";
import { usePasswordFormState } from "@/features/auth/hooks/usePasswordFormState";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const qpToken = searchParams.get("token") || "";
  const {
    email,
    token,
    newPassword,
    confirmPassword,
    setEmail,
    setToken,
    setNewPassword,
    setConfirmPassword,
  } = usePasswordFormState(qpToken);
  // loading, error, and done are provided by useResetPassword
  const navigate = useNavigate();
  const { loading, done, error, handleReset } = useResetPassword();

  useEffect(() => {
    if (qpToken) setToken(qpToken);
  }, [qpToken, setToken]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleReset(email, token, newPassword, confirmPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8 bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100">
        <AuthHeader
          title="Reset Password"
          description="Use the token from your email and set a new password. If the link expired, request a new one."
        />

        {done ? (
          <ForgotPasswordDone onNavigate={() => navigate("/login")} />
        ) : (
          <ResetForm
            email={email}
            token={token}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            loading={loading}
            error={error}
            onEmailChange={setEmail}
            onTokenChange={setToken}
            onNewPasswordChange={setNewPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
