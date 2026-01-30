import { describe, expect, it, vi } from "vitest";

const { patch } = vi.hoisted(() => ({
  patch: vi.fn(),
}));

vi.mock("./api-client", () => ({
  apiClient: {
    patch,
  },
}));

import { adminService } from "./admin-service";

describe("adminService.updateStock", () => {
  it("sends snake_case quantities", async () => {
    patch.mockResolvedValue({});

    await adminService.updateStock(1, {
      availableQuantity: 7,
      reservedQuantity: 2,
    });

    expect(patch).toHaveBeenCalledTimes(1);
    expect(patch).toHaveBeenCalledWith("/admin/inventory/item-1", {
      available_quantity: 7,
      reserved_quantity: 2,
    });
  });
});
