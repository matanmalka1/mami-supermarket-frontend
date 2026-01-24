# BACKEND (Flask + Postgres)
- **App structure**: `app/__init__.py` app factory wires config (`app/config.py`), extensions (`extensions.py` for db/jwt/limiter), middleware (CORS, request id/logger, security headers, error handlers, session teardown), and blueprints under `app/routes`. Business logic in `app/services/*`, DTOs in `app/schemas/*` (pydantic, extra fields forbidden), models/enums in `app/models/*`, helpers in `app/utils/*` (responses, pagination, request parsing, logging). Migrations via Alembic (`alembic/`, `alembic.ini`).
- **Auth + roles**: JWT (Flask-JWT-Extended). Decorators `require_auth`/`require_role`/`require_ownership` set `g.current_user`. Roles: CUSTOMER, EMPLOYEE, MANAGER, ADMIN. Rate limits via `limiter`.
- **Responses**: `success_envelope({"data": ... , meta?})` for most routes; errors use `error_envelope({error:{code,message,details}})`. Admin users list (`GET /admin/users`) returns a plain object `{data,total,...}`.
- **Route inventory (authoritative)**  
  - **Auth (`/api/v1/auth`, auth_routes.py)**: `POST /register` body `{email,password,full_name,role?}` → envelope AuthResponse 201; `POST /login` body `{email,password}` → envelope AuthResponse; `GET /me` jwt_required → envelope User; forgot/reset/change password per DTOs.  
  - **Profile (`/api/v1/me`, profile_routes.py)**: `GET /me` profile; `PATCH /me` body `{full_name?,phone?}`; addresses CRUD `POST/PUT` body `{address_line,city,postal_code,country,is_default?}`; `PATCH /addresses/<id>/default`; all JWT.  
  - **Catalog (public, catalog_routes.py, prefix `/api/v1/catalog`)**:  
    - `GET /categories` query `limit,offset` → envelope `{data,meta}`.  
    - `GET /categories/<category_id>/products` query `limit,offset,branchId?`.  
    - `GET /products/<product_id>` query `branchId?`.  
    - `GET /products/search` query `limit,offset,q?,categoryId?,branchId?,inStock?,min_price?,max_price?,organic_only?,sort?` → envelope `{data,meta{has_next}}`.  
    - `GET /products/featured` query `limit,branchId?`.  
    - `GET /products/autocomplete` query `q,limit`.  
  - **Branches (`/api/v1/branches`, branches_routes.py)**: `GET /branches` query `limit,offset`; `GET /delivery-slots` query `dayOfWeek?,branchId?`; both envelopes.  
  - **Cart (`/api/v1/cart`, cart_routes.py)**: JWT; `GET /cart`; `POST /cart/items` body `{product_id,quantity}` 201; `PUT /cart/items/<id>` same body; `DELETE /cart/items/<id>`; `DELETE /cart`. All return envelope cart.  
  - **Checkout (`/api/v1/checkout`, checkout_routes.py)**: JWT required. `POST /preview` body `{cart_id,fulfillment_type,branch_id?,delivery_slot_id?,address?}` → envelope preview. `POST /confirm` requires `Idempotency-Key` header; body `{cart_id,payment_token_id,fulfillment_type?,branch_id?,delivery_slot_id?,address?,save_as_default}` → envelope confirm (201 new / 200 idempotent).  
  - **Orders (`/api/v1/orders`, orders_routes.py)**: JWT customer; `GET /orders` query `limit,offset`; `GET /orders/<id>`; `POST /orders/<id>/cancel`; envelopes.  
  - **Ops (`/api/v1/ops`, ops_routes.py)**: JWT + role EMPLOYEE/MANAGER/ADMIN. `GET /ops/orders` query `status?,dateFrom?,dateTo?,limit,offset`; `GET /ops/orders/<id>`; `PATCH /ops/orders/<oid>/items/<iid>/picked-status` body `{picked_status,reason?,replacement_product_id?}`; `PATCH /ops/orders/<oid>/status` body `{status}`; `POST /ops/batches` body `{orderIds:[...]}`; `GET /ops/stock-requests` query `branchId?,status?,limit,offset`; `POST /ops/stock-requests` body `{branch_id,product_id,quantity,request_type}`; `GET /ops/performance`; `GET /ops/map`; envelopes.  
  - **Stock Requests (`/api/v1/stock-requests`, stock_requests_routes.py)**: JWT + role EMPLOYEE/MANAGER/ADMIN. `POST /stock-requests` body `{branch_id,product_id,quantity,request_type}` 201; `GET /stock-requests/my` pagination; admin review (MANAGER/ADMIN) `GET /stock-requests/admin`, `GET /stock-requests/admin/<id>`, `PATCH /stock-requests/admin/<id>/resolve` body `{status,approved_quantity?,rejection_reason?}`, `PATCH /stock-requests/admin/bulk-review` body `{items:[{request_id,status,approved_quantity?,rejection_reason?}]}`.  
  - **Admin Catalog (`/api/v1/admin`, admin_catalog_routes.py)**: MANAGER/ADMIN. `POST /admin/categories` body `{name,description?}` 201; `PATCH /admin/categories/<id>` body same; `PATCH /admin/categories/<id>/toggle` query `active`; `POST /admin/products` body `{name,sku,price,category_id,description?}` 201; `PATCH /admin/products/<id>` body `{name?,sku?,price?,category_id?,description?}`; `PATCH /admin/products/<id>/toggle` query `active`.  
  - **Admin Branches/Inventory (`/api/v1/admin`, admin_branches_routes.py)**: MANAGER/ADMIN. Branch CRUD/toggle; delivery slots `POST/PATCH /admin/delivery-slots`, `PATCH /admin/delivery-slots/<id>/toggle`, `GET /admin/delivery-slots`; inventory `GET /admin/inventory` query `limit,offset,branchId?,productId?`; `PATCH /admin/inventory/<id>` body `{available_quantity,reserved_quantity}`; `POST /admin/inventory/bulk` CSV.  
  - **Admin Settings (`/api/v1/admin`, admin_settings_routes.py)**: MANAGER/ADMIN for PUT. `GET /admin/settings` ADMIN; `PUT /admin/settings` body allows `delivery_min,delivery_fee,slots` (optional) → envelope `{data:{...}}`.  
  - **Admin Users (`/api/v1/admin/users`, admin_users_routes.py)**: MANAGER/ADMIN. `GET /admin/users` query `q?,role?,isActive?,limit,offset` returns plain `{data,total,limit,offset}`; `GET /admin/users/<id>` envelope; `PATCH /admin/users/<id>` body `{role?,is_active?,full_name?,phone?}` envelope; `PATCH /admin/users/<id>/toggle` query `active`.  
  - **Admin Fleet (`/api/v1/admin/fleet/status`, admin_fleet_routes.py)**: MANAGER/ADMIN; envelope fleet_status (driver list + coords/status if available).  
  - **Admin Analytics (`/api/v1/admin/analytics/revenue`, admin_analytics_routes.py)**: ADMIN; query `range` (12m|90d|30d default), `granularity?`; returns `{data:{labels,values}}` (no envelope).  
  - **Audit (`/api/v1/admin/audit`, audit_routes.py)**: MANAGER/ADMIN; query `entityType?,action?,actorId?,dateFrom?,dateTo?,limit,offset`; envelope with pagination.  
  - **Health (`/api/v1/health`)**: public; envelope `{status:"ok"}`.

