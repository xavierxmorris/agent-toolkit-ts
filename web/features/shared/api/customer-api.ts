import type {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "@/features/customers/types";

const API_BASE = "/api/customers";

/**
 * Fetch all customers with optional filter
 */
export async function fetchCustomers(filter?: string): Promise<Customer[]> {
  const url = filter ? `${API_BASE}?filter=${encodeURIComponent(filter)}` : API_BASE;
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch customers: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Fetch a single customer by ID
 */
export async function fetchCustomerById(id: string): Promise<Customer> {
  const res = await fetch(`${API_BASE}/${id}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch customer: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Create a new customer
 */
export async function createCustomer(data: CreateCustomerInput): Promise<Customer> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to create customer: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Update an existing customer
 */
export async function updateCustomerApi(
  id: string,
  data: UpdateCustomerInput
): Promise<Customer> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to update customer: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Delete a customer
 */
export async function deleteCustomer(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  
  if (!res.ok) {
    throw new Error(`Failed to delete customer: ${res.statusText}`);
  }
}
