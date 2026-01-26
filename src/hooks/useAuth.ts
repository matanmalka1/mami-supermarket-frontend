import { useState, useCallback } from "react";
import { UserRole } from "../types/auth";
import { normalizeRole } from "../utils/roles";

type LoginPayload = { token: string; role?: string | null; remember?: boolean };

const readRoleFromToken = (token: string): UserRole | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    return (
      normalizeRole(payload.role) ||
      normalizeRole(payload.user_role) ||
      normalizeRole(
        payload["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"],
      ) ||
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
    () => normalizeRole(localStorage.getItem("mami_role")) || null,
  );

  const login = useCallback(
    ({ token, role, remember = false }: LoginPayload) => {
      const resolvedRole = normalizeRole(role) || readRoleFromToken(token);
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
