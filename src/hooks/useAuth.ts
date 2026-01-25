import { useState, useCallback } from "react";
import { UserRole } from "../types/auth";

type LoginPayload = { token: string; role?: UserRole | null; remember?: boolean };

const readRoleFromToken = (token: string): UserRole | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    return (
      payload.role ||
      payload.user_role ||
      payload["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"] ||
      null
    );
  } catch {
    return null;
  }
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () =>
      !!(
        localStorage.getItem("mami_token") ||
        sessionStorage.getItem("mami_token")
      ),
  );

  const [userRole, setUserRole] = useState<UserRole | null>(
    () => (localStorage.getItem("mami_role") as UserRole) || null,
  );

  const login = useCallback(
    ({ token, role, remember = false }: LoginPayload) => {
      const resolvedRole = role || readRoleFromToken(token);
      if (resolvedRole) {
        localStorage.setItem("mami_role", resolvedRole);
        setUserRole(resolvedRole);
      } else {
        localStorage.removeItem("mami_role");
        setUserRole(null);
      }
      sessionStorage.setItem("mami_token", token);
      if (remember) localStorage.setItem("mami_token", token);
      else localStorage.removeItem("mami_token");
      setIsAuthenticated(true);
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("mami_token");
    localStorage.removeItem("mami_role");
    sessionStorage.removeItem("mami_token");
    sessionStorage.removeItem("mami_manual_store_visit");
    setIsAuthenticated(false);
    setUserRole(null);
  }, []);

  return { isAuthenticated, userRole, login, logout };
};
