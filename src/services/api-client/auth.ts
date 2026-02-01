/**
 * Get base URL for API requests
 */
export const getBaseUrl = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() !== "") return envUrl.trim();
  if ((import.meta as any).env?.DEV) return "http://localhost:5000/api/v1";
  return "/api/v1";
};

/**
 * Get valid JWT token from storage
 */
export const getAuthToken = (): string | null => {
  const lsToken = localStorage.getItem("mami_token");
  const ssToken = sessionStorage.getItem("mami_token");

  if (
    ssToken &&
    typeof ssToken === "string" &&
    ssToken.split(".").length === 3
  ) {
    return ssToken;
  }

  if (
    lsToken &&
    typeof lsToken === "string" &&
    lsToken.split(".").length === 3
  ) {
    return lsToken;
  }

  if (lsToken && (import.meta as any).env?.DEV) {
    console.warn(
      "[apiClient] Ignoring invalid mami_token in localStorage (not a JWT)",
    );
  }

  return null;
};

/**
 * Clear authentication tokens from storage
 */
export const clearAuthTokens = (): void => {
  localStorage.removeItem("mami_token");
  sessionStorage.removeItem("mami_token");
};
