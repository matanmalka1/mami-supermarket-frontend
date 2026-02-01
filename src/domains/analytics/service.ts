// Analytics service for revenue endpoint

export type AnalyticsRevenue = {
  labels: string[];
  values: number[];
};

import { apiClient } from "@/services/api-client";

export const analyticsService = {
  getRevenue: async (): Promise<AnalyticsRevenue> => {
    const data = await apiClient.get<any, any>(
      "/api/v1/admin/analytics/revenue",
    );
    return {
      labels: Array.isArray(data.labels) ? data.labels : [],
      values: Array.isArray(data.values) ? data.values : [],
    };
  },
};
