# Changelog — FinanceBank Banking LOB Application

All notable changes to this project are documented in this file.  
Built on top of the [agent-toolkit-ts](https://github.com/thivy/agent-toolkit-ts) starter (branch `skill-updates`).

---

## [1.0.0] — 2026-02-06

### Summary

Transformed the bare `agent-toolkit-ts` starter template into **FinanceBank**, a full-featured banking Line-of-Business portal. **60 files changed** — 12,473 lines added across 66 files (7 modified, 59 new).

---

### 🔐 Authentication & Authorization

| File | Status | Description |
|---|---|---|
| `web/auth.ts` | **New** | NextAuth v5 configuration — Credentials provider (3 dev test accounts: admin, manager, user) + optional Microsoft Entra ID. JWT strategy, custom sign-in page, `authorized`/`jwt`/`session` callbacks. |
| `web/proxy.ts` | **New** | Next.js 16 route protection proxy (replaces traditional middleware). Protects `/dashboard`, `/customers`, `/orders`, `/reports`, `/settings`, `/admin` — redirects unauthenticated users to `/auth/signin`. |
| `web/app/api/auth/[...nextauth]/route.ts` | **New** | NextAuth API route handler — exports `GET` and `POST` from auth handlers. |
| `web/types/next-auth.d.ts` | **New** | TypeScript module augmentation — extends `User`, `Session`, and `JWT` types with `id` and `role` fields. |
| `web/.env.local` | **New** | Environment variables: `AUTH_SECRET`, `AUTH_URL` (gitignored — not committed). |
| `.env.example` | **New** | Template for required environment variables with placeholder values. |

---

### 🏠 App Shell & Root Layout

| File | Status | Description |
|---|---|---|
| `web/app/layout.tsx` | **Modified** | Updated metadata from "Agent Toolkit TS" → `title: { default: "FinanceBank — Business Portal", template: "%s \| FinanceBank" }`. Added `<ToastProvider>` wrapper. |
| `web/app/globals.css` | **Modified** | Fixed broken `--font-geist-mono` CSS variable (font was never loaded) → replaced with system monospace fallback stack. |
| `web/next.config.ts` | **Modified** | Added `poweredByHeader: false` + security headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. |
| `web/app/page.tsx` | **Modified** | Entry point — imports `HomePage` from `features/home/home-page.tsx` (unchanged, but the component it renders was replaced). |
| `package.json` (root) | **New** | Root package.json that proxies `dev`/`build`/`start`/`lint`/`format` scripts to `web/` via `bun run --cwd web`. |

---

### 📄 Pages — Public

| File | Status | Description |
|---|---|---|
| `web/features/home/home-page.tsx` | **Replaced** | Was placeholder "Hello / This is my $1 Billion app" → full banking landing page with hero section, stats row ($2.5B+, 50K+, 99.9%), 3 feature cards, footer. |
| `web/app/auth/signin/page.tsx` | **New** | Split-screen sign-in page: left branding panel (stats, tagline — hidden on mobile), right login form. Uses React 19 `useActionState()`. Quick-login buttons for 3 test accounts. Wrapped in `<Suspense>` for `useSearchParams()`. |
| `web/app/auth/signin/actions.ts` | **New** | Server action for sign-in — validates credentials, open-redirect protection (`callbackUrl` must start with `/` and not `//`), re-throws non-`AuthError` (preserves redirect errors). |
| `web/app/error.tsx` | **New** | Root error boundary — branded UI with "Try Again" + "Go Home" buttons, shows `error.digest` for support. |
| `web/app/loading.tsx` | **New** | Root loading spinner — "FB" logo + animated circle + "Loading…" text. |
| `web/app/not-found.tsx` | **New** | Branded 404 page — "FB" logo, "404 / Page Not Found", nav buttons to dashboard and home. |

---

### 🔒 Pages — Authenticated

| File | Status | Description |
|---|---|---|
| `web/app/(authenticated)/layout.tsx` | **New** | Server component — calls `auth()`, redirects if no session. `<SessionProvider>` wrapper + `<Sidebar>` + inline top bar with mobile nav trigger, notification/help buttons. Includes skip-to-content link (`<a href="#main-content">`) + `id="main-content"` target. |
| `web/app/(authenticated)/error.tsx` | **New** | Error boundary for authenticated routes — "Go to Dashboard" instead of "Go Home". |
| `web/app/(authenticated)/loading.tsx` | **New** | Skeleton loading UI — header bar, 4 stat card placeholders, 5-row table skeleton with `animate-pulse`. |
| `web/app/(authenticated)/dashboard/page.tsx` | **New** | Dashboard with session-aware greeting, role badge (via shared `getRolePillClasses()`), role-based alert banners (admin/manager), 4 stat cards (inline), quick actions grid, recent activity feed, account summary sidebar, security notice. |
| `web/app/(authenticated)/customers/page.tsx` | **New** | Thin route file — renders `<CustomerPage>` from `features/customers/`. |
| `web/app/(authenticated)/orders/page.tsx` | **New** | Thin route file — renders `<OrderPage>` from `features/orders/`. |
| `web/app/(authenticated)/reports/page.tsx` | **New** | Reports page — 4 report type cards (Transaction, Client, Revenue, Compliance), selectable with Generate/Cancel. Recent reports table with View/Download actions. Role-gated Schedule Report button and Download for managers+. |
| `web/app/(authenticated)/settings/page.tsx` | **New** | Settings with 4 tabs (Profile, Security, Notifications, Preferences). All `<label>` elements have `htmlFor`/`id` pairs. Notification toggles use `<button role="switch" aria-checked>` for accessibility. |
| `web/app/(authenticated)/admin/layout.tsx` | **New** | Server-side admin role guard — calls `auth()`, redirects to `/dashboard` if `role !== "admin"`. Prevents client-side bypass. |
| `web/app/(authenticated)/admin/users/page.tsx` | **New** | User management — search, role filter, stats (total/active/admin counts), change role / toggle active / delete with confirm dialog. Session loading guard to prevent "Access Denied" flash. |
| `web/app/(authenticated)/admin/audit/page.tsx` | **New** | Audit log — searchable by user/action/target, filterable by status (success/failed/warning). 8 mock entries. Session loading guard. |

---

### 🧩 UI Components (`web/components/ui/`)

| File | Status | Description |
|---|---|---|
| `input.tsx` | **New** | Styled `<input>` with focus ring, error state support, `cn()` merging. |
| `badge.tsx` | **New** | Badge with variants: default, secondary, destructive, outline. |
| `select.tsx` | **New** | Styled `<select>` wrapper matching input styling. |
| `skeleton.tsx` | **New** | Animated loading placeholders (`animate-pulse`) — `Skeleton`, `SkeletonText`, `SkeletonCard`. |
| `empty-state.tsx` | **New** | Icon + title + description + optional action slot for empty data states. |
| `pagination.tsx` | **New** | Page navigation: previous/next, numbered pages, page-size selector. |
| `toast.tsx` | **New** | Toast notification system — `ToastProvider` + `useToast()` hook + standalone `toast()` via CustomEvent. 4 types (success/error/warning/info), auto-dismiss, `aria-live="polite"`. |
| `dialog.tsx` | **New** | Native `<dialog>` element with `showModal()`/`close()`. Uses `addEventListener("cancel", …)` (not `onCancel` prop) for React StrictMode compatibility. Backdrop click to close. |
| `confirm-dialog.tsx` | **New** | Wraps `Dialog` for confirm/cancel flows — customisable labels and destructive variant. |
| `error-boundary.tsx` | **New** | React class-based error boundary with fallback UI and retry button. |

---

### 🏗️ Block Components (`web/components/blocks/`)

| File | Status | Description |
|---|---|---|
| `sidebar.tsx` | **New** | Fixed left sidebar (`w-64`). 5 main nav items + 2 admin nav items (role-gated). Uses `pathname.startsWith()` for active highlighting. User profile at bottom with role badge via shared `roleBadge()`. |
| `header.tsx` | **New** | Standalone header component (optional — not imported by default layout). Banking top-bar, 3 desktop nav links, mobile nav trigger, sign-out menu. |
| `mobile-nav.tsx` | **New** | Sliding drawer navigation. Escape key closes, route change closes, body scroll lock. Exports `AuthenticatedMobileNav` pre-configured with 5 nav items. |
| `stat-card.tsx` | **New** | Reusable KPI card — label, value, icon, change with trend indicator. Available for reuse (dashboard currently uses inline cards). |

---

### 🛠️ Shared Utilities (`web/components/lib/`)

| File | Status | Description |
|---|---|---|
| `role-utils.ts` | **New** | DRY role→colour mapping used by sidebar, dashboard, and admin pages. Exports `getRoleBadgeClasses()`, `getRolePillClasses()`, `formatRole()`, `roleBadge()`. |

---

### 📦 Feature Modules

#### Customers (`web/features/customers/`)

| File | Status | Description |
|---|---|---|
| `types.ts` | **New** | `Customer` interface (`id`, `name`, `email`, `company`, `status`, `createdAt`, `updatedAt`), `CreateCustomerInput`, `UpdateCustomerInput`. |
| `customer-page.tsx` | **New** | Full CRUD page — search/filter, add button, create/edit dialog, delete with confirm, pagination. 12+ mock customers. Uses Zustand store. |
| `customer-table.tsx` | **New** | Sortable table with column headers, status badges (active/inactive/pending), edit/delete actions. |
| `customer-form.tsx` | **New** | Form for create/edit — name, email, company, status fields with validation. |

#### Orders (`web/features/orders/`)

| File | Status | Description |
|---|---|---|
| `types.ts` | **New** | `Order` (with `items: OrderItem[]`, `total`, 5 statuses), `OrderItem`, `CreateOrderInput`, `UpdateOrderInput`. |
| `order-page.tsx` | **New** | Full CRUD page — search, status filter, create/edit dialog, delete confirm, pagination. Mock multi-item orders. |
| `order-table.tsx` | **New** | Sortable table with total formatting, item count, status badges. |
| `order-form.tsx` | **New** | Form with customer selection, dynamic line items (name, quantity, price), auto-calculated total. |

#### Shared (`web/features/shared/`)

| File | Status | Description |
|---|---|---|
| `api-client.ts` | **New** | Generic HTTP client scaffolding — `request<T>()`, `ApiError` class, `api` object with REST methods, `queryKeys`. Not actively called (pages use mock data). |
| `api/customer-api.ts` | **New** | Customer-specific API functions (scaffolding for future backend). |

---

### 🗄️ State Management (`web/store/`)

| File | Status | Description |
|---|---|---|
| `use-customer-store.ts` | **New** | Zustand store with `subscribeWithSelector` middleware. Decoupled actions pattern — 11 exported action functions. State: customers, selectedCustomer, filter, pagination, sorting. |
| `use-order-store.ts` | **New** | Same pattern as customer store. Adds `customerIdFilter`. Sort default: `createdAt` desc. 12 exported actions. |

---

### 📋 Dependencies Added

| Package | Version | Purpose |
|---|---|---|
| `next-auth` | `^5.0.0-beta.30` | Authentication (NextAuth v5) |
| `zustand` | `^5.0.11` | Client-side state management |
| `class-variance-authority` | `^0.7.1` | Component variant styling |

*All other dependencies (`next`, `react`, `tailwindcss`, `shadcn`, etc.) were already in the starter template.*

---

### 🔧 Configuration & Tooling

| File | Status | Description |
|---|---|---|
| `web/components.json` | **New** | shadcn/ui config — base-vega style, oklch CSS variables, `@/components` aliases. |
| `.vscode/mcp.json` | **New** | VS Code MCP server configuration. |
| `.github/prompts/build-banking-app.prompt.md` | **New** | 482-line comprehensive prompt document for AI agents to reproduce this entire application from the starter template. Covers all 15 sections: prerequisites, auth, routing, layout, components, pages, state, infrastructure, error handling, and 16 stability patterns. |
| `.github/skills/ui-components/SKILL.md` | **Modified** | Minor decision-flow refinement for UI component creation. |

---

### 🛡️ Security Measures

- **Server-side route protection** via `proxy.ts` (Next.js 16 proxy pattern)
- **Server-side admin guard** via `admin/layout.tsx` — not just client-side checks
- **Open-redirect protection** on sign-in callback URLs
- **Test credentials** gated behind `NODE_ENV === "development"`
- **Security headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **`poweredByHeader: false`** — hides X-Powered-By header
- **Sensitive files gitignored**: `.env`, `.env.local`, `node_modules/`, `.next/`

---

### ♿ Accessibility (a11y)

- **Skip-to-content link** in authenticated layout
- **`<label htmlFor>` + `id`** on all form inputs in settings
- **`<button role="switch" aria-checked>`** for notification toggles
- **`aria-label`** on icon-only buttons (notification bell, help, mobile nav)
- **`aria-live="polite"`** on toast notification container
- **System monospace fallback** instead of broken font reference

---

### 📁 File Count Summary

| Category | New Files | Modified Files |
|---|---|---|
| Authentication | 4 | 0 |
| Root layout & config | 2 | 4 |
| Public pages | 5 | 1 |
| Authenticated pages | 11 | 0 |
| UI components | 10 | 0 |
| Block components | 4 | 0 |
| Shared utilities | 1 | 0 |
| Feature modules | 11 | 0 |
| State management | 2 | 0 |
| Config & tooling | 4 | 1 |
| Lock files | 1 | 1 |
| **Total** | **55** | **7** |
