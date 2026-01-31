import { renderHook, act } from "@testing-library/react";
import { useAuth } from "./useAuth";

describe("useAuth", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("should initialize as not authenticated if no token", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.userRole).toBeNull();
  });

  it("should initialize as authenticated if token exists", () => {
    localStorage.setItem("mami_token", "token");
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userRole).toBe("ADMIN");
  });

  it("should login and set tokens in sessionStorage by default", () => {
    const { result } = renderHook(() => useAuth());
    act(() => {
      result.current.login({ token: "abc.def.ghi", role: "user" });
    });
    expect(sessionStorage.getItem("mami_token")).toBe("abc.def.ghi");
    expect(localStorage.getItem("mami_token")).toBeNull();
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userRole).toBe("CUSTOMER");
  });

  it("should login and set tokens in localStorage if remember is true", () => {
    const { result } = renderHook(() => useAuth());
    act(() => {
      result.current.login({
        token: "abc.def.ghi",
        role: "admin",
        remember: true,
      });
    });
    expect(localStorage.getItem("mami_token")).toBe("abc.def.ghi");
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userRole).toBe("ADMIN");
  });

  it("should logout and clear tokens", () => {
    localStorage.setItem("mami_token", "token");
    sessionStorage.setItem("mami_token", "token");
    sessionStorage.setItem("mami_manual_store_visit", "1");
    const { result } = renderHook(() => useAuth());
    act(() => {
      result.current.logout();
    });
    expect(localStorage.getItem("mami_token")).toBeNull();
    expect(sessionStorage.getItem("mami_token")).toBeNull();
    expect(sessionStorage.getItem("mami_manual_store_visit")).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.userRole).toBeNull();
  });
});
