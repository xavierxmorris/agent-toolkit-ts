"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { Order } from "@/features/orders/types";

/**
 * Sort configuration type
 */
export type SortDirection = "asc" | "desc";
export type OrderSortField = "customerName" | "total" | "status" | "createdAt";

/**
 * Order store state interface
 */
interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  filter: string;
  customerIdFilter: string | null;
  // Pagination
  page: number;
  pageSize: number;
  // Sorting
  sortField: OrderSortField;
  sortDirection: SortDirection;
}

/**
 * Order store - state only (following decoupled actions pattern)
 */
export const useOrderStore = create<OrderState>()(
  subscribeWithSelector(() => ({
    orders: [] as Order[],
    selectedOrder: null as Order | null,
    isLoading: false as boolean,
    error: null as string | null,
    filter: "",
    customerIdFilter: null as string | null,
    // Pagination defaults
    page: 1,
    pageSize: 10,
    // Sorting defaults
    sortField: "createdAt" as OrderSortField,
    sortDirection: "desc" as SortDirection,
  }))
);

// ============================================
// Decoupled Actions (exported individually)
// ============================================

export const setOrders = (orders: Order[]) => {
  useOrderStore.setState({ orders, error: null });
};

export const setSelectedOrder = (order: Order | null) => {
  useOrderStore.setState({ selectedOrder: order });
};

export const addOrder = (order: Order) => {
  useOrderStore.setState((state) => ({
    orders: [order, ...state.orders], // Add to beginning (newest first)
  }));
};

export const updateOrder = (id: string, updates: Partial<Order>) => {
  useOrderStore.setState((state) => ({
    orders: state.orders.map((o) =>
      o.id === id ? { ...o, ...updates } : o
    ),
  }));
};

export const removeOrder = (id: string) => {
  useOrderStore.setState((state) => ({
    orders: state.orders.filter((o) => o.id !== id),
    selectedOrder:
      state.selectedOrder?.id === id ? null : state.selectedOrder,
  }));
};

export const setLoading = (isLoading: boolean) => {
  useOrderStore.setState({ isLoading });
};

export const setError = (error: string | null) => {
  useOrderStore.setState({ error, isLoading: false });
};

export const setFilter = (filter: string) => {
  useOrderStore.setState({ filter, page: 1 });
};

export const setCustomerIdFilter = (customerId: string | null) => {
  useOrderStore.setState({ customerIdFilter: customerId, page: 1 });
};

// Pagination actions
export const setPage = (page: number) => {
  useOrderStore.setState({ page });
};

export const setPageSize = (pageSize: number) => {
  useOrderStore.setState({ pageSize, page: 1 });
};

// Sorting actions
export const setSort = (field: OrderSortField) => {
  useOrderStore.setState((state) => ({
    sortField: field,
    sortDirection:
      state.sortField === field && state.sortDirection === "asc" ? "desc" : "asc",
    page: 1,
  }));
};

export const resetStore = () => {
  useOrderStore.setState({
    orders: [],
    selectedOrder: null,
    isLoading: false,
    error: null,
    filter: "",
    customerIdFilter: null,
    page: 1,
    pageSize: 10,
    sortField: "createdAt",
    sortDirection: "desc",
  });
};
