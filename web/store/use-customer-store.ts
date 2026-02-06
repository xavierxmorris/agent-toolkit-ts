"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { createSelectors } from "@/store/create-selectors";
import type { Customer } from "@/features/customers/types";
import type { SortDirection } from "@/types/shared";

// Re-export for consumers
export type { SortDirection };

// ============================================================================
// Types
// ============================================================================

export type CustomerSortField = "name" | "email" | "company" | "status" | "createdAt";

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
  filter: string;
  page: number;
  pageSize: number;
  sortField: CustomerSortField;
  sortDirection: SortDirection;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,
  filter: "",
  page: 1,
  pageSize: 10,
  sortField: "name",
  sortDirection: "asc",
};

// ============================================================================
// Store (base + auto-selectors)
// ============================================================================

const useCustomerStoreBase = create<CustomerState>()(
  subscribeWithSelector(() => ({ ...initialState }))
);

export const useCustomerStore = createSelectors(useCustomerStoreBase);

// ============================================================================
// Decoupled Actions
// ============================================================================

export const setCustomers = (customers: Customer[]) => {
  useCustomerStoreBase.setState({ customers, error: null });
};

export const setSelectedCustomer = (customer: Customer | null) => {
  useCustomerStoreBase.setState({ selectedCustomer: customer });
};

export const addCustomer = (customer: Customer) => {
  useCustomerStoreBase.setState((state) => ({
    customers: [...state.customers, customer],
  }));
};

export const updateCustomer = (id: string, updates: Partial<Customer>) => {
  useCustomerStoreBase.setState((state) => ({
    customers: state.customers.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    ),
  }));
};

export const removeCustomer = (id: string) => {
  useCustomerStoreBase.setState((state) => {
    const customers = state.customers.filter((c) => c.id !== id);
    // Clamp page if current page would be empty after deletion
    const totalFiltered = customers.length; // simplified; real clamp uses filtered count
    const maxPage = Math.max(1, Math.ceil(totalFiltered / state.pageSize));
    return {
      customers,
      page: state.page > maxPage ? maxPage : state.page,
      selectedCustomer:
        state.selectedCustomer?.id === id ? null : state.selectedCustomer,
    };
  });
};

export const setLoading = (isLoading: boolean) => {
  useCustomerStoreBase.setState({ isLoading });
};

export const setError = (error: string | null) => {
  useCustomerStoreBase.setState({ error, isLoading: false });
};

export const setFilter = (filter: string) => {
  useCustomerStoreBase.setState({ filter, page: 1 });
};

export const setPage = (page: number) => {
  useCustomerStoreBase.setState({ page });
};

export const setPageSize = (pageSize: number) => {
  useCustomerStoreBase.setState({ pageSize, page: 1 });
};

export const setSort = (field: CustomerSortField) => {
  useCustomerStoreBase.setState((state) => ({
    sortField: field,
    sortDirection:
      state.sortField === field && state.sortDirection === "asc" ? "desc" : "asc",
    page: 1,
  }));
};

export const resetStore = () => {
  useCustomerStoreBase.setState({ ...initialState });
};

// ============================================================================
// Derived State Hooks
// ============================================================================

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
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(lf) ||
          c.email.toLowerCase().includes(lf) ||
          c.company.toLowerCase().includes(lf)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      const aVal = a[sortField] ?? "";
      const bVal = b[sortField] ?? "";
      const comparison = aVal.localeCompare(bVal);
      return sortDirection === "asc" ? comparison : -comparison;
    });

    const totalFiltered = result.length;
    const start = (page - 1) * pageSize;
    const paginatedCustomers = result.slice(start, start + pageSize);

    return {
      paginatedCustomers,
      totalFiltered,
      totalPages: Math.ceil(totalFiltered / pageSize),
    };
  }, [customers, filter, sortField, sortDirection, page, pageSize]);
}

/** Stats computed from the full customer list */
export function useCustomerStats() {
  const customers = useCustomerStore.use.customers();
  return useMemo(
    () => ({
      total: customers.length,
      active: customers.filter((c) => c.status === "active").length,
      pending: customers.filter((c) => c.status === "pending").length,
      inactive: customers.filter((c) => c.status === "inactive").length,
    }),
    [customers]
  );
}
