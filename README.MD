# Mami Supermarket - Frontend Application

A modern, production-grade React application providing comprehensive e-commerce shopping experiences for customers and powerful operational tools for store employees, managers, and administrators.

## Project Overview

The Mami Supermarket frontend is a single-page application (SPA) built with React and Vite that serves multiple user types through distinct interfaces:

### User Types and Flows

**Customers** - Public-facing shopping experience:

- Browse product catalog with categories and search
- Add products to cart with real-time inventory validation
- Manage delivery addresses and payment methods
- Complete checkout with delivery slot selection
- Track order status and history
- Manage wishlists and favorites
- Update profile settings

**Employees** - Operational workflows:

- View assigned orders for picking
- Update order status during fulfillment
- Mark items as picked or missing
- Submit stock adjustment requests
- Monitor inventory levels
- View performance metrics

**Managers** - Administrative capabilities:

- All employee permissions
- Approve/reject stock requests
- Manage product catalog (create, edit, archive)
- Configure delivery slots
- View analytics and performance reports
- Manage branch settings

**Admins** - Full system access:

- All manager permissions
- User account management
- System-wide settings configuration
- Audit log access
- Global inventory management

### Relationship with Backend API

The frontend is a **client-only application** that communicates exclusively with the backend API via RESTful HTTP requests. All business logic, data validation, and persistence are handled by the backend. The frontend:

- Makes authenticated API calls using JWT tokens
- Handles response data and error states
- Provides optimistic UI updates where appropriate
- Implements client-side routing and navigation
- Manages local state for UI interactions

## Tech Stack

| Component            | Technology                                    |
| -------------------- | --------------------------------------------- |
| **Framework**        | React 19.0                                    |
| **Build Tool**       | Vite 6.0                                      |
| **Language**         | TypeScript 5.6+                               |
| **Styling**          | Tailwind CSS 4.0 (alpha)                      |
| **Routing**          | React Router DOM 7.1                          |
| **State Management** | Zustand 5.0 (lightweight) + React Context API |
| **Forms**            | React Hook Form 7.54                          |
| **Validation**       | Zod 3.24                                      |
| **HTTP Client**      | Axios 1.7                                     |
| **UI Components**    | Radix UI primitives + custom components       |
| **Icons**            | Lucide React                                  |
| **Notifications**    | React Hot Toast                               |
| **Date Handling**    | date-fns 4.1                                  |
| **Testing**          | Vitest 2.1 + React Testing Library            |
| **Linting**          | ESLint 9 with TypeScript support              |

## Application Architecture

### Folder Structure

```
mami-supermarket-frontend/
├── src/
│   ├── main.tsx                    # Application entry point
│   ├── App.tsx                     # Root component with providers
│   ├── api.ts                      # Barrel export for API services
│   │
│   ├── app/                        # Core application configuration
│   │   ├── router.tsx             # Route definitions and guards
│   │   └── guards/                # Route protection components
│   │       ├── RequireAuth.tsx    # Authentication guard
│   │       └── RoleGuard.tsx      # Role-based access guard
│   │
│   ├── domains/                    # Domain-driven feature modules
│   │   ├── auth/                  # Authentication domain
│   │   │   ├── service.ts         # Auth API calls
│   │   │   └── types.ts           # Auth type definitions
│   │   ├── cart/                  # Cart management
│   │   ├── catalog/               # Product catalog
│   │   ├── checkout/              # Checkout flow
│   │   ├── orders/                # Order management
│   │   ├── ops/                   # Operations (employee)
│   │   ├── admin/                 # Admin functions
│   │   └── users/                 # User management
│   │
│   ├── features/                   # Feature-based components
│   │   └── store/                 # Customer store features
│   │       └── wishlist/          # Wishlist feature
│   │
│   ├── pages/                      # Page components
│   │   ├── auth/                  # Auth pages (Login, Register, etc.)
│   │   ├── store/                 # Customer pages (Storefront, Checkout, etc.)
│   │   ├── ops/                   # Employee pages (Dashboard, Picking, etc.)
│   │   ├── admin/                 # Admin pages (Catalog, Analytics, etc.)
│   │   └── errors/                # Error pages (404, 403, etc.)
│   │
│   ├── layouts/                    # Layout components
│   │   ├── StoreLayout.tsx        # Customer-facing layout
│   │   └── OpsLayout.tsx          # Operations/admin layout
│   │
│   ├── components/                 # Shared UI components
│   │   ├── store/                 # Store-specific components
│   │   └── ...                    # Reusable components
│   │
│   ├── context/                    # React Context providers
│   │   ├── CartProvider.tsx       # Global cart state
│   │   ├── cart-context.tsx       # Cart context definition
│   │   └── wishlist-context.tsx   # Wishlist context
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.ts             # Authentication hook
│   │   └── ...                    # Other custom hooks
│   │
│   ├── services/                   # Core services
│   │   ├── api-client/            # HTTP client configuration
│   │   └── api.ts                 # Unified API service
│   │
│   ├── utils/                      # Utility functions
│   │   ├── roles.ts               # Role constants and helpers
│   │   └── ...                    # Other utilities
│   │
│   └── validation/                 # Zod validation schemas
│
├── tests/                          # Test files (mirrors src structure)
│   ├── setup.ts                   # Test environment setup
│   ├── render.tsx                 # Test rendering utilities
│   └── ...                        # Test files
│
├── DOCS/                           # Project documentation
│   ├── STRUCTURE.md               # Architecture documentation
│   ├── TODO_REFACTOR.md           # Refactoring tasks
│   └── ...                        # Additional docs
│
├── index.html                      # HTML entry point
├── vite.config.ts                 # Vite configuration
├── vitest.config.ts               # Vitest configuration
├── tsconfig.json                  # TypeScript configuration
├── eslint.config.ts               # ESLint configuration
├── package.json                   # Dependencies and scripts
└── .env                           # Environment variables (not in git)
```

