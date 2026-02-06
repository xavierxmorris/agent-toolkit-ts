"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/components/lib/utils";
import { roleBadge, formatRole } from "@/components/lib/role-utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/customers", label: "Client Accounts", icon: "👥" },
  { href: "/orders", label: "Transactions", icon: "💳" },
  { href: "/reports", label: "Reports", icon: "📊" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

const adminItems = [
  { href: "/admin/users", label: "User Management", icon: "🔐" },
  { href: "/admin/audit", label: "Audit Log", icon: "📋" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role ?? "user";
  const isAdmin = userRole === "admin";

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border bg-card lg:block">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            FB
          </div>
          <div>
            <div className="font-bold text-foreground">FinanceBank</div>
            <div className="text-xs text-muted-foreground">Business Portal</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4">
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Main Menu
        </div>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname.startsWith(item.href)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Administration
            </div>
            {adminItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname.startsWith(item.href)
                    ? "bg-destructive/10 text-destructive"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* User Profile Section */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
            {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-medium text-foreground">
              {session?.user?.name ?? "User"}
            </div>
            <div className="flex items-center gap-2">
              <span className={roleBadge(userRole)}>
                {formatRole(userRole)}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
        >
          <span>🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
