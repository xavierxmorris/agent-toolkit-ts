# Changelog — Zustand 5 Best Practices Refactor

Enforced modern Zustand 5 patterns across the FinanceBank codebase: auto-generated selectors via `createSelectors()`, derived state hooks, `initialState` constants, and updated skill documentation.

**Commit**: `08b044d` — `feat(zustand): enforce Zustand 5 best practices with createSelectors + derived hooks`  
**Date**: 2026-02-06  
**Files changed**: 8 (+625 / −365 lines)

---

## Overview of Changes

| # | Category | Files |
|---|---|---|
| 1 | New utility | 1 |
| 2 | Store refactors | 2 |
| 3 | Page component updates | 2 |
| 4 | Skill documentation | 2 |
| 5 | Prompt documentation | 1 |

---

## 🆕 New: `createSelectors` Utility

| File | Description |
|---|---|
| `web/store/create-selectors.ts` | Auto-generates `.use.field()` selector hooks for any Zustand store. Based on the [official Zustand docs pattern](https://docs.pmnd.rs/zustand/guides/auto-generating-selectors). Exports `createSelectors()` function and `WithSelectors<S>` type. |

### How It Works

```ts
// Before: manual inline selectors in every component
const customers = useCustomerStore((s) => s.customers);
const filter = useCustomerStore((s) => s.filter);

// After: auto-generated type-safe hooks
const customers = useCustomerStore.use.customers();
const filter = useCustomerStore.use.filter();
```

Each state key gets a dedicated `store.use.key()` method that uses an atomic selector internally — components only re-render when that specific field changes.

---

## 🔄 Store Refactors

### `web/store/use-customer-store.ts`

| Aspect | Before | After |
|---|---|---|
| Store export | `useCustomerStore = create<State>()(…)` | `useCustomerStoreBase` (internal) + `useCustomerStore = createSelectors(useCustomerStoreBase)` |
| Initial state | Inline values in `create()` + duplicated in `resetStore()` | `initialState` constant, spread into `create()` and reused by `resetStore()` |
| Actions target | `useCustomerStore.setState()` | `useCustomerStoreBase.setState()` (base store) |
| Filter/sort/paginate | Inline `useMemo` in `customer-page.tsx` (~25 lines) | `usePaginatedCustomers()` derived hook exported from store |
| Stats | Inline `.filter()` calls in JSX | `useCustomerStats()` derived hook → `{ total, active, pending, inactive }` |

### `web/store/use-order-store.ts`

| Aspect | Before | After |
|---|---|---|
| Store export | `useOrderStore = create<State>()(…)` | `useOrderStoreBase` (internal) + `useOrderStore = createSelectors(useOrderStoreBase)` |
| Initial state | Inline values + duplicated in `resetStore()` | `initialState` constant, reused by `resetStore()` |
| Actions target | `useOrderStore.setState()` | `useOrderStoreBase.setState()` (base store) |
| Filter/sort/paginate | Inline `useMemo` in `order-page.tsx` (~30 lines) | `usePaginatedOrders()` derived hook (includes `customerIdFilter` logic) |
| Stats | Inline `.reduce()` + `.filter()` in component | `useOrderStats()` derived hook → `{ total, totalAmount, pending, completed }` |

---

## 📄 Page Component Updates

### `web/features/customers/customer-page.tsx`

| Change | Detail |
|---|---|
| **Import** | Removed `useMemo` from React imports; added `usePaginatedCustomers`, `useCustomerStats` from store |
| **Selectors** (×8) | Replaced `useCustomerStore((s) => s.field)` → `useCustomerStore.use.field()` for `isLoading`, `error`, `filter`, `page`, `pageSize`, `sortField`, `sortDirection` |
| **Inline `useMemo`** (~25 lines removed) | Replaced with single call: `const { paginatedCustomers, totalFiltered, totalPages } = usePaginatedCustomers()` |
| **Stats bar** (4 cards) | Replaced `customers.length`, `customers.filter(…).length` × 3 → `stats.total`, `stats.active`, `stats.pending`, `stats.inactive` via `useCustomerStats()` |
| **Removed** | `customers` selector — no longer needed (derived hooks access it internally) |

### `web/features/orders/order-page.tsx`

| Change | Detail |
|---|---|
| **Import** | Removed `useMemo`; added `usePaginatedOrders`, `useOrderStats` |
| **Selectors** (×9) | Replaced all `useOrderStore((s) => s.field)` → `useOrderStore.use.field()` |
| **Inline `useMemo`** (~30 lines removed) | Replaced with: `const { paginatedOrders, totalFiltered, totalPages } = usePaginatedOrders()` |
| **Inline stats** (3 variables removed) | Removed `totalAmount`, `pendingOrders`, `completedOrders` computations → `stats.total`, `stats.totalAmount`, `stats.pending`, `stats.completed` via `useOrderStats()` |
| **Removed** | `orders` selector — accessed internally by derived hooks |

---

## 📚 Skill Documentation

### `.github/skills/zustand/SKILL.md` (Full Rewrite)

| Section | What's New |
|---|---|
| **Core Principles** | Expanded from 5 → 7 principles. Added: #4 Auto-Generated Selectors, #5 Derived State Hooks, #6 `useShallow` for Multi-Value Selection, #7 `initialState` Constant |
| **Auto-Generated Selectors** | New section — explains `createSelectors()` utility, `WithSelectors<S>` type, usage in stores and components with ✅/❌ examples |
| **Decoupled Actions** | Updated to show `useStoreBase` / `useStore` two-tier pattern. Actions call `useStoreBase.setState()` |
| **Derived State Hooks** | New section — `usePaginatedCustomers()`, `useCustomerStats()` patterns with full code |
| **`useShallow`** | New dedicated section — when to use, object vs array selection, ✅/❌ examples |
| **Best Practices** | Updated all examples to use `createSelectors` pattern. Added `initialState` constant best practice |
| **Naming Conventions** | New table — `useEntityStoreBase`, `useEntityStore`, actions, derived hooks, sort field types, file names |
| **Quality Checklist** | Expanded from 5 → 9 items. Added: createSelectors wrapping, `.use.field()` usage, derived hooks requirement, `initialState` extraction, `useShallow` usage |

### `.github/skills/zustand/assets/template.md` (Updated)

| Change | Detail |
|---|---|
| **Imports** | Added `useMemo`, `createSelectors` |
| **Store pattern** | `use{{StoreName}}StoreBase` + `use{{StoreName}}Store = createSelectors(…)` |
| **Actions** | All now call `use{{StoreName}}StoreBase.setState()` |
| **New: Derived hook** | `usePaginated{{StoreName}}s()` scaffold with filter + paginate logic |
| **New state fields** | Added `filter`, `page`, `pageSize` to template state |
| **Removed** | `loadItems` async action (was too opinionated for a generic template) |

---

## 📋 Prompt Documentation

### `.github/prompts/build-banking-app.prompt.md` — Section 10

| Change | Detail |
|---|---|
| **New §10.0** | Documents `web/store/create-selectors.ts` utility |
| **§10.1 updated** | Customer store now describes: `initialState` constant, `useCustomerStoreBase`/`useCustomerStore` two-tier pattern, `usePaginatedCustomers()` and `useCustomerStats()` derived hooks |
| **§10.2 updated** | Order store — same two-tier + derived hooks pattern documented |
| **New §10.3** | "Store Usage in Pages" — documents `.use.field()` selectors, derived hook imports, standalone action imports |
| **Removed** | Old note "Filtering / pagination is done inline in the page component" (no longer accurate) |

---

## Verification

| Check | Result |
|---|---|
| `npx next build` | ✅ Compiled successfully — all 12 routes generated |
| Dev server (`localhost:3001`) | ✅ `/auth/signin`, `/customers`, `/orders` all render correctly |
| Runtime behavior | ✅ Filtering, sorting, pagination, CRUD all functional |
| `git push origin main` | ✅ Pushed to `xavierxmorris/agent-toolkit-ts` |

---

## Architecture Diagram (After)

```
┌─────────────────────────────────────────────┐
│  web/store/create-selectors.ts              │ ← shared utility
│  createSelectors(store) → store.use.field() │
└──────────────┬──────────────────────────────┘
               │
    ┌──────────┴──────────┐
    ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│ use-customer-    │  │ use-order-       │
│ store.ts         │  │ store.ts         │
│                  │  │                  │
│ Base store       │  │ Base store       │
│ + createSelectors│  │ + createSelectors│
│ + actions        │  │ + actions        │
│ + derived hooks: │  │ + derived hooks: │
│  - usePaginated… │  │  - usePaginated… │
│  - useCustomer…  │  │  - useOrder…     │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│ customer-page.tsx│  │ order-page.tsx   │
│                  │  │                  │
│ .use.field()     │  │ .use.field()     │
│ usePaginated…()  │  │ usePaginated…()  │
│ useCustomer…()   │  │ useOrder…()      │
└──────────────────┘  └──────────────────┘
```
