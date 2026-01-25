## Executive Summary
- Auth: 2 gaps (forgot-password flow, register OTP not verified server-side).
- Storefront: 5 gaps (wishlist, notifications feed, product reviews/shipping/returns, address GPS tagging, premium toggle).
- Ops: 7 gaps (manual order CTA, ops alerts dropdown, manual sync, damage report notify, dashboard metrics, warehouse map, staff performance) + inventory table actions.
- Admin: 2 gaps (fleet map coordinates, delivery slot update endpoint).

## Findings
| Area | Route / Component path | Trigger | Current behavior | Category (1/2/3/4) | Real endpoint expected | Contract needed (req/resp) | DB touchpoint | Minimal fix steps | Verification steps | Risk / notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Auth | /forgot-password – `src/pages/auth/ForgotPassword.tsx` | “Send reset link” button (disabled) | Button disabled; copy says not implemented | 2 (Backend-missing) | POST `/auth/forgot-password` | `{ email }` → `{ ok }`; reset endpoint for token | `users`, `password_resets` | Wire button to service; add reset screen; handle success/error | DevTools: POST fired; email/token stored; retry with bad email shows error | Needs backend mail + token flow |
| Auth | /register – `src/pages/auth/Register.tsx` | OTP code inputs + “Complete Setup” | 4-digit code only gates local state; not sent to backend | 1 (UI-only) | POST `/auth/register/verify-otp` | `{ email, code }` → `{ ok }` | `verification_codes`, `users` | Add verify call before creating account/login; disable submit until verified | Network verify call; failure blocks account creation | Requires backend OTP endpoint |
| Store | Header – `src/components/layout/store-header/NotifDropdown.tsx` | Bell dropdown | Shows “Notification feed not connected yet.” | 1 (UI-only) | GET `/store/notifications` | Response `{ items:[{id,text,created_at,severity,read}] }` | `notifications` | Add service method; fetch on open; mark read optional | DevTools call; list renders; empty state on [] | Backend feed needed |
| Store | Wishlist – `src/components/store/ProductCard.tsx`, `ProductGallery.tsx` | Heart wishlist buttons | Toast “Wishlist not connected yet”; no state change | 1 (UI-only) | POST/DELETE `/store/wishlist` | `{ product_id }` → updated list | `wishlist` (user_id, product_id) | Add service; optimistic toggle; sync with response | Network add/remove; refresh shows persisted | Backend endpoint required |
| Store | Product tabs – `src/components/store/ProductTabs.tsx` | “Reviews”, “Shipping & Returns” tabs | Static text: reviews not available; returns not connected | 2 (Backend-missing) | GET `/catalog/products/:id/reviews`; GET `/store/shipping-info` | Reviews list; shipping/returns copy per product/category | `reviews`, `policies` | Add service hooks; render loading/empty/error | DevTools requests; data persists on refresh | Requires new endpoints/content |
| Store | Address GPS tag – `src/hooks/useAddresses.ts` | “Use current location” | Only local toast “captured locally (not saved yet)” | 1 (UI-only) | PATCH `/api/v1/me/addresses/:id/location` | `{ lat,lng }` → updated address | `addresses` | Add coords support in profile service; update list | Network call; address shows coords after refresh | Backend support for coords |
| Store | Account premium toggle – `src/pages/store/AccountLayout.tsx` | “Premium Member” button | Toggles local state + toast; no persistence | 1 (UI-only) | POST `/profile/membership` | `{ tier }` → `{ tier }` | `users`, `memberships` | Add service call; reflect tier from profile | Network call; reload shows same tier | Backend membership support |
| Ops | Ops header alerts – `src/components/layout/OpsHeader.tsx` | Bell dropdown (OPS_NOTIFS) | Static alerts array; no fetch | 1 (UI-only) | GET `/ops/alerts` | `{ items:[{id,text,type,time}] }` | `alerts` | Add service call; handle empty/error | DevTools call; alerts persist | Needs backend feed |
| Ops | Manual order CTA – `src/components/layout/OpsHeader.tsx` | “New Order” button | Toast “Manual order creation not connected yet.” | 1 (UI-only) | POST `/ops/orders/manual` | `{ customer_id?, items }` → `{ order_id }` | `orders`, `order_items` | Add modal to collect minimal payload; call service; navigate | Network POST; order appears in ops list | Backend spec needed |
| Ops | Picking manual sync – `src/components/ops/PickingFooter.tsx` | Rotate sync button | Toast “Sync not connected yet” | 1 (UI-only) | POST `/ops/orders/:id/sync` | `{}` → refreshed order/items | `orders`, `order_items` | Add service method; refresh pick list on success | DevTools call; items update; persists after refresh | Backend endpoint required |
| Ops | Picking damage report – `src/components/ops/PickingItemDetail.tsx` | “Report Damage” | 1s delay then toast “notifications not connected yet” | 1 (UI-only) | POST `/ops/orders/:order_id/items/:item_id/report-damage` | `{ reason, notes? }` → updated item/audit entry | `order_items`, `audit` | Add reason input; call service; refresh item | Network POST; audit/log visible; refresh persists | Backend endpoint + audit logging |
| Ops | Dashboard metrics – `src/pages/ops/Dashboard.tsx` | Stat cards “Batch Efficiency”, “Live Pickers” | Shows “N/A / Metric not implemented” | 3 (Partial) | GET `/ops/performance` | Metrics fields (efficiency, live_pickers, etc.) | `orders`, `picks`, `users` | Hook to service; render loading/error/empty | DevTools call; numbers persist after refresh | Backend must return metrics |
| Ops | Warehouse map – `src/pages/ops/WarehouseMap.tsx` | Map section | Disabled with notice; lists branches only | 2 (Backend-missing) | GET `/ops/map` with real coords | `{ branches:[{id,name,lat,lng}], warehouse:{...}, bins? }` | `branches`, `bins` | Use map only when coords present; fallback list | DevTools call; map renders pins; refresh persists | Requires geospatial data |
| Ops | Staff performance – `src/pages/ops/StaffPerformance.tsx` | Page content | “Performance metrics not available yet” | 2 (Backend-missing) | GET `/ops/performance` | `{ metrics: {...} }` | `picks`, `orders`, `users` | Consume performance endpoint; show states | DevTools call; metrics persist | Backend metrics needed |
| Ops | Inventory actions – `src/pages/inventory/InventoryTable.tsx` | Action menu (move/archive buttons) | Toast `${action} initiated` only | 1 (UI-only) | PATCH `/inventory/:id` or workflow endpoints | Payload for move/archive/status | `inventory`, `branches` | Wire buttons to real inventory update; refresh data | DevTools call; table reflects change after reload | Need endpoint definitions |
| Admin | Fleet map coordinates – `src/pages/admin/FleetTracker.tsx` | Map view | Notice coordinates missing; map disabled | 2 (Backend-missing) | GET `/admin/fleet/status` incl. lat/lng | `{ vehicles:[{id,status,lat,lng,...}] }` | `vehicles`, `telemetry` | Add coords to response; render map when present | DevTools call; pins show; refresh persists | Telemetry data needed |
| Admin | Delivery slot updates – `src/pages/admin/DeliverySlotManager.tsx` | Slot edit/toggle controls | Toast “Endpoint not implemented for updates” | 2 (Backend-missing) | PATCH `/admin/delivery-slots/:id` | `{ status?, capacity?, blackout_dates? }` | `delivery_slots` | Add service method; wire buttons; handle loading/error | DevTools call; slot updates persist after reload | Backend endpoint missing |

Category legend: 1) UI-only; 2) Backend-missing; 3) Partial; 4) Missing-UI.

## Quick Wins (top 5)
1. Forgot password: add service + wire button to POST `/auth/forgot-password`.
2. Delivery slot updates: implement service PATCH `/admin/delivery-slots/:id` and connect existing controls.
3. Ops dashboard metrics: hook cards to `/ops/performance` if backend available.
4. Store notifications feed: fetch via `/store/notifications` with loading/empty/error.
5. Wishlist hearts: add add/remove endpoints; update hearts and local cache.

## Needs Backend Work
- OTP verification endpoint for registration.
- Wishlist, store notifications feed, reviews/shipping/returns endpoints.
- Manual order creation, ops alerts feed, picking sync, damage reporting.
- Performance metrics + geospatial data (warehouse map, fleet map).
- Inventory action endpoints (move/archive/transfer).
- Password recovery endpoints and email delivery.

## Verification Checklist
- Each action triggers an API call (method/path/payload visible in DevTools).
- Success updates UI and persists after refresh.
- Errors surface backend message; no silent success toasts.
- Empty responses show honest empty state.
- Re-run `rg -i "not connected|not implemented|N/A"` to ensure only true backend gaps remain.
