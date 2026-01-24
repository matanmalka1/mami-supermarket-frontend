import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { AppError } from "../types/error";

// Single source of truth for baseURL
const getBaseUrl = () => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl;
  }
  // Use /api/v1 for default
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
  if (config.params) config.params = toSnake(config.params);
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
      localStorage.removeItem("mami_role");
      sessionStorage.removeItem("mami_token");
      window.location.hash = "#/login";
    }
    const apiError = error.response?.data?.error || {
      code: "INTERNAL_ERROR",
      message: error.message || "Unknown network error",
    };
    return Promise.reject(new AppError(apiError));
  },
);
