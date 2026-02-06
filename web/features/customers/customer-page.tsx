"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { CustomerTable } from "./customer-table";
import { CustomerForm } from "./customer-form";
import {
  useCustomerStore,
  usePaginatedCustomers,
  useCustomerStats,
  setCustomers,
  setLoading,
  setFilter,
  removeCustomer,
  addCustomer,
  updateCustomer,
  setPage,
  setPageSize,
  setSort,
} from "@/store/use-customer-store";
import type { Customer, CreateCustomerInput } from "./types";

// Mock data for demonstration (replace with API call)
const MOCK_CUSTOMERS: Customer[] = [
  { id: "1", name: "John Smith", email: "john@acme.com", company: "Acme Corp", status: "active", createdAt: "2024-01-15", updatedAt: "2024-01-15" },
  { id: "2", name: "Sarah Johnson", email: "sarah@globex.com", company: "Globex Inc", status: "active", createdAt: "2024-02-20", updatedAt: "2024-02-20" },
  { id: "3", name: "Mike Wilson", email: "mike@initech.com", company: "Initech", status: "pending", createdAt: "2024-03-10", updatedAt: "2024-03-10" },
  { id: "4", name: "Emily Brown", email: "emily@umbrella.com", company: "Umbrella Corp", status: "inactive", createdAt: "2024-01-05", updatedAt: "2024-03-01" },
  { id: "5", name: "David Lee", email: "david@stark.com", company: "Stark Industries", status: "active", createdAt: "2024-04-01", updatedAt: "2024-04-01" },
  { id: "6", name: "Lisa Chen", email: "lisa@wayne.com", company: "Wayne Enterprises", status: "active", createdAt: "2024-04-15", updatedAt: "2024-04-15" },
  { id: "7", name: "Tom Harris", email: "tom@oscorp.com", company: "Oscorp", status: "pending", createdAt: "2024-05-01", updatedAt: "2024-05-01" },
  { id: "8", name: "Anna Martinez", email: "anna@lexcorp.com", company: "LexCorp", status: "active", createdAt: "2024-05-10", updatedAt: "2024-05-10" },
  { id: "9", name: "James Taylor", email: "james@daily.com", company: "Daily Planet", status: "inactive", createdAt: "2024-06-01", updatedAt: "2024-06-01" },
  { id: "10", name: "Maria Garcia", email: "maria@queens.com", company: "Queens Consolidated", status: "active", createdAt: "2024-06-15", updatedAt: "2024-06-15" },
  { id: "11", name: "Robert Kim", email: "robert@palmer.com", company: "Palmer Tech", status: "active", createdAt: "2024-07-01", updatedAt: "2024-07-01" },
  { id: "12", name: "Jennifer White", email: "jennifer@kord.com", company: "Kord Industries", status: "pending", createdAt: "2024-07-15", updatedAt: "2024-07-15" },
];

export function CustomerPage() {
  const router = useRouter();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; customerId: string | null }>({
    open: false,
    customerId: null,
  });

  // Auto-generated selectors
  const isLoading = useCustomerStore.use.isLoading();
  const error = useCustomerStore.use.error();
  const filter = useCustomerStore.use.filter();
  const page = useCustomerStore.use.page();
  const pageSize = useCustomerStore.use.pageSize();
  const sortField = useCustomerStore.use.sortField();
  const sortDirection = useCustomerStore.use.sortDirection();

  // Derived state hooks (filter → sort → paginate logic lives in store)
  const { paginatedCustomers, totalFiltered, totalPages } = usePaginatedCustomers();
  const stats = useCustomerStats();

  // Debounced search
  const [localSearch, setLocalSearch] = useState(filter);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setFilter(value), 300);
  }, []);

  // Load customers on mount
  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        // Simulate API call - replace with: const data = await fetchCustomers();
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCustomers(MOCK_CUSTOMERS);
        setLoading(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load customers");
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteClick = useCallback((id: string) => {
    setDeleteConfirm({ open: true, customerId: id });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm.customerId) {
      removeCustomer(deleteConfirm.customerId);
      toast.success("Client account deleted successfully");
    }
    setDeleteConfirm({ open: false, customerId: null });
  }, [deleteConfirm.customerId]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteConfirm({ open: false, customerId: null });
  }, []);

  const handleViewOrders = (customerId: string) => {
    router.push(`/orders?customerId=${customerId}`);
  };

  const handleAddNew = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSubmit = async (data: CreateCustomerInput) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingCustomer) {
        // Update existing customer
        updateCustomer(editingCustomer.id, {
          ...data,
          updatedAt: new Date().toISOString().split("T")[0],
        });
        toast.success("Client account updated successfully");
      } else {
        // Create new customer
        const newCustomer: Customer = {
          id: crypto.randomUUID(),
          ...data,
          status: "pending",
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        };
        addCustomer(newCustomer);
        toast.success("New client account created successfully");
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
              Client Accounts
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage your business client relationships and accounts
            </p>
          </div>
          <Button
            onClick={handleAddNew}
            className="bg-primary hover:bg-primary/80"
          >
            + New Client Account
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4 shadow-xs">
            <div className="text-sm text-muted-foreground">Total Clients</div>
            <div className="mt-1 text-2xl font-bold text-foreground">{stats.total}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 shadow-xs">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.active}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 shadow-xs">
            <div className="text-sm text-muted-foreground">Pending Review</div>
            <div className="mt-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.pending}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 shadow-xs">
            <div className="text-sm text-muted-foreground">Inactive</div>
            <div className="mt-1 text-2xl font-bold text-muted-foreground">
              {stats.inactive}
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
                  placeholder="Search by name, email, or company..."
                  value={localSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-80 pl-10"
                  maxLength={100}
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {paginatedCustomers.length} of {totalFiltered} clients
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="m-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-destructive">
              ⚠️ {error}
            </div>
          )}

          {/* Table */}
          <CustomerTable
            customers={paginatedCustomers}
            isLoading={isLoading}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={setSort}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onViewOrders={handleViewOrders}
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

      {/* Create/Edit Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingCustomer ? "Edit Client Account" : "New Client Account"}
      >
        <CustomerForm
          customer={editingCustomer ?? undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
        title="Delete Client Account"
        description="Are you sure you want to delete this client account? This action cannot be undone and all associated data will be permanently removed."
        confirmLabel="Delete Account"
        variant="danger"
      />
    </div>
  );
}
