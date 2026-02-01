import { useState, useCallback, useEffect } from "react";
import type { UserRole } from "@/domains/users/types";
import { normalizeRole } from "../utils/roles";
import { usersService } from "@/domains/users/service";

type LoginPayload = { token: string; role?: string | null; remember?: boolean };

const readRoleFromToken = (token: string): UserRole | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    return (
      normalizeRole(payload.role) ||
      normalizeRole(payload.user_role) ||
      normalizeRole(payload.userType) ||
      normalizeRole(payload.type) ||
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

  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    const token =
      localStorage.getItem("mami_token") ||
      sessionStorage.getItem("mami_token");
    if (token) {
      const role = readRoleFromToken(token) || "ADMIN";
      return role as UserRole;
    }
    return null;
  });

  const [userName, setUserName] = useState<string | null>(null);

  // Fetch user profile when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      usersService
        .getCurrentUser()
        .then((user) => {
          const fullName =
            `${user.firstName || ""} ${user.lastName || ""}`.trim();
          setUserName(fullName || null);
        })
        .catch((error) => {
          console.error("[useAuth] Failed to fetch user profile:", error);
        });
    } else {
      setUserName(null);
    }
  }, [isAuthenticated]);

  const login = useCallback(
    ({ token, role, remember = false }: LoginPayload) => {
      const resolvedRole =
        normalizeRole(role) || readRoleFromToken(token) || "ADMIN";
      setUserRole(resolvedRole);
      sessionStorage.setItem("mami_token", token);
      if (remember) localStorage.setItem("mami_token", token);
      else localStorage.removeItem("mami_token");
      setIsAuthenticated(true);
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("mami_token");
    sessionStorage.removeItem("mami_token");
    sessionStorage.removeItem("mami_manual_store_visit");
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName(null);
  }, []);

  return { isAuthenticated, userRole, userName, login, logout };
};