# FRONTEND (React + TypeScript)
- **Structure**: Vite app. `src/App.tsx` mounts `AppRouter`, `CartProvider`, Toaster. Routing in `src/app/router.tsx` with `RequireAuth` + `RoleGuard`. Layouts: `components/layout/StoreLayout`, `components/layout/OpsLayout`. UI primitives under `components/ui/*`; feature components under `components/store`, `components/ops`, `components/admin`.
- **API layer**: `services/api-client.ts` uses axios base `/api/v1` (or `VITE_API_BASE_URL`), injects JWT from sessionStorage (preferred) or localStorage, snake-cases request bodies only (params kept as-is), camel-cases responses, unwraps `data` envelope, clears storage and redirects on 401. Domain services: `services/admin-service.ts`, `catalog-service.ts`, `ops-service.ts`, `orders-service.ts`, `profile-service.ts`, etc.; aggregated in `services/api.ts`.
- **Auth/state**: `hooks/useAuth` stores `mami_token` in sessionStorage (and optionally localStorage) plus `mami_role`; login/register pages extract `data.access_token` envelope; RoleGuard checks role from state/storage. Cart via `context/CartContext` + localStorage. Other server state via feature hooks (`useInventory`, `useCatalogManager`, `usePicking`, etc.).
- **Router inventory (router.tsx)**  
  - Unauth: `/login`, `/register`, `/forgot-password` (redirect all else to `/login`).  
  - Auth + ADMIN branch (OpsLayout): `/` Dashboard; `/picking/:id`; `/inventory`; `/logistics`; `/fleet`; `/audit`; `/performance`; `/stock-requests`; `/map`; `/admin/analytics`; `/admin/catalog`; `/admin/requests`; `/admin/delivery`; `/admin/settings`.  
  - Auth customer branch (StoreLayout): `/store`; `/store/category/:id`; `/store/search`; `/store/product/:id`; `/store/checkout`; `/store/order-success/:id`; `/store/account` → `orders | addresses | settings`. Fallback: ADMIN → `/`, others → `/store`.  
  - Note: router still passes mock tokens to login/register callbacks, but page logic uses real API responses to set storage.
