import { describe, expect, it } from "vitest";
import { apiClient, AppError } from "../../src/services/api-client";

const getReject = () => {
  const handlers = (apiClient.interceptors.response as any).handlers || [];
  const handler = handlers.find((h: any) => h.rejected)?.rejected;
  if (!handler) throw new Error("No response interceptor found");
  return handler as (err: any) => Promise<never>;
};

describe("api-client 401 handling", () => {
  it("clears tokens and redirects to login on 401 with normalized error", async () => {
    localStorage.setItem("mami_token", "a.b.c");
    sessionStorage.setItem("mami_token", "a.b.c");
    window.location.hash = "";

    const reject = getReject();
    const error = {
      response: {
        status: 401,
        data: { error: { code: "UNAUTHORIZED", message: "expired" } },
      },
      config: { url: "/test" },
      message: "unauthorized",
    };

    await expect(reject(error)).rejects.toBeInstanceOf(AppError);
    await reject(error).catch((err: AppError) => {
      expect(err.code).toBe("UNAUTHORIZED");
      expect(err.message).toBe("expired");
    });
    expect(localStorage.getItem("mami_token")).toBeNull();
    expect(sessionStorage.getItem("mami_token")).toBeNull();
    expect(window.location.hash).toBe("#/login");
  });
});
