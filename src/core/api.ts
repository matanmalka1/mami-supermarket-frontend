import { authService } from '../services/auth-service';
import { opsService } from '../services/ops-service';
import { adminService } from '../services/admin-service';
import { catalogService } from '../services/catalog-service';
import { apiClient } from '../services/api-client';

export const apiService = {
  auth: authService,
  ops: opsService,
  admin: adminService,
  catalog: catalogService,
  profile: {
    get: authService.getProfile,
    update: authService.updateProfile,
    getAddresses: authService.getAddresses,
    addAddress: authService.addAddress,
  },
  orders: {
    list: (params?: any) => apiClient.get<any[], any[]>('/orders', { params }),
    get: (id: string) => apiClient.get<any, any>(`/orders/${id}`),
    cancel: (id: string) => apiClient.post(`/orders/${id}/cancel`),
  },
  checkout: {
    preview: (data: any) => apiClient.post('/checkout/preview', data),
    confirm: (data: any, idempotencyKey: string) => 
      apiClient.post('/checkout/confirm', data, { headers: { 'Idempotency-Key': idempotencyKey } }),
  }
};