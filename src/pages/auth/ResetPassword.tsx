import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import ForgotPasswordDone from "./ForgotPasswordDone";
import ResetForm from "./ResetForm";
import AuthHeader from "./AuthHeader";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useAuthActions();

  useEffect(() => {
    const qpToken = searchParams.get("token") || "";
    if (qpToken) setToken(qpToken);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      const message = "New password and confirmation do not match";
      setError(message);
      toast.error(message);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await resetPassword({
        email,
        token,
        new_password: newPassword,
      });
      toast.success("Password updated", { icon: <ShieldCheck size={16} /> });
      setDone(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
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
