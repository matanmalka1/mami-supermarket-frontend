import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import RequireAuth from "../../app/guards/RequireAuth";
import RoleGuard from "../../app/guards/RoleGuard";

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

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <RoleGuard allowedRoles={["ADMIN"]} userRole="CUSTOMER">
                <div>Admin Only</div>
              </RoleGuard>
            }
          />
          <Route path="/403" element={<div>Forbidden Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/forbidden page/i)).toBeInTheDocument();
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
