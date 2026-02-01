import { useCallback, useState } from "react";
import { authService } from "@/domains/auth/service";

type ChangePasswordPayload = {
  current_password: string;
  new_password: string;
};

export const useProfileSettings = () => {
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const changePassword = useCallback(async (payload: ChangePasswordPayload) => {
    setPasswordError(null);
    setPasswordLoading(true);
    try {
      await authService.changePassword(payload);
    } catch (err: any) {
      const message = err?.message || "Unable to update password";
      setPasswordError(message);
      throw message;
    } finally {
      setPasswordLoading(false);
    }
  }, []);

  return {
    changePassword,
    passwordLoading,
    passwordError,
    setPasswordError,
  };
};
