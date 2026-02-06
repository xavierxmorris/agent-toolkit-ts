"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Order, OrderItem, CreateOrderInput } from "./types";

interface OrderFormProps {
  order?: Order;
  customers: { id: string; name: string }[];
  onSubmit: (data: CreateOrderInput | { status: Order["status"] }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  mode: "create" | "status";
}

export function OrderForm({
  order,
  customers,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode,
}: OrderFormProps) {
  const [customerId, setCustomerId] = useState(order?.customerId ?? "");
  const [status, setStatus] = useState<Order["status"]>(order?.status ?? "pending");
  const [items, setItems] = useState<Omit<OrderItem, "id">[]>(
    order?.items.map(({ name, quantity, price }) => ({ name, quantity, price })) ?? [
      { name: "", quantity: 1, price: 0 },
    ]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === "create") {
      if (!customerId) {
        newErrors.customerId = "Customer is required";
      }

      if (items.length === 0) {
        newErrors.items = "At least one item is required";
      }

      items.forEach((item, index) => {
        if (!item.name.trim()) {
          newErrors[`item-${index}-name`] = "Item name is required";
        } else if (item.name.trim().length > 100) {
          newErrors[`item-${index}-name`] = "Item name must be 100 characters or less";
        }
        if (item.quantity < 1) {
          newErrors[`item-${index}-quantity`] = "Quantity must be at least 1";
        } else if (item.quantity > 10000) {
          newErrors[`item-${index}-quantity`] = "Quantity must be 10,000 or less";
        }
        if (item.price <= 0) {
          newErrors[`item-${index}-price`] = "Price must be greater than 0";
        } else if (item.price > 999999.99) {
          newErrors[`item-${index}-price`] = "Price must be $999,999.99 or less";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (mode === "status") {
      onSubmit({ status });
    } else {
      onSubmit({ customerId, items });
    }
  };

  const addItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof Omit<OrderItem, "id">, value: string | number) => {
    setItems(items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  if (mode === "status") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium">
            Order Status
          </label>
          <Select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Order["status"])}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Customer Selection */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="customer" className="text-sm font-medium">
          Customer
        </label>
        <Select
          id="customer"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className={errors.customerId ? "border-destructive" : ""}
        >
          <option value="">Select a customer...</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        {errors.customerId && (
          <span className="text-xs text-destructive">{errors.customerId}</span>
        )}
      </div>

      {/* Order Items */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Items</label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            + Add Item
          </Button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="flex gap-2 rounded-lg border border-border p-3">
            <div className="flex-1">
              <Input
                placeholder="Item name"
                value={item.name}
                onChange={(e) => updateItem(index, "name", e.target.value)}
                maxLength={100}
                className={errors[`item-${index}-name`] ? "border-destructive" : ""}
              />
            </div>
            <div className="w-20">
              <Input
                type="number"
                placeholder="Qty"
                min={1}
                max={10000}
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="w-24">
              <Input
                type="number"
                placeholder="Price"
                step="0.01"
                min={0}
                max={999999.99}
                value={item.price}
                onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
              />
            </div>
            {items.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
              >
                ×
              </Button>
            )}
          </div>
        ))}
        {errors.items && (
          <span className="text-xs text-destructive">{errors.items}</span>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between border-t border-border pt-4">
        <span className="font-medium">Total:</span>
        <span className="text-lg font-bold">
          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(total)}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Order"}
        </Button>
      </div>
    </form>
  );
}