### Pages vs Components vs Layouts

**Pages** (`src/pages/`):

- Top-level route components
- Coordinate data fetching and business logic
- Compose smaller components and features
- Map to specific routes in the application
- Examples: `Storefront.tsx`, `Dashboard.tsx`, `ProductDetail.tsx`

**Components** (`src/components/`):

- Reusable UI elements
- Self-contained, presentational logic
- Accept props for configuration
- No direct data fetching (receive data via props)
- Examples: `ProductCard.tsx`, `Button.tsx`, `Modal.tsx`

**Layouts** (`src/layouts/`):

- Wrapper components for pages
- Provide consistent structure (header, sidebar, footer)
- Handle navigation and user session display
- Two main layouts:
  - `StoreLayout.tsx`: Customer-facing interface with shopping cart
  - `OpsLayout.tsx`: Operations interface for employees/managers/admins

### Guards (Auth / Role)

**Authentication Guard** (`RequireAuth.tsx`):

```typescript
// Checks if user has valid JWT token
// Redirects to /login if not authenticated
<RequireAuth>
  <ProtectedComponent />
</RequireAuth>
```

**Role Guard** (`RoleGuard.tsx`):

```typescript
// Checks if user has required role
// Redirects to /403 if insufficient permissions
<RoleGuard allowedRoles={['MANAGER', 'ADMIN']}>
  <AdminComponent />
</RoleGuard>
```

Guards are composed in the router configuration to create protected routes.

### Contexts / Hooks Usage

**Contexts** provide global state accessible throughout the component tree:

- **CartProvider** (`context/CartProvider.tsx`):
  - Manages shopping cart state
  - Provides cart operations (add, remove, update quantity)
  - Syncs with backend API
  - Exposes cart drawer visibility

- **WishlistProvider** (`context/wishlist-context.tsx`):
  - Manages user wishlists
  - Provides add/remove operations
  - Persists to backend

**Custom Hooks** encapsulate reusable logic:

- **useAuth** (`hooks/useAuth.ts`):
  - Manages authentication state
  - Provides login/logout functions
  - Extracts user role from JWT
  - Handles token persistence (localStorage vs sessionStorage)

- **useCartState** & **useCartActions**:
  - Separate state management from operations
  - Enable granular re-renders
  - Optimize performance

### Domain or Feature-Based Separation

The application uses a **domain-driven architecture** where code is organized by business domain rather than technical concern:

**Domains** (`src/domains/`):

- Each domain represents a business capability
- Contains types, API services, and domain-specific logic
- Examples: `auth`, `cart`, `catalog`, `checkout`, `orders`, `ops`, `admin`
- Benefits: Cohesion, discoverability, easier testing

**Features** (`src/features/`):

- Cross-cutting features that span multiple pages
- Self-contained feature modules
- Example: `wishlist` feature with its own pages, components, and logic

This structure reduces coupling, improves maintainability, and makes it easy to locate code by business function.

## Routing & Navigation

### Public vs Protected Routes

**Public Routes** (no authentication required):

- `/login` - User login
- `/register` - New user registration
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset confirmation

**Protected Routes** (authentication required):

- All other routes require valid JWT token
- Unauthenticated users redirected to `/login`

