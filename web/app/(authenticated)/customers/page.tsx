import type { Metadata } from "next";
import { CustomerPage } from "@/features/customers/customer-page";

export const metadata: Metadata = {
  title: "Client Accounts — FinanceBank",
  description: "Manage your business client relationships and accounts",
};

export default function CustomersPage() {
  return <CustomerPage />;
}
