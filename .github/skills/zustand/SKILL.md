---
name: zustand
description: Expert knowledge for client-side state management with Zustand 5 using the decoupled actions pattern, auto-generated selectors, and derived state hooks.
---

Create Zustand stores following established patterns with proper TypeScript types, middleware, and auto-generated selectors.

## Quick Start

Copy the template from [assets/template.md](assets/template.md) and replace placeholders:
- `{{StoreName}}` → PascalCase store name (e.g., `Customer`)
- `{{description}}` → Brief description for JSDoc

## Core Principles

1. **Client-Side Only** — Use Zustand for client-side state only. Store modules must only be imported from Client Components.
2. **State Only in Store** — `create()` should define the state shape and initial values, not actions.
3. **Decoupled Actions** — Export actions as plain functions that update state via `store.setState(...)`.
4. **Auto-Generated Selectors** — Wrap every store with `createSelectors()` to get type-safe `.use.field()` hooks.
5. **Derived State Hooks** — Extract filter → sort → paginate logic into reusable `useFiltered*` / `usePaginated*` hooks exported from the store file.
6. **`useShallow` for Multi-Value Selection** — Always use `useShallow` when selecting multiple values into an object or array.
7. **`initialState` Constant** — Extract initial values into a named constant so `resetStore()` can reference it.

## Auto-Generated Selectors (`createSelectors`)

### The Utility

Place this utility in `web/store/create-selectors.ts`:

```ts
import type { StoreApi, UseBoundStore } from "zustand";

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {} as Record<string, () => unknown>;
  for (const k of Object.keys(store.getState())) {
    (store.use as Record<string, () => unknown>)[k] = () =>
      store((s) => s[k as keyof typeof s]);
  }
  return store;
};
```

### Usage

```ts
// In every store file — wrap the base store:
const useCustomerStoreBase = create<CustomerState>()(
  subscribeWithSelector(() => ({ ...initialState }))
);

// Export the enhanced store with auto-generated selectors
export const useCustomerStore = createSelectors(useCustomerStoreBase);
```

### Consuming in Components

```tsx
// ✅ Auto-generated selectors — type-safe, zero boilerplate
const customers = useCustomerStore.use.customers();
const page = useCustomerStore.use.page();

// ✅ Still valid for custom computed selectors
const activeCount = useCustomerStore((s) => s.customers.filter(c => c.status === "active").length);

// ❌ Avoid: manual inline selector when .use.field() exists
const customers = useCustomerStore((s) => s.customers);
```

## The Decoupled Actions Pattern

### Why This Pattern?

- **No hook for actions** — Components import actions directly to avoid subscribing to action references.
- **Testable** — Actions are plain functions that can be tested in isolation.
- **Tree-shakeable** — Unused actions are eliminated from the bundle.

### Store Definition

```ts
// web/store/use-customer-store.ts
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { createSelectors } from "@/store/create-selectors";

interface CustomerState {
  customers: Customer[];
  filter: string;
  page: number;
  pageSize: number;
}

// 1) Initial state constant (reused by resetStore)
const initialState: CustomerState = {
  customers: [],
  filter: "",
  page: 1,
  pageSize: 10,
};

// 2) Base store (state only)
const useCustomerStoreBase = create<CustomerState>()(
  subscribeWithSelector(() => ({ ...initialState }))
);

// 3) Enhanced store with auto-selectors
export const useCustomerStore = createSelectors(useCustomerStoreBase);

// 4) Decoupled actions
export const setCustomers = (customers: Customer[]) => {
  useCustomerStoreBase.setState({ customers });
};

export const setFilter = (filter: string) => {
  useCustomerStoreBase.setState({ filter, page: 1 });
};

export const resetStore = () => {
  useCustomerStoreBase.setState({ ...initialState });
};
```

### Consuming in Client Components

```tsx
"use client";

import { useCustomerStore, setFilter } from "@/store/use-customer-store";

export function CustomerList() {
  const customers = useCustomerStore.use.customers();
  const filter = useCustomerStore.use.filter();

  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      {customers.map((c) => <div key={c.id}>{c.name}</div>)}
    </div>
  );
}
```

## Derived State Hooks

Extract filtering, sorting, and pagination logic into hooks **exported from the store file**. This avoids duplicating `useMemo` logic across page components.

