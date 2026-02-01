import { apiClient } from "@/services/api-client";
import type { AuditQuery, AuditPage, AuditRecord } from "./types";

const toAuditRecord = (dto: any): AuditRecord => ({
  id: dto.id,
  action: dto.action,
  actor: dto.actor,
  target: dto.target,
  details: dto.details,
  createdAt: dto.created_at || dto.createdAt,
});

export const auditService = {
  get: async (params?: AuditQuery): Promise<AuditPage> => {
    const data = await apiClient.get<any, any>("/api/v1/admin/audit", {
      params,
    });
    return {
      results: Array.isArray(data.results)
        ? data.results.map(toAuditRecord)
        : [],
      count: data.count,
      page: data.page,
      pageSize: data.page_size || data.pageSize,
    };
  },
};
