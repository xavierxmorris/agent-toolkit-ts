"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Customer, CreateCustomerInput } from "./types";

interface FormData extends CreateCustomerInput {
  status?: Customer["status"];
}

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CustomerForm({
  customer,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CustomerFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: customer?.name ?? "",
    email: customer?.email ?? "",
    company: customer?.company ?? "",
    status: customer?.status,
  });

  const [errors, setErrors] = useState<Partial<CreateCustomerInput>>({});

  const validate = (): boolean => {
    const newErrors: Partial<CreateCustomerInput> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Name must be 100 characters or less";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    } else if (formData.company.trim().length > 100) {
      newErrors.company = "Company must be 100 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof CreateCustomerInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Name Field */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="name"
          placeholder="John Smith"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          maxLength={100}
          aria-invalid={!!errors.name}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <span className="text-xs text-destructive">{errors.name}</span>
        )}
      </div>

      {/* Email Field */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          maxLength={254}
          aria-invalid={!!errors.email}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <span className="text-xs text-destructive">{errors.email}</span>
        )}
      </div>

      {/* Company Field */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="company" className="text-sm font-medium">
          Company
        </label>
        <Input
          id="company"
          placeholder="Acme Corp"
          value={formData.company}
          onChange={(e) => handleChange("company", e.target.value)}
          maxLength={100}
          aria-invalid={!!errors.company}
          className={errors.company ? "border-destructive" : ""}
        />
        {errors.company && (
          <span className="text-xs text-destructive">{errors.company}</span>
        )}
      </div>

      {/* Status Field (only when editing) */}
      {customer && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <Select
            id="status"
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value as Customer["status"],
              }))
            }
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : customer
              ? "Update Customer"
              : "Create Customer"}
        </Button>
      </div>
    </form>
  );
}