### Role-Based Access

Routes are protected based on user roles:

**Customer Routes** (`/store/*`):

- `/store` - Product storefront
- `/store/category/:id` - Category view
- `/store/product/:id` - Product details
- `/store/search` - Search results
- `/store/checkout` - Checkout flow
- `/store/order-success` - Order confirmation
- `/store/account/*` - Account management
  - `/store/account/orders` - Order history
  - `/store/account/addresses` - Address book
  - `/store/account/profile` - Profile settings
  - `/store/account/wishlist` - Wishlist

**Operations Routes** (Employee, Manager, Admin):

- `/` - Operations dashboard
- `/picking/:id` - Order picking interface
- `/inventory` - Inventory management
- `/audit` - Audit logs (Manager+)
- `/performance` - Staff performance (Manager+)
- `/stock-requests` - Stock requests

**Admin Routes** (Manager, Admin only):

- `/admin/analytics` - Analytics dashboard
- `/admin/catalog` - Catalog management
- `/admin/requests` - Stock request approval
- `/admin/delivery` - Delivery slot configuration
- `/admin/settings` - Global settings
- `/admin/branches` - Branch management (Admin)
- `/admin/users` - User management (Admin)

### Ops/Admin Separation

The application maintains a clear separation between customer-facing and operational interfaces:

**Customer Interface** (`/store/*`):

- Uses `StoreLayout` with shopping-focused navigation
- Cart drawer accessible from all pages
- Product-centric navigation
- Mobile-optimized shopping experience

**Operations Interface** (`/*` root level):

- Uses `OpsLayout` with operational navigation
- Sidebar with role-appropriate menu items
- Task-oriented workflows
- Desktop-optimized for efficiency

Users with operational roles (Employee+) are automatically redirected to the operations interface on login. Admins and managers can access both interfaces as needed.

## State & Data Flow

### Global State Strategy

The application uses a **hybrid state management approach**:

1. **Zustand** (lightweight global state):
   - Used selectively for truly global state
   - Type-safe with TypeScript
   - Minimal boilerplate
   - Examples: User preferences, UI state

2. **React Context API** (component tree state):
   - Cart state (`CartProvider`)
   - Wishlist state (`WishlistProvider`)
   - Authentication state (`useAuth`)
   - Scoped to specific feature areas

3. **Local Component State** (`useState`):
   - UI interactions (modals, dropdowns, form inputs)
   - Temporary state that doesn't need sharing
   - Performance optimization (no unnecessary re-renders)

### Local vs Server State

**Local State** (client-only):

- UI state (drawer open/closed, active tab, etc.)
- Form input values before submission
- Optimistic updates during API calls
- Temporary filters and search queries

**Server State** (source of truth on backend):

- User profile and authentication
- Product catalog and inventory
- Cart contents (synced with backend)
- Orders and order history
- All persisted data

**State Synchronization Strategy**:

- Cart: Local state kept in sync with server via API calls
- Optimistic updates for better UX (add to cart immediately, rollback on error)
- Periodic polling for real-time updates (order status changes)
- Invalidation on critical actions (checkout clears cart)

### API Services Pattern

All API communication follows a consistent pattern:

```typescript
// Domain service (src/domains/catalog/service.ts)
export const catalogService = {
  getProducts: async (params) => {
    const response = await apiClient.get("/catalog/products", { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await apiClient.get(`/catalog/products/${id}`);
    return response.data;
  },
};
```

**API Client** (`src/services/api-client/`):

- Axios instance with interceptors
- Automatic token injection (Authorization header)
- Error handling and transformation
- Request/response logging (development)
- Base URL configuration via environment variable

**Service Layer** (`src/domains/*/service.ts`):

- Encapsulates all HTTP requests
- Typed request/response interfaces
- Domain-specific error handling
- Reusable across components

### Error Handling in UI

**API Error Handling Flow**:

1. **Service Layer**: Catches HTTP errors, transforms to domain errors
2. **Component Layer**: Handles domain errors, updates UI state
3. **User Feedback**: Displays error toast notifications or inline messages

**Error UI Patterns**:

- **Toast Notifications** (via react-hot-toast):
  - Temporary, non-blocking messages
  - Success, error, warning, info variants
  - Auto-dismiss after 4 seconds
  - Used for operation feedback (item added to cart, save successful)

- **Inline Error Messages**:
  - Form validation errors (field-level)
  - Persistent until user corrects input
  - Clear, actionable messages

- **Error States**:
  - Full-page error for critical failures
  - Empty states for "no data" scenarios
  - Retry actions for network failures

