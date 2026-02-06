import type { Metadata } from "next";
import { OrderPage } from "@/features/orders/order-page";

export const metadata: Metadata = {
  title: "Transactions — FinanceBank",
  description: "View and manage all business transactions",
};

export default function OrdersPage() {
  return <OrderPage />;
}
