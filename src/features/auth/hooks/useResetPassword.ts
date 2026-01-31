import { useCallback, useState } from "react";
import { useAuthActions } from "./useAuthActions";
import { toast } from "react-hot-toast";

export const useResetPassword = () => {
  const { resetPassword } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = useCallback(
    async (
      email: string,
      token: string,
      newPassword: string,
      confirmPassword: string,
    ) => {
      if (newPassword !== confirmPassword) {
        const message = "New password and confirmation do not match";
        setError(message);
        toast.error(message);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        await resetPassword({ email, token, new_password: newPassword });
        toast.success("Password updated");
        setDone(true);
      } catch (err: any) {
        toast.error(err.message || "Failed to reset password");
        setError(err.message || "Failed to reset password");
      } finally {
        setLoading(false);
      }
    },
    [resetPassword],
  );

  return { loading, done, error, setError, handleReset };
};
