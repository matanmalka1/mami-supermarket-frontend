
import React, { useState } from "react";
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { useNavigate } from "react-router";
import { Mail, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { apiService } from "@/services/api";
import { toast } from "react-hot-toast";
import ForgotPasswordDone from "./ForgotPasswordDone";
import ResetForm from "./ResetForm";
import AuthHeader from "./AuthHeader";

type Stage = "REQUEST" | "RESET" | "DONE";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [stage, setStage] = useState<Stage>("REQUEST");
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp: any = await apiService.auth.forgotPassword(email);
      const devToken = resp?.reset_token;
      if (devToken) setToken(devToken);
      toast.success("Reset link sent to your email");
      setStage("RESET");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.auth.resetPassword({
        email,
        token,
        new_password: newPassword,
      });
      toast.success("Password updated", { icon: <ShieldCheck size={16} /> });
      setStage("DONE");
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8 bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100">
        <AuthHeader
          title="Recover Account"
          description="Enter your email to receive a reset link. In development, you can paste the token directly."
        />

        {stage === "DONE" ? (
          <ForgotPasswordDone onNavigate={() => navigate("/login")} />
        ) : (
          <>
            {stage === "REQUEST" ? (
              <form onSubmit={handleRequest} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                      placeholder="name@example.com"
                      disabled={stage !== "REQUEST"}
                    />
                  </div>
                </div>

                <Button fullWidth size="lg" loading={loading} type="submit">
                  Send Reset Link
                </Button>
              </form>
            ) : (
              <>
                <ResetForm
                  email={email}
                  token={token}
                  newPassword={newPassword}
                  loading={loading}
                  showError={false}
                  onEmailChange={setEmail}
                  onTokenChange={setToken}
                  onNewPasswordChange={setNewPassword}
                  onSubmit={handleReset}
                />
                {!token && (
                  <p className="text-xs text-gray-400 font-bold text-center">
                    In production, check your email for the token. In dev, the token is returned in the response.
                  </p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
