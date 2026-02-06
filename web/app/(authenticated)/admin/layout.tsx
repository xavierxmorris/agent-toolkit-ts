import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * Server-side admin layout that enforces role === "admin".
 * This runs on the server before any client code — prevents
 * unauthorised access even if the client guard is bypassed.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
