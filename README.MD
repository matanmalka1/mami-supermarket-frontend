# Mami Supermarket — Frontend

A modern, full-featured supermarket e-commerce platform built with React 19, Vite, and Tailwind CSS. This frontend application provides a complete shopping experience for customers, staff operations tools, and comprehensive admin management capabilities.

---

## 📋 Project Overview

Mami Supermarket is a multi-role platform that handles:

- **Customer Shopping:** Browse products, search, manage cart, checkout with delivery/pickup options
- **Order Management:** Track orders, view history, manage delivery addresses
- **Staff Operations:** Order picking, inventory management, stock requests
- **Admin & Manager Tools:** Product catalog, inventory control, branch management, analytics
- **Logistics & Marketing:** Delivery slots, promotions, loyalty programs, supplier management

**Current Status:** Customer storefront (catalog/search/product), auth/profile, cart, checkout, orders, and ops dashboards are built; admin is limited to stock-requests for now. Analytics, full admin catalog/branches, and marketing/support suites remain pending.

**Status Snapshot:**

- Customer journey: browsing → cart → checkout → order history live
- Profile: account dashboard, settings, addresses, security live
- Ops: orders board, order details, staff performance, stock requests live
- Admin: stock-requests review only (catalog/inventory/analytics not yet)
- Testing: Vitest + React Testing Library configured; coverage focused on cart, ops, admin screens; manual QA checklist still required

---

## 🛠 Tech Stack

### Frontend

- **React 19** — UI library
- **Vite** — Build tool and dev server
- **React Router** — Client-side routing with role-based guards
- **Tailwind CSS** — Utility-first styling
- **Axios** — HTTP client with interceptors
- **React Hook Form + Zod** — Form management and validation
- **react-hot-toast** — Toast notifications
- **Radix UI Select** — Accessible dropdown components
- **Vitest + React Testing Library** — Unit/component tests

### Backend (external API expectations)

- REST API with `/api/v1` base (configurable via `VITE_API_BASE_URL`)
- JWT auth; endpoints defined in `src/api/endpoints.js`
- Success envelope `{ data: ... }`, error envelope `{ error: { code, message, details } }`

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see backend repo)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd mami-supermarket-frontend

# Install dependencies
npm install
```

### Development

```bash
# Start dev server (default: http://localhost:5173)
npm run dev
```

**Environment Variables:**
Create `.env` or `.env.local` (defaults to `/api/v1` if unset):

```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 🏗 Architecture

### High-Level Structure

```
Frontend (React SPA)
  ↕
Backend REST API (Node.js/Express)
  ↕
Database (PostgreSQL) + Cache (Redis)
```

### Key Architectural Layers

1. **Routing & Guards** (`src/app/router.jsx`)
   - Role-based route protection (Customer, Staff, Manager, Admin)
   - Layout groups (AuthLayout, MainLayout)

2. **API Layer** (`src/api/`)
   - Centralized HTTP client (`http.js`)
   - Domain-specific API modules (`*.api.js`)
   - Error normalization into `AppError` shape

3. **Features** (`src/features/`)
   - Domain-driven folders: `auth/`, `catalog/`, `cart/`, `checkout/`, `orders/`, `ops/`, `admin/`
   - Each feature contains: `pages/`, `components/`, `hooks/`, `services/`, `validators/`

4. **Global State Providers** (`src/app/providers/`)
   - `AuthProvider` — User session, token, role
   - `CartProvider` — Cart state and guest cart merge logic

5. **Shared Components** (`src/components/`)
   - Reusable UI: inputs, buttons, loading/empty/error states, pagination

6. **Utilities & Types** (`src/utils/`, `src/types/`)
   - Debounce, error messages, pagination helpers
   - Shared TypeScript-like types (JS-friendly)

---

## 📱 Feature Scope (38 Screens)

### 1) Customer Storefront (Shopping Journey)

- **Storefront Home & Groceries** — Landing page with featured products
- **Category Product Listing** — Browse products by category
- **Product Details View** — Detailed product info, add to cart
- **Supermarket Search Results** — Search with autocomplete
- **Supermarket Cart Overview** — View/edit cart items
- **Checkout - Fulfillment Selection** — Choose delivery or pickup
- **Checkout Order Preview** — Review order, apply coupons, see totals
- **Checkout - Payment Method** — Select payment (credit card, cash, etc.)
- **Order Success Confirmation** — Post-order confirmation page

### 2) Customer Account & Authentication

- **Customer Login Screen** — Email/password login
- **Customer Registration Screen** — New account signup
- **Account Dashboard Hub** — Customer profile overview
- **My Order History** — Paginated list of past orders
- **Order Details View** — Single order detail + cancel option
- **My Profile Settings** — Edit name, email, phone
- **Manage Delivery Addresses** — Add/edit/delete delivery addresses

### 3) Operations & Staff (Fulfillment & Inventory)

- **Operations - Orders Dashboard** — Staff view of all orders (filters, sorting)
- **Grocery Order Picking List** — Item-by-item picking interface
- **New Stock Request Form** — Request inventory replenishment
- **My Stock Requests History** — Track submitted stock requests
- **Staff Performance Dashboard** — KPIs, picking speed, accuracy
- **Warehouse Aisle Mapping** — Visual warehouse layout (if applicable)

