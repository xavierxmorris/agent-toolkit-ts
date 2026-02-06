# Changelog — Audit Fix Sprint

All fixes address findings from the comprehensive 36-item security, accessibility,
and code-quality audit.

---

## 🔴 Critical (3 findings fixed)

### 1. Security Headers — CSP & HSTS
- **File:** `web/next.config.ts`
- Added `Content-Security-Policy` (default-src 'self'; script-src 'self' 'unsafe-inline'
  'unsafe-eval'; frame-ancestors 'none'; base-uri 'self'; form-action 'self').
- Added `Strict-Transport-Security` (max-age 2 years, includeSubDomains, preload).

### 2. Authentication Hardening — Rate Limiting & JWT MaxAge
- **File:** `web/auth.ts`
- Implemented in-memory rate limiter: 5 attempts per 15-minute window per email.
- Set JWT `maxAge` to 1 hour (was unbounded).
- Added role validation in session callback (unknown roles fall back to `"user"`).

### 3. Proxy Rewrite — Deny-by-Default
- **File:** `web/proxy.ts`
- Rewrote route protection from allow-list to deny-by-default.
- Only `/auth/*`, `/api/*`, `/`, and `/favicon.ico` are public; everything else
  requires authentication.

---

## 🟠 High (11 findings fixed)

### 4. Session Expiry & Test-Account Gating
- **Files:** `web/app/(authenticated)/layout.tsx`, `web/app/auth/signin/page.tsx`,
  `web/.env.development`
- `SessionProvider` now re-validates every 5 min and on window focus.
- Test-account credentials section gated behind `NEXT_PUBLIC_SHOW_TEST_ACCOUNTS` env var.
- Created `.env.development` with the flag set to `true`.

### 5. Store Reset on Logout
- **File:** `web/components/blocks/sidebar.tsx`
- Customer and order stores are reset before `signOut()` to prevent stale data leaks.

### 6. Shared Types — Role Union & SortDirection
- **Files:** `web/types/shared.ts`, `web/store/use-customer-store.ts`,
  `web/store/use-order-store.ts`
- Extracted `UserRole` and `SortDirection` to a shared types file.
- Both stores import from the shared source (single source of truth).

### 7. Table Accessibility
- **Files:** `web/features/customers/customer-table.tsx`,
  `web/features/orders/order-table.tsx`
- Sortable headers now have `role="button"`, `tabIndex={0}`, keyboard handlers
  (Enter/Space), and `aria-sort`.
- Table wrappers have `role="region"` with descriptive `aria-label`.

### 8. Dialog, Toast & Pagination Accessibility
- **Files:** `web/components/ui/dialog.tsx`, `web/components/ui/toast.tsx`,
  `web/components/ui/pagination.tsx`
- Dialog: `aria-labelledby`, `aria-describedby`, close-button `aria-label`.
- Toast: per-toast `role`/`aria-live` (error → assertive, others → polite);
  dismiss button `aria-label`.
- Pagination: wrapped in `<nav>`, `aria-label` on buttons, `aria-current="page"`.

### 9. Mobile Navigation — Admin Items & Focus Trap
- **File:** `web/components/blocks/mobile-nav.tsx`
- Admin menu items now render for admin users (was desktop-only).
- Implemented keyboard focus trap (Tab/Shift+Tab cycles within drawer).
- Added `aria-modal`, `aria-expanded`, `aria-controls`; focus restoration on close.

### 10. Form Validation & Search Debounce
- **Files:** `web/features/customers/customer-form.tsx`,
  `web/features/customers/customer-page.tsx`,
  `web/features/orders/order-page.tsx`,
  `web/features/orders/order-form.tsx`
- Customer form: improved email regex, `maxLength` on all inputs, `aria-invalid`.
- Order form: max quantity (10 000), max price ($999 999.99), `maxLength` on item names.
- Both list pages: 300 ms search debounce to reduce re-renders.
- `crypto.randomUUID()` replaces `Date.now()` for new record IDs.

### 11. Settings Page — Controlled Toggles & Save State
- **File:** `web/app/(authenticated)/settings/page.tsx`
- Notification toggles converted from uncontrolled DOM to React controlled state.
- Save buttons show "Saving…" with `isSaving` guard to prevent double-submit.

---

## 🟡 Medium (16 findings fixed)

Covered by the fixes above (a11y items, debounce, form limits, pagination clamp).

### 12. Pagination Clamp After Delete
- **Files:** `web/store/use-customer-store.ts`, `web/store/use-order-store.ts`
- `removeCustomer` / `removeOrder` now recalculate `maxPage` and clamp the
  current page so users never land on an empty page after deletion.

---

## 🟢 Low (6 findings fixed)

### 13. Page Metadata
- **Files:** `web/app/(authenticated)/customers/page.tsx`,
  `web/app/(authenticated)/orders/page.tsx`
- Added `metadata` exports with page-specific titles and descriptions.

### 14. Dead Links → Disabled Buttons
- **File:** `web/app/auth/signin/page.tsx`
- "Forgot password?" and "Contact Support" `<a href="#">` replaced with disabled
  `<button>` elements.

### 15. No-Op Button Handlers
- **Files:** `web/app/(authenticated)/reports/page.tsx`,
  `web/app/(authenticated)/admin/users/page.tsx`,
  `web/app/(authenticated)/admin/audit/page.tsx`,
  `web/app/(authenticated)/settings/page.tsx`
- All placeholder buttons now show `toast.info("… coming soon")` instead of silently
  doing nothing.

---

## Verification

- **Build:** `bun run build` — ✅ Compiled successfully (Next.js 16.1.6 Turbopack)
- **Static pages:** 12/12 generated
- **Type check:** Zero TypeScript errors
