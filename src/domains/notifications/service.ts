import { apiClient } from "@/services/api-client";


export type NotificationFeed = {
  items: any[];
  unreadCount: number;
};

export const notificationsService = {
  getFeed: async (): Promise<NotificationFeed> => {

    const data = await apiClient.get<any, any>("/api/v1/store/notifications");
    return {
      items: Array.isArray(data.items) ? data.items : [],
      unreadCount: typeof data.unreadCount === "number" ? data.unreadCount : 0,
    };
  },
};
