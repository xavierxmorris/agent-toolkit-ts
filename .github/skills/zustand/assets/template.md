"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { createSelectors } from "@/store/create-selectors";

// ============================================================================
// Types
// ============================================================================

/**
 * {{StoreName}}State — The state shape for this store
 */
export interface {{StoreName}}State {
  items: unknown[];
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
  filter: string;
  page: number;
  pageSize: number;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: {{StoreName}}State = {
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,
  filter: "",
  page: 1,
  pageSize: 10,
};

// ============================================================================
// Store (base + auto-selectors)
// ============================================================================

/**
 * use{{StoreName}}Store — Zustand store for managing {{description}}
 *
 * @example
 * ```tsx
 * // Auto-generated selectors
 * const items = use{{StoreName}}Store.use.items();
 * const filter = use{{StoreName}}Store.use.filter();
 *
 * // Derived hooks
 * const { paginatedItems, totalFiltered } = usePaginated{{StoreName}}s();
 * ```
 */
const use{{StoreName}}StoreBase = create<{{StoreName}}State>()(
  subscribeWithSelector(() => ({ ...initialState }))
);

export const use{{StoreName}}Store = createSelectors(use{{StoreName}}StoreBase);

// ============================================================================
// Decoupled Actions
// ============================================================================

export const setItems = (items: unknown[]) => {
  use{{StoreName}}StoreBase.setState({ items });
};

export const setSelectedId = (selectedId: string | null) => {
  use{{StoreName}}StoreBase.setState({ selectedId });
};

export const setLoading = (isLoading: boolean) => {
  use{{StoreName}}StoreBase.setState({ isLoading });
};

export const setError = (error: string | null) => {
  use{{StoreName}}StoreBase.setState({ error, isLoading: false });
};

export const setFilter = (filter: string) => {
  use{{StoreName}}StoreBase.setState({ filter, page: 1 });
};

export const setPage = (page: number) => {
  use{{StoreName}}StoreBase.setState({ page });
};

export const setPageSize = (pageSize: number) => {
  use{{StoreName}}StoreBase.setState({ pageSize, page: 1 });
};

export const addItem = (item: unknown) => {
  use{{StoreName}}StoreBase.setState((state) => ({
    items: [...state.items, item],
  }));
};

export const removeItem = (id: string) => {
  use{{StoreName}}StoreBase.setState((state) => ({
    items: state.items.filter((item) => (item as { id: string }).id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId,
  }));
};

export const resetStore = () => {
  use{{StoreName}}StoreBase.setState({ ...initialState });
};

// ============================================================================
// Derived State Hooks
// ============================================================================

/** Filtered + paginated items with total count */
export function usePaginated{{StoreName}}s() {
  const items = use{{StoreName}}Store.use.items();
  const filter = use{{StoreName}}Store.use.filter();
  const page = use{{StoreName}}Store.use.page();
  const pageSize = use{{StoreName}}Store.use.pageSize();

  return useMemo(() => {
    let result = items;

    // Filter (customize match logic per entity)
    if (filter) {
      const lf = filter.toLowerCase();
      result = result.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(lf)
      );
    }

    const totalFiltered = result.length;
    const start = (page - 1) * pageSize;
    const paginatedItems = result.slice(start, start + pageSize);

    return { paginatedItems, totalFiltered, totalPages: Math.ceil(totalFiltered / pageSize) };
  }, [items, filter, page, pageSize]);
}