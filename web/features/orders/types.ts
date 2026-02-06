/**
 * Order entity type for the LOB application
 */
export interface Order {
  id: string;
  customerId: string;
  customerName: string; // Denormalized for display
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

/**
 * Input type for creating a new order
 */
export interface CreateOrderInput {
  customerId: string;
  items: Omit<OrderItem, "id">[];
}

/**
 * Input type for updating an existing order
 */
export interface UpdateOrderInput {
  status?: Order["status"];
  items?: OrderItem[];
}
