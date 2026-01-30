import { apiClient } from "@/services/api-client";
import type { User } from "./types";

const toUser = (dto: any): User => ({
  id: dto.id,
  email: dto.email,
  firstName: dto.first_name || dto.firstName,
  lastName: dto.last_name || dto.lastName,
  role: dto.role,
  phone: dto.phone,
  avatarUrl: dto.avatar_url || dto.avatarUrl,
});

export const usersService = {
  getAll: async (params?: Record<string, unknown>): Promise<{ results: User[]; count: number }> => {
    const data = await apiClient.get<any, any>("/api/v1/admin/users", { params });
    return {
      results: Array.isArray(data.results) ? data.results.map(toUser) : [],
      count: data.count,
    };
  },
  getById: async (userId: number | string): Promise<User> => {
    const data = await apiClient.get<any, any>(`/api/v1/admin/users/${userId}`);
    return toUser(data);
  },
  update: async (userId: number | string, payload: Partial<User>): Promise<User> => {
    // Map camelCase to snake_case for backend
    const req: any = { ...payload };
    if (req.firstName !== undefined) req.first_name = req.firstName;
    if (req.lastName !== undefined) req.last_name = req.lastName;
    if (req.avatarUrl !== undefined) req.avatar_url = req.avatarUrl;
    delete req.firstName;
    delete req.lastName;
    delete req.avatarUrl;
    const data = await apiClient.patch<any, any>(`/api/v1/admin/users/${userId}`, req);
    return toUser(data);
  },
  toggle: async (userId: number | string): Promise<User> => {
    const data = await apiClient.patch<any, any>(`/api/v1/admin/users/${userId}/toggle`);
    return toUser(data);
  },
};
