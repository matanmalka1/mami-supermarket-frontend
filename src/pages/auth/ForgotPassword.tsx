import { useNavigate } from "react-router";
import { Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import ForgotPasswordDone from "./ForgotPasswordDone";
import ResetForm from "./ResetForm";
import AuthHeader from "./AuthHeader";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";
import { usePasswordFormState } from "@/features/auth/hooks/usePasswordFormState";
import EmailField from "@/components/ui/form/EmailField";

type Stage = "REQUEST" | "RESET" | "DONE";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const {
    email,
    token,
    newPassword,
    confirmPassword,
    setEmail,
    setToken,
    setNewPassword,
    setConfirmPassword,
  } = usePasswordFormState();
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
                <EmailField
                  label="Email Address"
                  registration={undefined}
                  value={email}
                  onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
                  disabled={stage !== "REQUEST"}
                  leftIcon={<Mail size={20} />}
                />

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
