import { useCallback } from "react";
import { useAuthActions } from "./useAuthActions";
import { toast } from "react-hot-toast";
import type { LoginInput } from "@/validation/auth";
import type { UserRole } from "@/domains/users/types";

export const useLogin = () => {
  const { loginUser } = useAuthActions();

  const handleLogin = useCallback(
    async (
      data: LoginInput,
      onLogin: (payload: {
        token: string;
        role?: UserRole | null;
        remember?: boolean;
      }) => void,
    ) => {
      toast.loading("Authenticating secure session...", { id: "auth" });
      try {
        const { token, role } = await loginUser({
          email: data.email,
          password: data.password,
        });
        if (!token) {
          toast.error("No token returned from backend", { id: "auth" });
          return;
        }
        const validRoles: UserRole[] = [
          "ADMIN",
          "MANAGER",
          "EMPLOYEE",
          "CUSTOMER",
        ];
        const normalizedRole =
          role && validRoles.includes(role as UserRole)
            ? (role as UserRole)
            : null;
        onLogin({ token, role: normalizedRole, remember: data.rememberMe });
        return normalizedRole;
      } catch (err: any) {
        toast.error(err.message || "Credential verification failed", {
          id: "auth",
        });
        return null;
      }
    },
    [loginUser],
  );

  return { handleLogin };
};