### 4) Admin Management (Catalog & Business)

- **Manager Analytics Dashboard** — Sales, revenue, trends
- **Product Catalog Management** — CRUD for products
- **Add New Product Form** — Create new product entries
- **Category Management Dashboard** — Manage product categories
- **Bulk Inventory Upload** — CSV/Excel import for stock updates
- **Admin Inventory Control** — View/edit inventory levels
- **Stock Request Management** — Approve/reject staff stock requests

### 5) Logistics, Marketing & Support

- **Supermarket Branch Management** — Manage store locations
- **Branch Configuration Details** — Hours, contact, address
- **Delivery Slot Scheduling** — Configure available delivery windows
- **Delivery Route Planning** — Optimize delivery routes (if applicable)
- **Promotions & Coupons Manager** — Create/edit discount campaigns
- **Loyalty Program Settings** — Configure rewards program
- **Supplier Directory Management** — Manage supplier contacts
- **Customer Feedback & Reviews** — View/moderate product reviews
- **Support Ticket Dashboard** — Customer support ticket system
- **Help Center Management** — FAQ and help articles
- **Global System Settings** — App-wide configuration (taxes, fees, etc.)

### 6) Shared Utility & Errors

- **Page Not Found - 404** — Fallback for invalid routes

---

## 👥 Roles & Permissions

| Role         | Access                                                               |
| ------------ | -------------------------------------------------------------------- |
| **Guest**    | Browse catalog, search, view products (no cart/checkout until login) |
| **Customer** | Full shopping experience, cart, checkout, order history, profile     |
| **Staff**    | Operations dashboard, order picking, stock requests                  |
| **Manager**  | Analytics, product/category management, inventory control, approvals |
| **Admin**    | All manager features + global settings, branch config, users         |

**Role Guards:**

- Customer routes: `/cart`, `/checkout`, `/orders`, `/profile/*`
- Staff routes: `/ops/*`
- Manager/Admin routes: `/admin/*`

Unauthenticated users are redirected to `/auth/login`.  
Unauthorized role access redirects to `/` (or `/403` if implemented).

---

## 🌐 API & Environments

### API Base URL

Set via `VITE_API_BASE_URL` (fallback `/api/v1`).

**Development example:**

```
http://localhost:3000/api/v1
```

**Production example:**

```
https://api.mami-supermarket.com/api/v1
```

### API Response Envelope

**Success:**

```json
{
  "data": { ... }
}
```

**Error:**

```json
{
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Some items are out of stock",
    "details": { ... }
  }
}
```

All API calls are normalized into `AppError` shape in the frontend.

---

## 🧪 Testing

### Unit Tests

**Framework:** Vitest + React Testing Library

```
# Run unit/component tests
npm run test

# Run with coverage
npm run test:coverage
```

**Current Status:** Test harness is configured with coverage for cart, ops, admin, and profile flows; broader journey/e2e coverage still pending. Manual QA checklist (see `AGENTS.md`) remains required before release.

**Manual QA Checklist (Minimum):**

- Guest cart → localStorage
- Login merges guest cart
- Catalog search/autocomplete
- Cart CRUD operations
- Checkout preview updates
- Checkout confirm: double-submit prevention, error handling
- Staff operations: picking, status transitions

---

## 📂 Project Structure

```
src/
├── api/                    # Centralized HTTP layer
│   ├── http.js             # Axios instance + interceptors
│   ├── endpoints.js        # API path constants
│   └── *.api.js            # Domain API modules
├── app/
│   ├── router.jsx          # React Router configuration
│   ├── guards/             # ProtectedRoute (role-based)
│   ├── layouts/            # AuthLayout, MainLayout
│   └── providers/          # AuthProvider, CartProvider
├── features/               # Feature-driven folders
│   ├── auth/
│   ├── catalog/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── ops/                # Staff operations
│   └── admin/              # Manager/Admin features
├── components/             # Shared UI components
├── utils/                  # Shared helpers (debounce, pagination)
├── types/                  # Shared types (errors.js)
└── styles/                 # Global CSS (globals.css)
```

**File Size Limit:** All non-markdown files must be ≤150 lines (enforced).

---

## 🤝 Contribution & Workflow

**Format (append-only):**

1. Goal
2. Files touched
3. Changes made
4. Commands/tests run
5. Result/next step

### Code Quality Gates

A feature is **DONE** only if:

- Uses centralized API layer (no raw axios in UI)
- Forms use React Hook Form + Zod
- Loading/empty/error states exist
- Error codes are mapped to user messages
- Role-based guards protect routes
- Checkout changes trigger preview revalidation
- Code passes `npm run lint`
- Build succeeds (`npm run build`)

### Branching (ASSUMPTION)

- `main` — Production-ready code
- `develop` — Active development branch
- Feature branches: `feature/<feature-name>`
- Hotfixes: `hotfix/<issue>`

---

## 📄 Documentation

- **AGENTS.md** — Agent responsibilities, rules, quality gates
- **TODO.md** — Phased task roadmap

---

## 📞 Contact & Support

**Project Maintainer:** [Your Name/Team]  
**Issue Tracker:** [GitHub Issues URL]  
**Slack/Discord:** [Team Chat Link]

---

## 📜 License

[MIT / Proprietary / Other] — (Update as needed)

---

**Last Updated:** January 21, 2026