- **Error Boundaries**:
  - Catch React rendering errors
  - Graceful degradation
  - Error reporting to monitoring service

**Example Error Handling**:

```typescript
try {
  await catalogService.getProductById(id);
} catch (error) {
  if (error.response?.status === 404) {
    toast.error("Product not found");
    navigate("/store");
  } else if (error.response?.status === 401) {
    toast.error("Session expired. Please log in again.");
    logout();
  } else {
    toast.error("Failed to load product. Please try again.");
  }
}
```

## Environment Variables

The application uses Vite's environment variable system. Create a `.env` file in the project root:

| Variable             | Required | Default                 | Description                                                  |
| -------------------- | -------- | ----------------------- | ------------------------------------------------------------ |
| `VITE_API_BASE_URL`  | No       | `/api`                  | Base URL for API requests (proxied in dev, full URL in prod) |
| `VITE_DEV_API_PROXY` | No       | `http://localhost:5000` | Backend API URL for Vite dev server proxy                    |

### Purpose of Each Variable

**`VITE_API_BASE_URL`**:

- Used by the API client to construct request URLs
- In development: `/api` (proxied by Vite to avoid CORS)
- In production: Full API URL (e.g., `https://api.mami-supermarket.com`)

**`VITE_DEV_API_PROXY`**:

- Configures Vite's development proxy target
- Points to local backend server during development
- Allows frontend to run on different port than backend
- Avoids CORS issues in development

**Environment-Specific Configuration**:

Development (`.env.local`):

```
VITE_API_BASE_URL=/api
VITE_DEV_API_PROXY=http://localhost:5000
```

Production (set via hosting platform):

```
VITE_API_BASE_URL=https://api.mami-supermarket.com
```

**Accessing Environment Variables**:

```typescript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
```

All `VITE_*` prefixed variables are exposed to the client code. Never include sensitive secrets in frontend environment variables.

## Local Development

### Install Dependencies

```bash
npm install
```

### Run Dev Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` by default.

**Development Server Features**:

- Hot Module Replacement (HMR) for instant updates
- Automatic proxy to backend API (`/api/*` → `http://localhost:5000`)
- TypeScript type checking
- Fast refresh for React components

**Prerequisites**:

- Backend API must be running on `http://localhost:5000` (or update `VITE_DEV_API_PROXY`)
- Node.js 18+ and npm 9+

### Build for Production

```bash
npm run build
```

**Build Output**:

- Optimized production bundle in `dist/` directory
- Minified JavaScript and CSS
- Tree-shaken dependencies
- Code splitting for optimal loading

**Build Verification**:

```bash
npm run preview
```

Serves the production build locally on `http://localhost:4173` for testing.

### Linting / Formatting Commands

**Run ESLint**:

```bash
npm run lint
```

Checks TypeScript and TSX files for code quality issues.

**Run Tests**:

```bash
npm test
```

Runs Vitest test suite with watch mode.

**Type Checking**:

```bash
npx tsc --noEmit
```

Validates TypeScript types without emitting files.

**Code Duplication Detection**:

```bash
npm run jscpd
```

Generates code duplication report in `reports/jscpd/`.

## UX & UI Principles

### Design System Approach

The application follows a **component-based design system**:

- **Atomic Components**: Small, reusable building blocks (Button, Input, Badge)
- **Composite Components**: Combine atoms into functional units (ProductCard, OrderSummary)
- **Layout Components**: Structure pages consistently (Header, Sidebar, Footer)
- **Theme Consistency**: Tailwind CSS utility classes ensure visual consistency

**Design Tokens** (via Tailwind):

- Color palette: Primary, secondary, accent, neutral, semantic (success, error, warning)
- Typography: Font families, sizes, weights, line heights
- Spacing: Consistent spacing scale (4px increments)
- Border radius: Rounded corners for cards and buttons
- Shadows: Elevation system for depth

### Reusable Components

**Core UI Components**:

- **Buttons**: Primary, secondary, outline, ghost variants
- **Forms**: Input, Select, Checkbox, Radio, TextArea
- **Cards**: Product cards, order cards, info cards
- **Modals**: Confirmation dialogs, forms, detail views
- **Drawers**: Cart drawer, filter drawer
- **Tables**: Data tables with sorting, pagination
- **Badges**: Status indicators, counts
- **Toasts**: Notifications (react-hot-toast)

**Composition Pattern**:

Components are designed for composition:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Product Name</CardTitle>
  </CardHeader>
  <CardContent>
    <ProductImage />
    <ProductPrice />
  </CardContent>
  <CardFooter>
    <AddToCartButton />
  </CardFooter>
