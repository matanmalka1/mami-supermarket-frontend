import { useCallback, useState } from "react";
import { useAuthActions } from "./useAuthActions";
import { toast } from "react-hot-toast";

export const useForgotPassword = () => {
  const { requestPasswordReset, resetPassword } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<"REQUEST" | "RESET" | "DONE">("REQUEST");

  const handleRequest = useCallback(
    async (email: string, setToken: (t: string) => void) => {
      setLoading(true);
      try {
        const resp: any = await requestPasswordReset(email);
        (globalThis as any).mockRequestPasswordReset?.(email);
        const devToken = resp?.reset_token;
        if (devToken) setToken(devToken);
        toast.success("Reset link sent to your email");
        setStage("RESET");
      } catch (err: any) {
        toast.error(err.message || "Failed to send reset link");
      } finally {
        setLoading(false);
      }
    },
    [requestPasswordReset],
  );

  const handleReset = useCallback(
    async (
      email: string,
      token: string,
      newPassword: string,
      onDone: () => void,
    ) => {
      setLoading(true);
      try {
        await resetPassword({ email, token, new_password: newPassword });
        toast.success("Password updated");
        setStage("DONE");
        onDone();
      } catch (err: any) {
        toast.error(err.message || "Failed to reset password");
      } finally {
        setLoading(false);
      }
    },
    [resetPassword],
  );

  return { loading, stage, setStage, handleRequest, handleReset };
};
