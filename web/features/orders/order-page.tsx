"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { OrderTable } from "./order-table";
import { OrderForm } from "./order-form";
import {
  useOrderStore,
  usePaginatedOrders,
  useOrderStats,
  setOrders,
  setLoading,
  setFilter,
  setCustomerIdFilter,
  removeOrder,
  addOrder,
  updateOrder,
  setPage,
  setPageSize,
  setSort,
} from "@/store/use-order-store";
import type { Order, CreateOrderInput } from "./types";

// Mock customers for the form
const MOCK_CUSTOMERS = [
  { id: "1", name: "John Smith" },
  { id: "2", name: "Sarah Johnson" },
  { id: "3", name: "Mike Wilson" },
  { id: "4", name: "Emily Brown" },
  { id: "5", name: "David Lee" },
  { id: "6", name: "Lisa Chen" },
];

// Mock orders data
const MOCK_ORDERS: Order[] = [
  { id: "ord-001", customerId: "1", customerName: "John Smith", items: [{ id: "i1", name: "Widget A", quantity: 2, price: 49.99 }, { id: "i2", name: "Widget B", quantity: 1, price: 29.99 }], total: 129.97, status: "delivered", createdAt: "2024-01-20", updatedAt: "2024-01-25" },
  { id: "ord-002", customerId: "2", customerName: "Sarah Johnson", items: [{ id: "i3", name: "Gadget Pro", quantity: 1, price: 199.99 }], total: 199.99, status: "shipped", createdAt: "2024-02-15", updatedAt: "2024-02-18" },
  { id: "ord-003", customerId: "1", customerName: "John Smith", items: [{ id: "i4", name: "Service Pack", quantity: 3, price: 99.00 }], total: 297.00, status: "processing", createdAt: "2024-03-01", updatedAt: "2024-03-01" },
  { id: "ord-004", customerId: "3", customerName: "Mike Wilson", items: [{ id: "i5", name: "Premium License", quantity: 1, price: 499.99 }], total: 499.99, status: "pending", createdAt: "2024-03-10", updatedAt: "2024-03-10" },
  { id: "ord-005", customerId: "4", customerName: "Emily Brown", items: [{ id: "i6", name: "Starter Kit", quantity: 5, price: 24.99 }], total: 124.95, status: "cancelled", createdAt: "2024-01-05", updatedAt: "2024-01-06" },
  { id: "ord-006", customerId: "5", customerName: "David Lee", items: [{ id: "i7", name: "Enterprise Suite", quantity: 1, price: 999.99 }], total: 999.99, status: "delivered", createdAt: "2024-02-28", updatedAt: "2024-03-05" },
  { id: "ord-007", customerId: "2", customerName: "Sarah Johnson", items: [{ id: "i8", name: "Addon Module", quantity: 2, price: 79.99 }], total: 159.98, status: "shipped", createdAt: "2024-03-12", updatedAt: "2024-03-14" },
  { id: "ord-008", customerId: "6", customerName: "Lisa Chen", items: [{ id: "i9", name: "Basic Plan", quantity: 12, price: 9.99 }], total: 119.88, status: "processing", createdAt: "2024-03-15", updatedAt: "2024-03-15" },
  { id: "ord-009", customerId: "1", customerName: "John Smith", items: [{ id: "i10", name: "Consulting Hour", quantity: 10, price: 150.00 }], total: 1500.00, status: "pending", createdAt: "2024-03-18", updatedAt: "2024-03-18" },
  { id: "ord-010", customerId: "3", customerName: "Mike Wilson", items: [{ id: "i11", name: "Training Session", quantity: 2, price: 299.00 }], total: 598.00, status: "delivered", createdAt: "2024-02-10", updatedAt: "2024-02-20" },
];