- **Page → API map (current)**
  - Login/Register: `apiService.auth.login/register` hitting `/auth/login` and `/auth/register` with `{email,password}` / `{email,password,full_name,role?}`; tokens read from `data.access_token`.
  - Dashboard: `apiService.ops.getOrders` → `GET /ops/orders` with filters.  
  - Picking: `apiService.ops.getOrder`, `apiService.ops.updateItemStatus` (`PATCH /ops/orders/:oid/items/:iid/picked-status`), MissingItemModal search uses `GET /catalog/products/search` with `q`. Weight modal is simulated/manual (see No Fake Data).  
  - Inventory: `apiService.admin.getInventory` (`GET /admin/inventory`), `apiService.admin.updateStock` (`PATCH /admin/inventory/:id` body `{available_quantity,reserved_quantity}`).  
  - Logistics/Fleet: `apiService.admin.getFleetStatus` (`GET /admin/fleet/status`); map disabled if no coords.  
  - Stock Requests (ops): `apiService.ops.createStockRequest` (`POST /ops/stock-requests`) body `{branch_id,product_id,quantity,request_type}`.  
  - Admin Stock Request Manager: list/resolve wired to `/stock-requests/admin` + resolve/bulk-review endpoints.  
  - Admin Catalog: list via `GET /catalog/products/search`, categories via `GET /catalog/categories`; create/edit via `POST/PATCH /admin/products`; toggle via `PATCH /admin/products/:id/toggle`.  
  - Delivery Slots: `GET /admin/delivery-slots` through admin service.  
  - Global Settings: `GET/PUT /admin/settings` sending only `delivery_min,delivery_fee,slots`.  
  - Analytics: `GET /admin/analytics/revenue`.  
  - Storefront: categories/featured products fetched from `/catalog/categories` and `/catalog/products/featured`; product detail `/catalog/products/:id`; category view/search via `/catalog/products/search`.  
  - Checkout: wired to `POST /checkout/preview` and `POST /checkout/confirm` with `Idempotency-Key` header per backend contract.  
  - Account: orders list `GET /orders`; addresses CRUD `/me/addresses`; profile settings largely UI-only.  
  - Cart: cart drawer uses `apiService.cart` for cart CRUD endpoints.

# NO FAKE DATA
- Removed/rewired: storefront featured/categories now from catalog APIs; logistics uses real fleet status; recently viewed mock removed (empty state if none); delivery slots manager uses `/admin/delivery-slots`; admin catalog uses real search/create/edit/toggle endpoints; inventory table uses initials fallback (no picsum); avatars replaced with initials badge; admin fleet map no simulated pins (list-only when no coords); staff performance shows “not available yet” instead of random metrics; weight scale no randomness—manual entry flagged “Simulated scale”; stock requests/admin inventory/admin settings payloads aligned to backend contracts.
- Remaining simulations: weight scale hardware (manual entry with `isSimulated` flag); router still seeds mock token on login/register callbacks though pages set real tokens—treat live token from API as source of truth.

