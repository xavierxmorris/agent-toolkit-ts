# Build FinanceBank — Banking LOB Application

> **Prompt for AI agents**: Given the bare `skill-updates` branch of
> [agent-toolkit-ts](https://github.com/thivy/agent-toolkit-ts/tree/skill-updates),
> build a full-featured banking Line-of-Business portal called **FinanceBank**.

---

## 0 — Prerequisites & Starter Baseline

You are starting from the **`skill-updates`** branch which ships:

| Layer | What exists |
|---|---|
| **Config** | `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `components.json` (shadcn), `package.json` |
| **App shell** | `app/layout.tsx` (Inter font, ThemeProvider), `app/page.tsx` → `features/home/home-page.tsx`, `app/globals.css` (oklch theme tokens, Tailwind v4) |
| **UI** | `components/ui/button.tsx`, `components/ui/card.tsx`, `components/ui/dropdown-menu.tsx` |
| **Blocks** | `components/blocks/theme/theme-provider.tsx`, `components/blocks/theme/theme-toggle.tsx` |
| **Lib** | `components/lib/utils.ts` (`cn()` — clsx + tailwind-merge) |
| **Skills** | `.github/skills/` — react-best-practices, vercel-composition-patterns, ui-components, next-best-practices, zustand, web-project-conventions |
| **Starter deps** | `next 16.1.6`, `react 19.2.3`, `@base-ui/react`, `@hugeicons/*`, `clsx`, `next-themes`, `tailwind-merge`, `tw-animate-css`, `shadcn` (dev) |

**Read and follow** `.github/skills/*` and `AGENTS.md` before writing any code.

---

## 1 — Install Additional Dependencies

```bash
# In the web/ directory
bun add next-auth@beta zustand class-variance-authority
```

> **Package manager**: Use **Bun** exclusively. If `package-lock.json` exists from a previous `npm install`, delete it — only `bun.lock` should be in the repo.

Also create a root-level `package.json` that proxies scripts to `web/` using Bun:

```jsonc
// /package.json
{
  "name": "agent-toolkit-ts",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "bun run --cwd web dev",
    "build": "bun run --cwd web build",
    "start": "bun run --cwd web start",
    "lint": "bun run --cwd web lint",
    "format": "bun run --cwd web format"
  }
}
```

---

## 2 — Authentication (NextAuth v5)

### 2.1 — `web/auth.ts`
Create the NextAuth configuration:
- **Providers**: Credentials (dev-only test accounts) + optional Microsoft Entra ID (when env vars present)
- **3 test accounts** (guard behind `process.env.NODE_ENV === "development"`):
  - `admin@securebank.com` / `admin123` — role `"admin"`
  - `manager@securebank.com` / `manager123` — role `"manager"`
  - `user@securebank.com` / `user123` — role `"user"`
- **Session strategy**: JWT
- **Custom sign-in page**: `/auth/signin`
- **Callbacks**: `authorized` (return `!!auth` — short-circuit for auth checks), `jwt` (persist `id`, `name`, `email`, `role` from user → token), `session` (copy `id`, `role` from token → session)
- `trustHost: true`
- Export `{ handlers, auth, signIn, signOut }`

### 2.2 — `web/types/next-auth.d.ts`
Module augmentation for TypeScript:
- Extend `User` with `role?: string`
- Extend `Session.user` with `id: string; role?: string`
- Extend `JWT` with `id?: string; role?: string`

### 2.3 — `web/app/api/auth/[...nextauth]/route.ts`
```ts
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
```

### 2.4 — `web/.env.local`
```env
AUTH_SECRET=<generate-a-random-secret>
AUTH_URL=http://localhost:3000
```

---

## 3 — Route Protection (Next.js 16 Proxy)

### 3.1 — `web/proxy.ts`
Next.js 16 uses `proxy` instead of `middleware`:
- Import `auth` from `@/auth`
- Allow auth pages (`/auth/*`) and API routes (`/api/*`) through
- Redirect unauthenticated users to `/auth/signin?callbackUrl=<current-path>`
- **Matcher**: `/dashboard/*`, `/customers/*`, `/orders/*`, `/reports/*`, `/settings/*`, `/admin/*`

---

## 4 — Root Layout & Config Updates

### 4.1 — `web/app/layout.tsx`
Update the existing root layout:
- Add `suppressHydrationWarning` to `<html>` (required by next-themes)
- Import and wrap children with `<ToastProvider>` (inside ThemeProvider)
- **Update metadata** to banking branding (not the starter template name):
  ```ts
  title: { default: "FinanceBank — Business Portal", template: "%s | FinanceBank" },
  description: "Secure banking portal for managing client accounts, transactions, and business operations.",
  ```

### 4.2 — `web/app/globals.css`
- Fix the broken `--font-geist-mono` reference (font is never loaded). Replace with a system monospace fallback:
  ```css
  --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  ```

### 4.3 — `web/next.config.ts`
Add security hardening:
- `poweredByHeader: false` — hide `X-Powered-By: Next.js` header
- Security headers via `async headers()`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 5 — UI Components to Create

Create these under `web/components/ui/`. Use the existing shadcn design tokens and follow `ui-components` skill patterns.

| Component | Key Features |
|---|---|
| **input.tsx** | Styled `<input>` with focus ring, error state, `cn()` merging |
| **badge.tsx** | Variants: default, secondary, destructive, outline |
| **select.tsx** | Styled `<select>` wrapper matching input styling |
| **skeleton.tsx** | Animated loading placeholder (`animate-pulse`) |
| **empty-state.tsx** | Icon + title + description + optional action slot |
| **pagination.tsx** | Page navigation with previous/next, page numbers, page-size selector |
| **toast.tsx** | Context-based toast system: `ToastProvider`, `useToast()` hook, standalone `toast()` function (fires CustomEvent), auto-dismiss, 4 types (success/error/warning/info), `aria-live="polite"` region |
| **dialog.tsx** | Native `<dialog>` element with `showModal()`/`close()`, cancel event handler (StrictMode-safe — use `addEventListener` not `onCancel` prop), backdrop click to close |
| **confirm-dialog.tsx** | Wraps Dialog for confirm/cancel actions with customisable labels and variant |
| **error-boundary.tsx** | React error boundary with fallback UI and retry button |

---

## 6 — Block Components

Create under `web/components/blocks/`:

### 6.1 — `sidebar.tsx`
- Fixed left sidebar, `w-64` (256px), hidden on mobile (`hidden lg:block`)
- Logo: "FB" badge + "FinanceBank / Business Portal"
- **Main nav** (5 items): Dashboard 🏠, Client Accounts 👥, Transactions 💳, Reports 📊, Settings ⚙️
- **Admin nav** (2 items, shown only when `role === "admin"`): User Management 🔐, Audit Log 📋
- **Active state uses `pathname.startsWith(item.href)`** — not exact match — so sub-routes highlight correctly
- Active style: `bg-primary/10 text-primary` (admin items use `bg-destructive/10 text-destructive`)
- User profile section at bottom: avatar initial, name, role badge (using shared `roleBadge()` utility), Sign Out button
- Uses `useSession()` and `usePathname()` for state

### 6.2 — `home-page.tsx` (Replace Starter Default)
Replace the placeholder `features/home/home-page.tsx` with a proper banking landing page:
- Top nav bar: "FB" logo + "FinanceBank" + Sign In button
- Hero: tagline "Secure Banking for Modern Business", description, CTA buttons (Get Started / View Demo → both link to `/auth/signin`)
- Stats row: $2.5B+ Transactions, 50K+ Clients, 99.9% Uptime
- Feature cards (3): Client Management, Transaction Tracking, Advanced Reports
- Footer: © 2026 FinanceBank

### 6.3 — `header.tsx` *(optional — not used by default)*
> **Note**: The authenticated layout (Section 7.1) has its own inline top bar, so this standalone component is **not imported anywhere**. It exists as an alternative for layouts that don't use the sidebar. You may skip creating it or keep it for future use.

- Sticky top header with banking top-bar (`hidden on / and /auth/signin`)
- Contains `<MobileNav>` trigger for mobile, logo, 3 desktop nav links (Dashboard, Client Accounts, Transactions), notification bell, user menu with sign-out
- Avoid hydration mismatches: no `new Date()` or dynamic values in SSR; use static text

### 6.4 — `mobile-nav.tsx`
- Sliding drawer from left (`transform -translate-x-full` → `translate-x-0`)
- Accepts `items` prop for navigation links
- Escape key closes, route change closes, body scroll lock when open
- Export `AuthenticatedMobileNav` — pre-configured with 5 main nav items (Dashboard, Client Accounts, Transactions, Reports, Settings)

### 6.5 — `stat-card.tsx` *(available but dashboard uses inline cards)*
- Reusable card component for KPIs: `label`, `value`, `icon`, `change` (value + trend: up/down/neutral), `className`
- The dashboard page renders stat cards with inline JSX rather than importing this component — it's available for reuse in other pages

### 6.6 — `components/lib/role-utils.ts`
Extract shared role-colour logic (DRY — used in sidebar, dashboard, admin pages):
- `getRoleBadgeClasses(role)` → `"bg-destructive/10 text-destructive"` / yellow / green
- `getRolePillClasses(role)` → same with border colours
- `formatRole(role)` → capitalised first letter
- `roleBadge(role, className?)` → full badge classes via `cn()`

---

## 7 — Authenticated Layout

### 7.1 — `web/app/(authenticated)/layout.tsx`
- **Server component** — calls `auth()` and `redirect("/auth/signin")` if no session
- Wraps children in `<SessionProvider session={session}>`
- **Skip-to-content link** (`<a href="#main-content" className="sr-only focus:not-sr-only ...">`)
- Layout: `<Sidebar>` + main content area (`lg:pl-64` to offset sidebar)
- Sticky top bar inside main: mobile nav trigger (using `<AuthenticatedMobileNav>`), breadcrumb area, notification button (with red dot), help button
- Page content wrapper gets `id="main-content"` for skip-link target
- Add `aria-label` attributes on icon buttons

---

## 8 — Sign-In Page

### 8.1 — `web/app/auth/signin/page.tsx`
- Split-screen layout: left panel (branding, stats — hidden on mobile), right panel (login form)
- Branding: "FinanceBank" logo, tagline "Secure Banking for Modern Business", stats ($2.5B+ transactions, 50K+ clients, 99.9% uptime)
- Form uses React 19 `useActionState(signInAction, { error: null })` pattern (NOT `useFormState`)
- `useSearchParams()` for `callbackUrl` and `error` — wrap entire page in `<Suspense>`
- Test accounts section: renders quick-login forms with hidden inputs for each test account
- Loading spinner on submit (`isPending` state)
- SSL badge, remember device checkbox, forgot password link

### 8.2 — `web/app/auth/signin/actions.ts`
- Server action: `signInAction(_prevState, formData)` — note the `_prevState` parameter is required by `useActionState`
- Extract email, password, callbackUrl from FormData
- **Open-redirect protection**: validate callbackUrl starts with `/` and not `//`
- Call `authSignIn("credentials", { email, password, redirectTo: callbackUrl })`
- Catch only `AuthError` (map `CredentialsSignin` → friendly message)
- **Re-throw** all other errors (especially redirect errors — do NOT swallow them)

---

## 9 — Feature Pages

All pages live under `web/app/(authenticated)/` as `"use client"` components using `useSession()`.

### 9.1 — Dashboard (`dashboard/page.tsx`)
- Session-aware greeting: "Welcome back, {name}"
- Role badge (color-coded using shared `getRolePillClasses()` + `formatRole()` from `role-utils.ts`)
- Role-based alerts (admin sees pending user requests with link to `/admin/users`, manager sees pending transactions with link to `/orders`)
- **4 stat cards** (rendered inline, not using `StatCard` component): Total Clients (2,847), Active Transactions (1,234), Revenue MTD ($847,392), Pending Approvals (47) — each with trend indicator
- Quick actions grid (2×2): New Transaction, Add Client, Generate Report, View Analytics — each links to the relevant page
- Recent activity list with color-coded status dots (success/warning/danger/info)
- Right sidebar column: Account Summary (Operating Balance, Reserve Account, Credit Line, Total Assets) + Security Notice card

### 9.2 — Customers (`customers/page.tsx` → `features/customers/`)
Structure as a feature module:
- `features/customers/types.ts` — `Customer` interface (id, name, email, company, status: `"active" | "inactive" | "pending"`, createdAt, updatedAt), `CreateCustomerInput` (name, email, company), `UpdateCustomerInput` (extends `Partial<CreateCustomerInput>` + optional `status`)
- `features/customers/customer-page.tsx` — Main page: search/filter, add button, table, dialog for create/edit form, confirm dialog for delete, pagination. Uses Zustand store.
- `features/customers/customer-table.tsx` — Sortable table with column headers, status badges, edit/delete actions
- `features/customers/customer-form.tsx` — Form for create/edit with name, email, company, status fields
- Mock data: 12+ customers with varied companies and statuses

### 9.3 — Orders/Transactions (`orders/page.tsx` → `features/orders/`)
Same feature module pattern as customers:
- `features/orders/types.ts`:
  - `Order` — `id`, `customerId`, `customerName` (denormalised), `items: OrderItem[]`, `total`, `status` (`"pending" | "processing" | "shipped" | "delivered" | "cancelled"`), `createdAt`, `updatedAt`
  - `OrderItem` — `id`, `name`, `quantity`, `price`
  - `CreateOrderInput` — `customerId`, `items: Omit<OrderItem, "id">[]`
  - `UpdateOrderInput` — `status?`, `items?`
- `features/orders/order-page.tsx` — Search, filter by status, create/edit dialog, delete confirm, pagination
- `features/orders/order-table.tsx` — Sortable table with total formatting, status badges, item count column
- `features/orders/order-form.tsx` — Form with customer selection, line items (name, quantity, price), auto-calculated total
- Mock data: varied statuses and multi-item orders

### 9.4 — Reports (`reports/page.tsx`)
- Report type selection grid (4 types): Transaction Report 💳, Client Summary 👥, Revenue Analysis 📈, Compliance Report ✅ — selectable cards with highlight state
- Clicking a type shows Generate / Cancel buttons
- Role-based: managers+ see a "Schedule Report" button and per-row "Download" action
- Recent Reports table: name, type, generated date, status badge, View + Download actions
- Mock data: 4 pre-generated historical reports

### 9.5 — Settings (`settings/page.tsx`)
- Tabbed sections: Profile, Security, Notifications, Preferences
- Profile: name, email (disabled), role display, phone. **All `<label>` elements must have `htmlFor` matching an `id` on their input.**
- Notifications: toggle switches using `<button role="switch" aria-checked={…} aria-label={…}>` — NOT raw `<input type="checkbox">` with CSS hacks
- Preferences: language, timezone, currency, date format selects — all with `htmlFor`/`id` pairs
- Security: change password, two-factor authentication toggle, session management
- Save button per section

### 9.6 — Admin Layout (`admin/layout.tsx`) — Server-Side Role Guard
- **Server component** — calls `auth()`, redirects to `/dashboard` if `role !== "admin"`
- This enforces admin access at the server level, preventing bypass of client-side guards

### 9.7 — Admin: User Management (`admin/users/page.tsx`)
- Session loading guard: show skeleton while `status === "loading"`, show "Access Denied" if non-admin (don't flash briefly)
- User list with search, role filter
- Actions: change role, toggle active/inactive, delete with confirm dialog
- Stats: total users, active count, admin count

### 9.8 — Admin: Audit Log (`admin/audit/page.tsx`)
- Session loading guard (same pattern as users)
- Searchable (user, action, target), filterable by status
- Columns: timestamp, user, action, **target**, IP address, status
- Status badges: `success` (green), `failed` (red), `warning` (yellow)
- Mock data: user creation, transaction approvals, role changes, login attempts, backups, security alerts

---

## 10 — State Management (Zustand)

Follow the `zustand` skill in `.github/skills/zustand/`.

### 10.1 — `web/store/use-customer-store.ts`
- **Types**: `SortDirection = "asc" | "desc"`, `CustomerSortField = "name" | "email" | "company" | "status" | "createdAt"`
- **State**: `customers[]`, `selectedCustomer`, `isLoading`, `error`, `filter`, `page`, `pageSize`, `sortField` (default `"name"`), `sortDirection` (default `"asc"`)
- **Decoupled actions pattern**: export standalone functions (`setCustomers`, `setSelectedCustomer`, `addCustomer`, `updateCustomer`, `removeCustomer`, `setFilter`, `setPage`, `setPageSize`, `setSort`, `setLoading`, `setError`) that call `useCustomerStore.setState()`
- Use `subscribeWithSelector` middleware
- Filtering / pagination is done inline in the page component, not via separate selector hooks

### 10.2 — `web/store/use-order-store.ts`
- Same decoupled-actions pattern as customer store
- **Types**: `OrderSortField = "customerName" | "total" | "status" | "createdAt"`
- **State**: `orders[]`, `selectedOrder`, `isLoading`, `error`, `filter`, `customerIdFilter` (string | null), `page`, `pageSize`, `sortField` (default `"createdAt"`), `sortDirection` (default `"desc"`)
- **Actions**: `setOrders`, `setSelectedOrder`, `addOrder`, `updateOrder`, `removeOrder`, `setFilter`, `setCustomerIdFilter`, `setPage`, `setPageSize`, `setSort`, `setLoading`, `setError`

---

## 11 — Shared Infrastructure

### 11.1 — `web/features/shared/api-client.ts` *(scaffolding — not called by pages yet)*
> The app currently uses mock data + Zustand stores. This client is pre-built scaffolding for when a real backend API is connected.

- Generic `request<T>()` function wrapping `fetch` with error handling, query params, JSON parsing
- `ApiError` class with `status` and `code`
- `api` object with `.get()`, `.post()`, `.put()`, `.patch()`, `.delete()` methods
- `queryKeys` object for customers and orders (React Query-ready)

### 11.2 — `web/features/shared/api/customer-api.ts` *(scaffolding)*
- Customer-specific API functions (`getCustomers`, `getCustomer`, `createCustomer`, `updateCustomer`, `deleteCustomer`) using the shared api client
- Not actively imported by page components (pages use Zustand mock data instead)

---

## 12 — Error / Loading / Not-Found Pages

Next.js App Router uses special file conventions for UX during navigation and errors.

### 12.1 — `app/error.tsx` (Root Error Boundary)
- `"use client"` — logs error, shows branded error UI with "Try Again" + "Go Home" buttons
- Displays `error.digest` for support reference

### 12.2 — `app/(authenticated)/error.tsx`
- Same pattern, but "Go to Dashboard" instead of "Go Home"

### 12.3 — `app/loading.tsx` (Root Loading)
- Branded spinner: "FB" logo + spinning circle + "Loading…"

### 12.4 — `app/(authenticated)/loading.tsx`
- Skeleton UI matching the authenticated page layout: header skeleton, 4 stat card skeletons, 5-row table skeleton

### 12.5 — `app/not-found.tsx`
- Branded 404: "FB" logo, "404 / Page Not Found", description, "Go to Dashboard" + "Back to Home" buttons

---

## 13 — Critical Stability Patterns

These patterns prevent known runtime issues. **Do not skip any of them.**

| # | Pattern | Why |
|---|---|---|
| 1 | `<html suppressHydrationWarning>` | Required by next-themes to avoid hydration mismatch |
| 2 | `<ToastProvider>` in root layout | Toasts silently fail without context provider |
| 3 | Dialog uses `addEventListener("cancel", …)` not `onCancel` prop | React StrictMode double-mount causes `showModal()` crash |
| 4 | No `new Date()` in server-rendered components | Causes hydration mismatch between server and client |
| 5 | `useActionState` (not `useFormState`) for forms | React 19 pattern; `useFormState` is deprecated |
| 6 | Server action signature: `(_prevState, formData)` | Required by `useActionState`; first arg is previous state |
| 7 | `<Suspense>` wrapping any component using `useSearchParams()` | Next.js 16 requirement; crashes without it |
| 8 | Re-throw non-AuthError in sign-in action | Redirect errors must propagate; swallowing them breaks sign-in flow |
| 9 | Open-redirect protection on callbackUrl | Validate `startsWith("/") && !startsWith("//")` |
| 10 | Session loading guard in admin pages | Check `status === "loading"` before "Access Denied" to prevent flash |
| 11 | Test credentials behind `NODE_ENV === "development"` | Never expose test accounts in production |
| 12 | `aria-label` on icon-only buttons, `aria-live` on toast container | Accessibility compliance |
| 13 | Server-side admin role guard (`admin/layout.tsx`) | Client-only role checks can be bypassed |
| 14 | Sidebar uses `pathname.startsWith()` not `===` | Exact match fails to highlight parent when on sub-routes |
| 15 | `<label htmlFor>` + `id` on all form inputs | Screen readers can't associate labels without it |
| 16 | Toggle switches use `<button role="switch">` | Raw checkbox + CSS has no accessible name or state |

---

## 14 — File Tree (Target State)

```
web/
├── auth.ts
├── proxy.ts
├── next.config.ts                          # Security headers, poweredByHeader: false
├── .env.local
├── types/
│   └── next-auth.d.ts
├── app/
│   ├── globals.css                         # Fixed --font-mono reference
│   ├── layout.tsx                          # Root: ThemeProvider + ToastProvider + banking metadata
│   ├── loading.tsx                         # NEW — branded root loading spinner
│   ├── error.tsx                           # NEW — root error boundary
│   ├── not-found.tsx                       # NEW — branded 404 page
│   ├── page.tsx                            # → features/home/home-page.tsx (banking landing)
│   ├── favicon.ico                         # (exists in starter)
│   ├── api/auth/[...nextauth]/route.ts
│   ├── auth/signin/
│   │   ├── page.tsx                        # Split-screen sign-in
│   │   └── actions.ts                      # Server action
│   └── (authenticated)/
│       ├── layout.tsx                      # Server auth check + skip-to-content + Sidebar
│       ├── loading.tsx                     # NEW — skeleton loading UI
│       ├── error.tsx                       # NEW — authenticated error boundary
│       ├── dashboard/page.tsx
│       ├── customers/page.tsx              # → features/customers/customer-page
│       ├── orders/page.tsx                 # → features/orders/order-page
│       ├── reports/page.tsx
│       ├── settings/page.tsx               # a11y: htmlFor, role=switch toggles
│       └── admin/
│           ├── layout.tsx                  # NEW — server-side admin role guard
│           ├── users/page.tsx
│           └── audit/page.tsx
├── components/
│   ├── lib/
│   │   ├── utils.ts                        # (exists in starter)
│   │   └── role-utils.ts                   # NEW — shared role badge/pill/format helpers
│   ├── ui/
│   │   ├── button.tsx                      # (exists in starter)
│   │   ├── card.tsx                        # (exists in starter)
│   │   ├── dropdown-menu.tsx               # (exists in starter)
│   │   ├── input.tsx                       # NEW
│   │   ├── badge.tsx                       # NEW
│   │   ├── select.tsx                      # NEW
│   │   ├── skeleton.tsx                    # NEW
│   │   ├── empty-state.tsx                 # NEW
│   │   ├── pagination.tsx                  # NEW
│   │   ├── toast.tsx                       # NEW
│   │   ├── dialog.tsx                      # NEW
│   │   ├── confirm-dialog.tsx              # NEW
│   │   └── error-boundary.tsx              # NEW
│   └── blocks/
│       ├── theme/                          # (exists in starter)
│       │   ├── theme-provider.tsx
│       │   └── theme-toggle.tsx
│       ├── sidebar.tsx                     # NEW — startsWith matching + shared role utils
│       ├── header.tsx                      # NEW (optional — not imported by default layout)
│       ├── mobile-nav.tsx                  # NEW
│       └── stat-card.tsx                   # NEW
├── store/
│   ├── use-customer-store.ts               # NEW
│   └── use-order-store.ts                  # NEW
├── features/
│   ├── home/home-page.tsx                  # REPLACED — banking landing page
│   ├── customers/
│   │   ├── types.ts                        # NEW
│   │   ├── customer-page.tsx               # NEW
│   │   ├── customer-table.tsx              # NEW
│   │   └── customer-form.tsx               # NEW
│   ├── orders/
│   │   ├── types.ts                        # NEW
│   │   ├── order-page.tsx                  # NEW
│   │   ├── order-table.tsx                 # NEW
│   │   └── order-form.tsx                  # NEW
│   └── shared/
│       ├── api-client.ts                   # NEW
│       └── api/customer-api.ts             # NEW
```

---

## 15 — Verification

After building, confirm:

```bash
bun run build     # 0 TypeScript errors, all 12 routes compile
bun run lint      # 0 warnings, 0 errors
bun run dev       # Sign-in flow works, session persists, role-based UI renders correctly
```

Test each flow:
1. Visit `/dashboard` unauthenticated → redirected to `/auth/signin?callbackUrl=/dashboard`
2. Sign in with each test account → redirected to dashboard, role badge matches
3. Navigate all sidebar links → pages render correctly, sidebar highlights active route
4. Admin-only pages → only visible/accessible to admin role (server-enforced)
5. Visit a non-existent URL → branded 404 page
6. Landing page (`/`) shows banking marketing page with Sign In CTA
7. Mobile: hamburger menu opens drawer, navigation works
8. Theme toggle switches light/dark
9. Toast notifications appear and auto-dismiss
10. Dialog open/close, confirm dialog, form submissions all work
11. Check response headers include security headers (X-Frame-Options, etc.)