export function OrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerIdParam = searchParams.get("customerId");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "status">("create");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; orderId: string | null }>({
    open: false,
    orderId: null,
  });

  // Auto-generated selectors
  const isLoading = useOrderStore.use.isLoading();
  const error = useOrderStore.use.error();
  const filter = useOrderStore.use.filter();
  const customerIdFilter = useOrderStore.use.customerIdFilter();
  const page = useOrderStore.use.page();
  const pageSize = useOrderStore.use.pageSize();
  const sortField = useOrderStore.use.sortField();
  const sortDirection = useOrderStore.use.sortDirection();

  // Set customer filter from URL param
  useEffect(() => {
    setCustomerIdFilter(customerIdParam);
  }, [customerIdParam]);

  // Derived state hooks (filter → sort → paginate logic lives in store)
  const { paginatedOrders, totalFiltered, totalPages } = usePaginatedOrders();
  const stats = useOrderStats();
  const customerName = customerIdFilter 
    ? MOCK_CUSTOMERS.find((c) => c.id === customerIdFilter)?.name 
    : null;

  // Debounced search
  const [localSearch, setLocalSearch] = useState(filter);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setFilter(value), 300);
  }, []);

  // Load orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setOrders(MOCK_ORDERS);
        setLoading(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load transactions");
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const handleView = (order: Order) => {
    // For now, just show status modal. Could expand to full order details.
    setEditingOrder(order);
    setModalMode("status");
    setIsModalOpen(true);
  };

  const handleUpdateStatus = (order: Order) => {
    setEditingOrder(order);
    setModalMode("status");
    setIsModalOpen(true);
  };

  const handleDeleteClick = useCallback((id: string) => {
    setDeleteConfirm({ open: true, orderId: id });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm.orderId) {
      removeOrder(deleteConfirm.orderId);
      toast.success("Transaction deleted successfully");
    }
    setDeleteConfirm({ open: false, orderId: null });
  }, [deleteConfirm.orderId]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteConfirm({ open: false, orderId: null });
  }, []);

  const handleAddNew = () => {
    setEditingOrder(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const handleClearCustomerFilter = () => {
    router.push("/orders");
  };

  const handleSubmit = async (data: CreateOrderInput | { status: Order["status"] }) => {
    setIsSubmitting(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if ("status" in data && editingOrder) {
        updateOrder(editingOrder.id, {
          status: data.status,
          updatedAt: new Date().toISOString().split("T")[0],
        });
        toast.success("Transaction status updated successfully");
      } else if ("customerId" in data) {
        const customer = MOCK_CUSTOMERS.find((c) => c.id === data.customerId);
        const newOrder: Order = {
          id: `ord-${crypto.randomUUID().slice(0, 8)}`,
          customerId: data.customerId,
          customerName: customer?.name ?? "Unknown",
          items: data.items.map((item, i) => ({ ...item, id: `i-${crypto.randomUUID().slice(0, 8)}-${i}` })),
          total: data.items.reduce((sum, item) => sum + item.quantity * item.price, 0),
          status: "pending",
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        };
        addOrder(newOrder);
        toast.success("New transaction created successfully");
      }

      handleCloseModal();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Transaction History
            </h1>
            <p className="mt-1 text-muted-foreground">
              {customerName 
                ? `Transactions for ${customerName}` 
                : "View and manage all business transactions"}
            </p>
          </div>
          <div className="flex gap-3">
            {customerIdFilter && (
              <Button variant="outline" onClick={handleClearCustomerFilter}>
                ← All Transactions
              </Button>
            )}
            <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/80">
              + New Transaction
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4 shadow-xs">
            <div className="text-sm text-muted-foreground">Total Transactions</div>
            <div className="mt-1 text-2xl font-bold text-foreground">{stats.total}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 shadow-xs">
            <div className="text-sm text-muted-foreground">Total Volume</div>
            <div className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
              ${stats.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 shadow-xs">
            <div className="text-sm text-muted-foreground">Pending/Processing</div>
            <div className="mt-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.pending}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 shadow-xs">
            <div className="text-sm text-muted-foreground">Completed</div>
            <div className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.completed}
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="rounded-xl border border-border bg-card shadow-xs">
          {/* Search Bar */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  🔍
                </span>
                <Input
                  placeholder="Search by ID, client, or status..."
                  value={localSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-80 pl-10"
                  maxLength={100}
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {paginatedOrders.length} of {totalFiltered} transactions
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="m-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-destructive">
              ⚠️ {error}
            </div>
          )}

          {/* Table */}
          <OrderTable
            orders={paginatedOrders}
            isLoading={isLoading}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={setSort}
            onView={handleView}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteClick}
          />

          {/* Pagination */}
          {!isLoading && totalFiltered > 0 && (
            <div className="border-t border-border p-4">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalFiltered}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          )}
        </div>
      </div>

      {/* Create/Status Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        title={modalMode === "create" ? "New Transaction" : "Update Transaction Status"}
      >
        <OrderForm
          order={editingOrder ?? undefined}
          customers={MOCK_CUSTOMERS}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isSubmitting={isSubmitting}
          mode={modalMode}
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone and all associated records will be permanently removed."
        confirmLabel="Delete Transaction"
        variant="danger"
      />
    </div>
  );
}
