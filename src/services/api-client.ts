import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
// AppError is a runtime class, not migrated to types domain. Exported for reuse where needed.
export class AppError extends Error {
  code: string;
  details?: Record<string, any>;
  constructor(apiError: {
    code: string;
    message: string;
    details?: Record<string, any>;
  }) {
    super(apiError.message);
    this.code = apiError.code;
    this.details = apiError.details;
    this.name = "AppError";
  }
}
import { apiErrorSchema } from "@/validation/apiError";

// Single source of truth for baseURL
const getBaseUrl = () => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() !== "") return envUrl.trim();
  if ((import.meta as any).env?.DEV) return "http://localhost:5000/api/v1";
  return "/api/v1";
};
const BASE_URL = getBaseUrl();

export const toCamel = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map((item) => toCamel(item));
  if (
    obj !== null &&
    typeof obj === "object" &&
    (obj.constructor === Object || !obj.constructor)
  ) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/([-_][a-z])/g, (g) =>
        g.toUpperCase().replace("-", "").replace("_", ""),
      );
      acc[camelKey] = toCamel(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
};

export const toSnake = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map((item) => toSnake(item));
  if (
    obj !== null &&
    typeof obj === "object" &&
    (obj.constructor === Object || !obj.constructor)
  ) {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
      acc[snakeKey] = toSnake(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const lsToken = localStorage.getItem("mami_token");
  const ssToken = sessionStorage.getItem("mami_token");
  let token = null;
  if (
    ssToken &&
    typeof ssToken === "string" &&
    ssToken.split(".").length === 3
  ) {
    token = ssToken;
  } else if (
    lsToken &&
    typeof lsToken === "string" &&
    lsToken.split(".").length === 3
  ) {
    token = lsToken;
  } else if (lsToken && (import.meta as any).env?.DEV) {
    // Dev warning: LS token exists but is not a valid JWT
    console.warn(
      "[apiClient] Ignoring invalid mami_token in localStorage (not a JWT)",
    );
  }
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    if (config.headers && "Authorization" in config.headers) {
      delete config.headers.Authorization;
    }
    if ((import.meta as any).env?.DEV) {
      // Dev-only: log when skipping Authorization
      console.debug(
        "[apiClient] no valid token, skipping Authorization header",
      );
    }
  }
  if (config.data) config.data = toSnake(config.data);
  if ((import.meta as any).env?.DEV && config.params) {
    console.debug("[apiClient] params forwarded without snake_case", {
      keys: Object.keys(config.params || {}),
    });
  }
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const result =
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
        ? response.data.data
        : response.data;
    return toCamel(result);
  },
  async (error) => {
    if ((import.meta as any).env?.DEV) {
      console.error("[API ERROR]", {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    if (error.response?.status === 401) {
      localStorage.removeItem("mami_token");
      sessionStorage.removeItem("mami_token");
      window.location.hash = "#/login";
    }
    let apiError = error.response?.data?.error || {
      code: "INTERNAL_ERROR",
      message: error.message || "Unknown network error",
    };

    const parsed = apiErrorSchema.safeParse(apiError);
    if (!parsed.success) {
      apiError = {
        code: "INTERNAL_ERROR",
        message: "Malformed error response from server",
        details: { original: apiError, issues: parsed.error.issues },
      };
    } else {
      apiError = parsed.data;
    }
    return Promise.reject(new AppError(apiError));
  },
);
