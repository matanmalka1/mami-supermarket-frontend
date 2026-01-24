import React from "react";
import { Navigate } from "react-router";

// Simple route guard: checks for mami_token in storage
export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token =
    localStorage.getItem("mami_token") || sessionStorage.getItem("mami_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
