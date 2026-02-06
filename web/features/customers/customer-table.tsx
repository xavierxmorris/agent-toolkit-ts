"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib/utils";
import type { Customer } from "./types";
import type { CustomerSortField, SortDirection } from "@/store/use-customer-store";

interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  sortField?: CustomerSortField;
  sortDirection?: SortDirection;
  onSort?: (field: CustomerSortField) => void;
  onEdit?: (customer: Customer) => void;
  onDelete?: (id: string) => void;
  onViewOrders?: (customerId: string) => void;
}

function SortIcon({ field, currentField, direction }: { 
  field: CustomerSortField; 
  currentField?: CustomerSortField; 
  direction?: SortDirection;
}) {
  if (field !== currentField) {
    return <span className="ml-1 text-muted-foreground">⇅</span>;
  }
  return <span className="ml-1 text-primary">{direction === "asc" ? "↑" : "↓"}</span>;
}

export function CustomerTable({
  customers,
  isLoading,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  onViewOrders,
}: CustomerTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading client accounts...</span>
        </div>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <span className="text-4xl">📋</span>
        <p className="mt-4 text-lg font-medium text-foreground">No clients found</p>
        <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search criteria</p>
      </div>
    );
  }

  const getStatusConfig = (status: Customer["status"]) => {
    switch (status) {
      case "active":
        return { variant: "success" as const, label: "Active", icon: "✓" };
      case "inactive":
        return { variant: "destructive" as const, label: "Inactive", icon: "✕" };
      case "pending":
        return { variant: "warning" as const, label: "Pending Review", icon: "⏳" };
      default:
        return { variant: "default" as const, label: status, icon: "" };
    }
  };

  return (
    <div className="overflow-x-auto" role="region" aria-label="Client accounts table">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted">
          <tr>
            <th 
              className={cn(
                "px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider",
                onSort && "cursor-pointer select-none hover:text-foreground"
              )}
              onClick={() => onSort?.("name")}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSort?.("name"); } }}
              tabIndex={onSort ? 0 : undefined}
              role={onSort ? "button" : undefined}
              aria-sort={sortField === "name" ? (sortDirection === "asc" ? "ascending" : "descending") : undefined}
            >
              Client Name
              {onSort && <SortIcon field="name" currentField={sortField} direction={sortDirection} />}
            </th>
            <th 
              className={cn(
                "px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider",
                onSort && "cursor-pointer select-none hover:text-foreground"
              )}
              onClick={() => onSort?.("email")}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSort?.("email"); } }}
              tabIndex={onSort ? 0 : undefined}
              role={onSort ? "button" : undefined}
              aria-sort={sortField === "email" ? (sortDirection === "asc" ? "ascending" : "descending") : undefined}
            >
              Email
              {onSort && <SortIcon field="email" currentField={sortField} direction={sortDirection} />}
            </th>
            <th 
              className={cn(
                "px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider",
                onSort && "cursor-pointer select-none hover:text-foreground"
              )}
              onClick={() => onSort?.("company")}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSort?.("company"); } }}
              tabIndex={onSort ? 0 : undefined}
              role={onSort ? "button" : undefined}
              aria-sort={sortField === "company" ? (sortDirection === "asc" ? "ascending" : "descending") : undefined}
            >
              Organization
              {onSort && <SortIcon field="company" currentField={sortField} direction={sortDirection} />}
            </th>
            <th 
              className={cn(
                "px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider",
                onSort && "cursor-pointer select-none hover:text-foreground"
              )}
              onClick={() => onSort?.("status")}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSort?.("status"); } }}
              tabIndex={onSort ? 0 : undefined}
              role={onSort ? "button" : undefined}
              aria-sort={sortField === "status" ? (sortDirection === "asc" ? "ascending" : "descending") : undefined}
            >
              Account Status
              {onSort && <SortIcon field="status" currentField={sortField} direction={sortDirection} />}
            </th>
            <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {customers.map((customer, index) => {
            const statusConfig = getStatusConfig(customer.status);
            return (
              <tr
                key={customer.id}
                className={cn(
                  "transition-colors hover:bg-muted",
                  index % 2 === 0 ? "bg-card" : "bg-muted/50"
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">ID: {customer.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  <a href={`mailto:${customer.email}`} className="hover:text-primary hover:underline">
                    {customer.email}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{customer.company}</div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={statusConfig.variant}>
                    {statusConfig.icon} {statusConfig.label}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    {onViewOrders && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onViewOrders(customer.id)}
                        className="text-primary hover:bg-primary/10"
                      >
                        💳 Transactions
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit?.(customer)}
                      className="hover:bg-green-600/10 hover:text-green-600 dark:hover:text-green-400"
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete?.(customer.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
