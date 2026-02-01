import { apiClient } from "@/services/api-client";
import type { DeliverySlot, CreateDeliverySlotRequest } from "./types";

const toDeliverySlot = (dto: any): DeliverySlot => ({
	id: dto.id,
	startTime: dto.start_time || dto.startTime,
	endTime: dto.end_time || dto.endTime,
	date: dto.date,
});

export const deliveryService = {
	getPublicSlots: async (params?: { dayOfWeek?: number; branchId?: number }): Promise<DeliverySlot[]> => {
		const data = await apiClient.get<any[], any[]>("/api/v1/delivery-slots", { params });
		return Array.isArray(data) ? data.map(toDeliverySlot) : [];
	},
	adminGetSlots: async (): Promise<DeliverySlot[]> => {
		const data = await apiClient.get<any[], any[]>("/api/v1/admin/delivery-slots");
		return Array.isArray(data) ? data.map(toDeliverySlot) : [];
	},
	adminCreateSlot: async (payload: CreateDeliverySlotRequest): Promise<DeliverySlot> => {
		const data = await apiClient.post<any, any>("/api/v1/admin/delivery-slots", payload);
		return toDeliverySlot(data);
	},
	adminUpdateSlot: async (
		slotId: number,
		payload: { day_of_week: number; start_time: string; end_time: string }
	): Promise<DeliverySlot> => {
		const data = await apiClient.patch<any, any>(`/api/v1/admin/delivery-slots/${slotId}`, payload);
		return toDeliverySlot(data);
	},
	adminToggleSlot: async (slotId: number, active: boolean): Promise<DeliverySlot> => {
		const data = await apiClient.patch<any, any>(`/api/v1/admin/delivery-slots/${slotId}/toggle`, { active });
		return toDeliverySlot(data);
	},
	adminGetSettings: async (): Promise<{ deliveryMin: number; deliveryFee: number; slots: string }> => {
		const data = await apiClient.get<any, any>("/api/v1/admin/settings");
		return {
			deliveryMin: data.delivery_min,
			deliveryFee: data.delivery_fee,
			slots: data.slots,
		};
	},
	adminPutSettings: async (payload: { deliveryMin?: number; deliveryFee?: number; slots?: string }): Promise<{ deliveryMin?: number; deliveryFee?: number; slots?: string }> => {
		// Map camelCase to snake_case for backend
		const req: any = {};
		if (payload.deliveryMin !== undefined) req.delivery_min = payload.deliveryMin;
		if (payload.deliveryFee !== undefined) req.delivery_fee = payload.deliveryFee;
		if (payload.slots !== undefined) req.slots = payload.slots;
		const data = await apiClient.put<any, any>("/api/v1/admin/settings", req);
		// Echo only allowed keys, no persistence
		return {
			deliveryMin: data.delivery_min,
			deliveryFee: data.delivery_fee,
			slots: data.slots,
		};
	},
};
