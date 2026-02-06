"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib/utils";
import type { Order } from "./types";
import type { OrderSortField, SortDirection } from "@/store/use-order-store";

interface OrderTableProps {
  orders: Order[];
  isLoading: boolean;
  sortField?: OrderSortField;
  sortDirection?: SortDirection;
  onSort?: (field: OrderSortField) => void;
  onView?: (order: Order) => void;
  onUpdateStatus?: (order: Order) => void;
  onDelete?: (id: string) => void;
}

function SortIcon({ field, currentField, direction }: { 
  field: OrderSortField; 
  currentField?: OrderSortField; 
  direction?: SortDirection;
}) {
  if (field !== currentField) {
    return <span className="ml-1 text-muted-foreground">⇅</span>;
  }
  return <span className="ml-1 text-primary">{direction === "asc" ? "↑" : "↓"}</span>;
}

const getStatusConfig = (status: Order["status"]) => {
  switch (status) {
    case "delivered":
      return { variant: "success" as const, label: "Completed", icon: "✓" };
    case "cancelled":
      return { variant: "destructive" as const, label: "Cancelled", icon: "✕" };
    case "shipped":
      return { variant: "warning" as const, label: "In Transit", icon: "📦" };
    case "processing":
      return { variant: "warning" as const, label: "Processing", icon: "⏳" };
    case "pending":
    default:
      return { variant: "default" as const, label: "Pending Approval", icon: "⏸" };
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export function OrderTable({
  orders,
  isLoading,
  sortField,
  sortDirection,
  onSort,
  onView,
  onUpdateStatus,
  onDelete,
}: OrderTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading transactions...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <span className="text-4xl">💳</span>
        <p className="mt-4 text-lg font-medium text-foreground">No transactions found</p>
        <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted">
          <tr>
            <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
              Transaction ID
            </th>
            <th 
              className={cn(
                "px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider",
                onSort && "cursor-pointer select-none hover:text-foreground"
              )}
              onClick={() => onSort?.("customerName")}
            >
              Client
              {onSort && <SortIcon field="customerName" currentField={sortField} direction={sortDirection} />}
            </th>
            <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
              Items
            </th>
            <th 
              className={cn(
                "px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider text-right",
                onSort && "cursor-pointer select-none hover:text-foreground"
              )}
              onClick={() => onSort?.("total")}
            >
              Amount
              {onSort && <SortIcon field="total" currentField={sortField} direction={sortDirection} />}
            </th>
            <th 
              className={cn(
                "px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider",
                onSort && "cursor-pointer select-none hover:text-foreground"
              )}
              onClick={() => onSort?.("status")}
            >
              Status
              {onSort && <SortIcon field="status" currentField={sortField} direction={sortDirection} />}
            </th>
            <th 
              className={cn(
                "px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider",
                onSort && "cursor-pointer select-none hover:text-foreground"
              )}
              onClick={() => onSort?.("createdAt")}
            >
              Date
              {onSort && <SortIcon field="createdAt" currentField={sortField} direction={sortDirection} />}
            </th>
            <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((order, index) => {
            const statusConfig = getStatusConfig(order.status);
            return (
              <tr
                key={order.id}
                className={cn(
                  "transition-colors hover:bg-muted",
                  index % 2 === 0 ? "bg-card" : "bg-muted/50"
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-primary font-semibold">
                      #{order.id.toUpperCase().slice(-8)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                      {order.customerName.charAt(0)}
                    </div>
                    <span className="font-medium text-foreground">{order.customerName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-semibold text-foreground">
                    {formatCurrency(order.total)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={statusConfig.variant}>
                    {statusConfig.icon} {statusConfig.label}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onView?.(order)}
                      className="text-primary hover:bg-primary/10"
                    >
                      👁️ View
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onUpdateStatus?.(order)}
                      className="hover:bg-green-600/10 hover:text-green-600 dark:hover:text-green-400"
                    >
                      ⚡ Status
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete?.(order.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      🗑️
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
