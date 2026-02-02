import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { apiErrorSchema } from "@/validation/apiError";
import { toCamel, toSnake } from "./api-client/transformers";
import { getBaseUrl, getAuthToken, clearAuthTokens } from "./api-client/auth";

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

const BASE_URL = getBaseUrl();

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    if (config.headers && "Authorization" in config.headers) {
      delete config.headers.Authorization;
    }
    if ((import.meta as any).env?.DEV) {
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
    
    const camelCased = toCamel(result);
    
    // Debug logging for auth responses
    if ((import.meta as any).env?.DEV && response.config.url?.includes('/auth/')) {
      console.debug("[apiClient] Auth response:", {
        url: response.config.url,
        originalData: response.data,
        extracted: result,
        camelCased: camelCased
      });
    }
    
    return camelCased;
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
      clearAuthTokens();
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
