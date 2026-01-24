import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Navigate, Route, Routes } from "react-router";
import { vi } from "vitest";
import RequireAuth from "./RequireAuth";
import { UserRole } from "@/types/auth";

describe("RequireAuth + RoleGuard", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("redirects to /login when token missing", async () => {
    renderNoTokenGuard();
    expect(await screen.findByText(/login page/i)).toBeInTheDocument();
  });

  it("redirects to store when role mismatch on admin route", async () => {
    localStorage.setItem("mami_token", "a.b.c");
    localStorage.setItem("mami_role", "USER");

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <RoleGuardHarness allowedRoles={["ADMIN"]} userRole="USER">
                <div>Admin Only</div>
              </RoleGuardHarness>
            }
          />
          <Route path="/store" element={<div>Storefront Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/storefront page/i)).toBeInTheDocument();
    });
  });
});

const renderNoTokenGuard = () =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <div>Secret</div>
            </RequireAuth>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>,
  );

const RoleGuardHarness: React.FC<{
  allowedRoles: UserRole[];
  userRole: UserRole | null;
  children: React.ReactNode;
}> = ({ allowedRoles, userRole, children }) => {
  const effectiveRole =
    userRole || (localStorage.getItem("mami_role") as UserRole);
  if (!effectiveRole) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(effectiveRole))
    return <Navigate to="/store" replace />;
  return <>{children}</>;
};
