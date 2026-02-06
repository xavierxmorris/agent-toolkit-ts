"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { Customer } from "@/features/customers/types";

/**
 * Sort configuration type
 */
export type SortDirection = "asc" | "desc";
export type CustomerSortField = "name" | "email" | "company" | "status" | "createdAt";

/**
 * Customer store state interface
 */
interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
  filter: string;
  // Pagination
  page: number;
  pageSize: number;
  // Sorting
  sortField: CustomerSortField;
  sortDirection: SortDirection;
}

/**
 * Customer store - state only (following decoupled actions pattern)
 */
export const useCustomerStore = create<CustomerState>()(
  subscribeWithSelector(() => ({
    customers: [] as Customer[],
    selectedCustomer: null as Customer | null,
    isLoading: false as boolean,
    error: null as string | null,
    filter: "",
    // Pagination defaults
    page: 1,
    pageSize: 10,
    // Sorting defaults
    sortField: "name" as CustomerSortField,
    sortDirection: "asc" as SortDirection,
  }))
);

// ============================================
// Decoupled Actions (exported individually)
// ============================================

export const setCustomers = (customers: Customer[]) => {
  useCustomerStore.setState({ customers, error: null });
};

export const setSelectedCustomer = (customer: Customer | null) => {
  useCustomerStore.setState({ selectedCustomer: customer });
};

export const addCustomer = (customer: Customer) => {
  useCustomerStore.setState((state) => ({
    customers: [...state.customers, customer],
  }));
};

export const updateCustomer = (id: string, updates: Partial<Customer>) => {
  useCustomerStore.setState((state) => ({
    customers: state.customers.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    ),
  }));
};

export const removeCustomer = (id: string) => {
  useCustomerStore.setState((state) => ({
    customers: state.customers.filter((c) => c.id !== id),
    selectedCustomer:
      state.selectedCustomer?.id === id ? null : state.selectedCustomer,
  }));
};

export const setLoading = (isLoading: boolean) => {
  useCustomerStore.setState({ isLoading });
};

export const setError = (error: string | null) => {
  useCustomerStore.setState({ error, isLoading: false });
};

export const setFilter = (filter: string) => {
  useCustomerStore.setState({ filter, page: 1 }); // Reset to page 1 on filter change
};

// Pagination actions
export const setPage = (page: number) => {
  useCustomerStore.setState({ page });
};

export const setPageSize = (pageSize: number) => {
  useCustomerStore.setState({ pageSize, page: 1 }); // Reset to page 1 on page size change
};

// Sorting actions
export const setSort = (field: CustomerSortField) => {
  useCustomerStore.setState((state) => ({
    sortField: field,
    sortDirection:
      state.sortField === field && state.sortDirection === "asc" ? "desc" : "asc",
    page: 1, // Reset to page 1 on sort change
  }));
};

export const resetStore = () => {
  useCustomerStore.setState({
    customers: [],
    selectedCustomer: null,
    isLoading: false,
    error: null,
    filter: "",
    page: 1,
    pageSize: 10,
    sortField: "name",
    sortDirection: "asc",
  });
};
