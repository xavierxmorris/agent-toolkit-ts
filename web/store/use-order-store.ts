"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { createSelectors } from "@/store/create-selectors";
import type { Order } from "@/features/orders/types";

// ============================================================================
// Types
// ============================================================================

export type SortDirection = "asc" | "desc";
export type OrderSortField = "customerName" | "total" | "status" | "createdAt";

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  filter: string;
  customerIdFilter: string | null;
  page: number;
  pageSize: number;
  sortField: OrderSortField;
  sortDirection: SortDirection;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: OrderState = {
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
};

// ============================================================================
// Store (base + auto-selectors)
// ============================================================================

const useOrderStoreBase = create<OrderState>()(
  subscribeWithSelector(() => ({ ...initialState }))
);

export const useOrderStore = createSelectors(useOrderStoreBase);

// ============================================================================
// Decoupled Actions
// ============================================================================

export const setOrders = (orders: Order[]) => {
  useOrderStoreBase.setState({ orders, error: null });
};

export const setSelectedOrder = (order: Order | null) => {
  useOrderStoreBase.setState({ selectedOrder: order });
};

export const addOrder = (order: Order) => {
  useOrderStoreBase.setState((state) => ({
    orders: [order, ...state.orders],
  }));
};

export const updateOrder = (id: string, updates: Partial<Order>) => {
  useOrderStoreBase.setState((state) => ({
    orders: state.orders.map((o) =>
      o.id === id ? { ...o, ...updates } : o
    ),
  }));
};

export const removeOrder = (id: string) => {
  useOrderStoreBase.setState((state) => ({
    orders: state.orders.filter((o) => o.id !== id),
    selectedOrder:
      state.selectedOrder?.id === id ? null : state.selectedOrder,
  }));
};

export const setLoading = (isLoading: boolean) => {
  useOrderStoreBase.setState({ isLoading });
};

export const setError = (error: string | null) => {
  useOrderStoreBase.setState({ error, isLoading: false });
};

export const setFilter = (filter: string) => {
  useOrderStoreBase.setState({ filter, page: 1 });
};

export const setCustomerIdFilter = (customerId: string | null) => {
  useOrderStoreBase.setState({ customerIdFilter: customerId, page: 1 });
};

export const setPage = (page: number) => {
  useOrderStoreBase.setState({ page });
};

export const setPageSize = (pageSize: number) => {
  useOrderStoreBase.setState({ pageSize, page: 1 });
};

export const setSort = (field: OrderSortField) => {
  useOrderStoreBase.setState((state) => ({
    sortField: field,
    sortDirection:
      state.sortField === field && state.sortDirection === "asc" ? "desc" : "asc",
    page: 1,
  }));
};

export const resetStore = () => {
  useOrderStoreBase.setState({ ...initialState });
};

// ============================================================================
// Derived State Hooks
// ============================================================================

/** Filtered + sorted + paginated orders with total count */
export function usePaginatedOrders() {
  const orders = useOrderStore.use.orders();
  const filter = useOrderStore.use.filter();
  const customerIdFilter = useOrderStore.use.customerIdFilter();
  const sortField = useOrderStore.use.sortField();
  const sortDirection = useOrderStore.use.sortDirection();
  const page = useOrderStore.use.page();
  const pageSize = useOrderStore.use.pageSize();

  return useMemo(() => {
    let result = orders;

    // Filter by customer
    if (customerIdFilter) {
      result = result.filter((o) => o.customerId === customerIdFilter);
    }

    // Filter by search
    if (filter) {
      const lf = filter.toLowerCase();
      result = result.filter(
        (o) =>
          o.customerName.toLowerCase().includes(lf) ||
          o.id.toLowerCase().includes(lf) ||
          o.status.toLowerCase().includes(lf)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      if (sortField === "total") {
        comparison = a.total - b.total;
      } else if (sortField === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        const aVal = a[sortField] ?? "";
        const bVal = b[sortField] ?? "";
        comparison = aVal.localeCompare(bVal);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    const totalFiltered = result.length;
    const start = (page - 1) * pageSize;
    const paginatedOrders = result.slice(start, start + pageSize);

    return {
      paginatedOrders,
      totalFiltered,
      totalPages: Math.ceil(totalFiltered / pageSize),
    };
  }, [orders, customerIdFilter, filter, sortField, sortDirection, page, pageSize]);
}

/** Stats computed from the full order list */
export function useOrderStats() {
  const orders = useOrderStore.use.orders();
  return useMemo(
    () => ({
      total: orders.length,
      totalAmount: orders.reduce((sum, o) => sum + o.total, 0),
      pending: orders.filter((o) => o.status === "pending" || o.status === "processing").length,
      completed: orders.filter((o) => o.status === "delivered").length,
    }),
    [orders]
  );
}
