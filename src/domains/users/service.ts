import { apiClient } from "@/services/api-client";
import { transformDtoToUser, transformUserToRequest } from "@/utils/user-transformer";
import type { User } from "./types";

export const usersService = {
  getCurrentUser: async (): Promise<User> => {
    const data = await apiClient.get<any, any>("/me");
    return transformDtoToUser(data);
  },
  getAll: async (
    params?: Record<string, unknown>,
  ): Promise<{ results: User[]; count: number }> => {
    const data = await apiClient.get<any, any>("/api/v1/admin/users", {
      params,
    });
    return {
      results: Array.isArray(data.results) ? data.results.map(transformDtoToUser) : [],
      count: data.count,
    };
  },
  getById: async (userId: number | string): Promise<User> => {
    const data = await apiClient.get<any, any>(`/api/v1/admin/users/${userId}`);
    return transformDtoToUser(data);
  },
  update: async (
    userId: number | string,
    payload: Partial<User>,
  ): Promise<User> => {
    const req = transformUserToRequest(payload);
    const data = await apiClient.patch<any, any>(
      `/api/v1/admin/users/${userId}`,
      req,
    );
    return transformDtoToUser(data);
  },
  toggle: async (userId: number | string): Promise<User> => {
    const data = await apiClient.patch<any, any>(
      `/api/v1/admin/users/${userId}/toggle`,
    );
    return transformDtoToUser(data);
  },
};