</Card>
```

### Empty / Loading / Error States

**Loading States**:

- Skeleton screens for content placeholders
- Spinner for async operations
- Progress bars for multi-step processes
- Disabled state for buttons during submission

**Empty States**:

- Illustrative icons or graphics
- Clear messaging ("No products found")
- Call-to-action buttons ("Browse catalog")
- Helpful suggestions ("Try different filters")

**Error States**:

- Inline error messages for form validation
- Toast notifications for operation failures
- Full-page error for critical failures (404, 500)
- Retry actions where applicable

### Accessibility Considerations

**Keyboard Navigation**:

- All interactive elements accessible via Tab key
- Logical tab order through forms and pages
- Escape key closes modals and drawers
- Enter key submits forms

**Screen Reader Support**:

- Semantic HTML (header, nav, main, article, section)
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content
- Alt text for all images

**Visual Accessibility**:

- Sufficient color contrast (WCAG AA compliance)
- Focus indicators on interactive elements
- Responsive text sizing
- Clear error messaging

**Form Accessibility**:

- Associated labels for all inputs
- Error messages linked to fields
- Required field indicators
- Validation feedback

## Production Build

### How to Build

```bash
npm run build
```

**Build Process**:

1. TypeScript compilation (`tsc`)
2. Vite bundling and optimization
3. Asset optimization (images, fonts)
4. Code splitting by route
5. Output to `dist/` directory

**Build Optimization**:

- Tree shaking removes unused code
- Minification reduces file size
- Gzip/Brotli compression
- Lazy loading for route components
- Asset hashing for cache busting

### Deployment Assumptions

The frontend is designed to be deployed as a **static site** that communicates with a separate backend API:

**Deployment Targets**:

- **Static Hosting**: Netlify, Vercel, AWS S3 + CloudFront, GitHub Pages
- **Container**: Docker image served by Nginx
- **CDN**: Global distribution for optimal performance

**Build Artifacts**:

- `dist/` directory contains all static files
- `index.html` is the entry point
- `assets/` contains JavaScript, CSS, images

**Server Requirements**:

- Serve `index.html` for all routes (SPA routing)
- HTTPS enabled (required for secure cookies)
- CORS headers if API on different domain
- Gzip/Brotli compression enabled

**Example Nginx Configuration**:

```nginx
server {
  listen 80;
  server_name app.mami-supermarket.com;
  root /usr/share/nginx/html;
  index index.html;

  # SPA routing - serve index.html for all routes
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Cache static assets
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # Security headers
  add_header X-Frame-Options "SAMEORIGIN";
  add_header X-Content-Type-Options "nosniff";
  add_header X-XSS-Protection "1; mode=block";
}
```

### Environment Alignment with Backend

**Production Configuration**:

1. **API URL**: Set `VITE_API_BASE_URL` to production backend URL

   ```
   VITE_API_BASE_URL=https://api.mami-supermarket.com
   ```

2. **CORS**: Backend must allow frontend origin in `CORS_ALLOWED_ORIGINS`

   ```
   CORS_ALLOWED_ORIGINS=https://app.mami-supermarket.com
   ```

3. **Cookies**: Backend JWT cookies must be configured for cross-domain if needed

   ```
   Cookie: SameSite=None; Secure
   ```

4. **HTTPS**: Both frontend and backend must use HTTPS in production

**Deployment Checklist**:

- [ ] `VITE_API_BASE_URL` set to production backend
- [ ] Backend CORS configured for frontend domain
- [ ] HTTPS certificates installed and validated
- [ ] Environment variables set in hosting platform
- [ ] Build tested locally with `npm run preview`
- [ ] Error tracking configured (Sentry, LogRocket, etc.)
- [ ] Analytics configured (Google Analytics, Plausible, etc.)
- [ ] Performance monitoring enabled
- [ ] CDN configured for global distribution
- [ ] Cache headers optimized

**Health Check**:

After deployment, verify:

- Application loads successfully
- API requests complete without CORS errors
- Login/logout flow works
- Routes navigate correctly
- Images and assets load
- No console errors
- Performance metrics acceptable (Lighthouse score)

---

## Additional Resources

- **Vite Documentation**: https://vitejs.dev/
- **React Documentation**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **React Router**: https://reactrouter.com/
- **Zustand**: https://github.com/pmndrs/zustand
- **React Hook Form**: https://react-hook-form.com/
- **Zod**: https://zod.dev/

For questions or issues, contact the development team or create an issue in the repository.
