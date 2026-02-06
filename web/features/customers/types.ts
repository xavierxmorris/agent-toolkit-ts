/**
 * Customer entity type for the LOB application
 */
export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
  updatedAt: string;
}

/**
 * Input type for creating a new customer
 */
export interface CreateCustomerInput {
  name: string;
  email: string;
  company: string;
}

/**
 * Input type for updating an existing customer
 */
export interface UpdateCustomerInput extends Partial<CreateCustomerInput> {
  status?: Customer["status"];
}