# CHECKOUT VERIFICATION
- Login as customer, ensure `mami_token` set.
- Add items to cart and open `/store/checkout`.
- Verify preview calls `POST /api/v1/checkout/preview` and totals/fees match response.
- Click confirm (single and double-click) and see `POST /api/v1/checkout/confirm` with `Idempotency-Key` header.
- On success, cart clears and navigate to `/store/order-success/:orderId`.
- Orders history (`/store/account/orders`) shows the new order.

# VERIFICATION CHECKLIST
- Commands:  
  - `cd mami-supermarket-frontend && npm run build`  
  - `cd mami-supermarket-backend && .venv/bin/python -m flask --app app:create_app routes` (ensure routes load)  
  - Optional: `cd mami-supermarket-backend && .venv/bin/pytest` (if DB configured).
- Manual flows (authenticated with valid JWT):  
  - Login/Register → tokens stored (`mami_token` JWT) and role in storage.  
  - Ops Dashboard/orders list (GET `/ops/orders`).  
  - Admin settings PUT `/admin/settings` with `delivery_min|fee|slots`.  
  - Admin catalog create/edit/toggle product.  
  - Admin inventory update `{available_quantity,reserved_quantity}`.  
  - Stock requests: ops create, admin list + resolve/bulk-review.  
  - Delivery slots list.  
  - Fleet status list renders (map only if coords present).  
  - Storefront browse/search/category/product detail; cart add/update/remove; checkout preview/confirm wired with idempotency.  
  - Addresses CRUD under account; orders history loads.  
- Manual smoke (auth + customer flow):  
  - Login → storefront → add items to cart → open checkout (preview runs).  
  - Confirm once; immediately double-click/refresh to confirm idempotent behavior.  
  - Land on order success page and see order in account history.

## BASELINE (Step 0)
- Frontend `npm run build`: ✅ (chunk-size warning from Vite; `/index.css` missing at build time – unchanged runtime resolution).
- Frontend `npm run lint`: ❌ fails loading `eslint.config.ts` (`TypeError: Cannot read properties of undefined (reading 'recommended')`). Needs config fix before linting can run.

## FINDINGS (Step 1 – reuse/dedupe scan)
- Unused / mock leftovers: `src/core/constants.ts` still exports `MOCK_ORDERS`, `MOCK_PRODUCTS`, `MOCK_VEHICLES`, `MOCK_DELIVERY_SLOTS` (largely superseded by live endpoints); check any remaining imports before removal.  
- Duplicate patterns:  
  - Many pages implement ad-hoc empty/loading messages (Inventory, Storefront categories/featured, AddressBook, OrderHistory, AuditLogs).  
  - Confirm dialogs vary; `ConfirmDialog` exists but some pages roll custom button/confirm patterns.  
  - Array-unwrapping logic repeated across pages/services (`items` vs array; featured/categories/analytics).  
- Reuse candidates (top impact):  
  1) Shared `EmptyState` + `LoadingState` components (`src/components/ui/EmptyState.tsx` etc.) to replace repeated “No data/Loading...” blocks across Storefront, Inventory, AuditLogs, OrderHistory.  
  2) Helper `asArray(data)` in `src/utils/normalize.ts` to unify `Array.isArray(data?.items)?...` checks (used in catalog, inventory, fleet).  
  3) Consolidate confirm dialog usage to `ConfirmDialog` (CatalogManager, GlobalSettings, Inventory actions).  
  4) Shared table shell (header/body/row) for ops/admin tables (OrderTable, InventoryTable, StockRequest tables).  
  5) Shared “fetch + loading + error” hook wrapper for simple GET lists (Storefront categories/featured, Fleet status, AuditLogs fetch-more).  
  6) Address form mapping helper to avoid repeated DTO shaping between Account AddressBook and any admin address usage.  
  7) Stock request payload builder shared between ops create and admin resolve flows.  
  8) Shared badge variants (status/color) for inventory/stock requests/orders to reduce repeated `Badge` color conditionals.  
  9) Shared price formatter already exists (`currencyILS`); ensure all price displays use it (InventoryTable etc.).  
  10) Shared avatar/initials badge already in `AvatarBadge`; replace remaining inline avatar circles.