```ts
// In use-customer-store.ts — after actions

/** Filtered + sorted + paginated customers with total count */
export function usePaginatedCustomers() {
  const customers = useCustomerStore.use.customers();
  const filter = useCustomerStore.use.filter();
  const sortField = useCustomerStore.use.sortField();
  const sortDirection = useCustomerStore.use.sortDirection();
  const page = useCustomerStore.use.page();
  const pageSize = useCustomerStore.use.pageSize();

  return useMemo(() => {
    let result = customers;

    // Filter
    if (filter) {
      const lf = filter.toLowerCase();
      result = result.filter((c) =>
        c.name.toLowerCase().includes(lf) ||
        c.email.toLowerCase().includes(lf) ||
        c.company.toLowerCase().includes(lf)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      const comparison = (a[sortField] ?? "").localeCompare(b[sortField] ?? "");
      return sortDirection === "asc" ? comparison : -comparison;
    });

    const totalFiltered = result.length;
    const start = (page - 1) * pageSize;
    const paginatedCustomers = result.slice(start, start + pageSize);

    return { paginatedCustomers, totalFiltered, totalPages: Math.ceil(totalFiltered / pageSize) };
  }, [customers, filter, sortField, sortDirection, page, pageSize]);
}

/** Stats computed from the full customer list */
export function useCustomerStats() {
  const customers = useCustomerStore.use.customers();
  return useMemo(() => ({
    total: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    pending: customers.filter((c) => c.status === "pending").length,
    inactive: customers.filter((c) => c.status === "inactive").length,
  }), [customers]);
}
```

### Using Derived Hooks in Pages

```tsx
import { usePaginatedCustomers, useCustomerStats, useCustomerStore } from "@/store/use-customer-store";

export function CustomerPage() {
  const { paginatedCustomers, totalFiltered, totalPages } = usePaginatedCustomers();
  const stats = useCustomerStats();
  const filter = useCustomerStore.use.filter();
  // ...
}
```

## `useShallow` for Multi-Value Selection

When you need an **object or array** of values from the store, wrap with `useShallow` to prevent re-renders when reference identity changes:

```tsx
import { useShallow } from "zustand/react/shallow";

// ✅ Correct: useShallow for object destructuring
const { filter, page } = useCustomerStore(
  useShallow((s) => ({ filter: s.filter, page: s.page }))
);

// ✅ Correct: useShallow for array selection
const [filter, page] = useCustomerStore(
  useShallow((s) => [s.filter, s.page])
);

// ❌ Avoid: object selection without useShallow (re-renders every update)
const { filter, page } = useCustomerStore((s) => ({ filter: s.filter, page: s.page }));

// ✅ Preferred: use auto-generated selectors for individual values
const filter = useCustomerStore.use.filter();
const page = useCustomerStore.use.page();
```

## Best Practices

### Always Use `subscribeWithSelector`

```ts
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useMyStoreBase = create<MyState>()(
  subscribeWithSelector(() => ({ ...initialState }))
);
export const useMyStore = createSelectors(useMyStoreBase);
```

### Extract `initialState` Constant

```ts
// ✅ Correct: reusable initial state
const initialState: MyState = { items: [], page: 1 };
const useStoreBase = create<MyState>()(() => ({ ...initialState }));
export const resetStore = () => useStoreBase.setState({ ...initialState });

// ❌ Avoid: duplicating values in create() and resetStore()
```

### Functional Updates

Use functional updates when the new value depends on previous state:

```ts
// ✅ Correct: functional update
export const addItem = (item: Item) => {
  useStoreBase.setState((state) => ({ items: [...state.items, item] }));
};

// ❌ Avoid: reading state outside setState when updating
export const addItemBad = (item: Item) => {
  const current = useStoreBase.getState().items;
  useStoreBase.setState({ items: [...current, item] });
};
```

### Don't Import Stores in Server Components

```tsx
// ❌ This will fail — Server Components cannot use client state
// app/page.tsx (Server Component)
import { useCustomerStore } from "@/store/use-customer-store";

// ✅ Pass data from Server Component to Client Component via props
export default function Page() {
  return <ClientCounter initialCount={0} />;
}
```

### Don't Define Actions Inside `create()`

```ts
// ❌ Avoid: actions inside create
export const useStore = create<State & Actions>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// ✅ Correct: decoupled actions
const useStoreBase = create<State>(() => ({ count: 0 }));
export const useStore = createSelectors(useStoreBase);
export const increment = () => useStoreBase.setState((s) => ({ count: s.count + 1 }));
```

## Naming Conventions

| Concept | Convention | Example |
|---|---|---|
| Base store (internal) | `use{{Entity}}StoreBase` | `useCustomerStoreBase` |
| Exported store | `use{{Entity}}Store` | `useCustomerStore` |
| Actions | `camelCase` verb + noun | `setFilter`, `addCustomer`, `removeOrder` |
| Derived hooks | `use` + purpose | `usePaginatedCustomers`, `useOrderStats` |
| Sort field type | `{{Entity}}SortField` | `CustomerSortField` |
| Store file | `use-{{entity}}-store.ts` | `use-customer-store.ts` |

## Quality Checklist

Before completing any Zustand-related task:

1. Store is wrapped with `createSelectors()` from `@/store/create-selectors`
2. Components use `.use.field()` auto-selectors instead of inline `(s) => s.field`
3. Filter/sort/paginate logic lives in a derived hook (`usePaginated*`), not inline in pages
4. `initialState` constant is extracted and reused by `resetStore()`
5. Actions call `useStoreBase.setState()` (the base store, not the selectors-wrapped version)
6. `useShallow` is used when selecting multiple values into an object/array
7. Stores are only imported in Client Components (`'use client'`)
8. Functional updates are used when new state depends on previous state
9. Run `bun run lint` to verify no type errors
