import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import ForgotPasswordDone from "./ForgotPasswordDone";
import ResetForm from "./ResetForm";
import AuthHeader from "./AuthHeader";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";

type Stage = "REQUEST" | "RESET" | "DONE";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { loading, stage, setStage, handleRequest, handleReset } =
    useForgotPassword();


  const onRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleRequest(email, setToken);
  };


  const onReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleReset(email, token, newPassword, () => setStage("DONE"));
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
              <form onSubmit={onRequest} className="space-y-6">
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
                  confirmPassword={confirmPassword}
                  loading={loading}
                  showError={false}
                  onEmailChange={setEmail}
                  onTokenChange={setToken}
                  onNewPasswordChange={setNewPassword}
                  onConfirmPasswordChange={setConfirmPassword}
                  onSubmit={onReset}
                />
                {!token && (
                  <p className="text-xs text-gray-400 font-bold text-center">
                    In production, check your email for the token. In dev, the
                    token is returned in the response.
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
