"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/blocks/mobile-nav";
import { cn } from "@/components/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/customers", label: "Client Accounts", icon: "👥" },
  { href: "/orders", label: "Transactions", icon: "💳" },
];

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Don't show header on signin page or home
  if (pathname === "/" || pathname === "/auth/signin") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
      {/* Top Bar - Professional Banking Style */}
      <div className="hidden border-b border-border bg-primary text-primary-foreground sm:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-6 text-xs">
          <div className="flex items-center gap-4">
            <span>🔒 Secure Banking Portal</span>
            <span>|</span>
            <span>Welcome back</span>
          </div>
          <div className="flex items-center gap-4">
            <span>📞 Support: 1-800-BANK</span>
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Mobile Nav Toggle */}
        <div className="lg:hidden">
          <MobileNav items={navItems} />
        </div>

        {/* Logo and Nav */}
        <div className="flex items-center gap-10">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              FB
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-foreground">FinanceBank</div>
              <div className="text-xs text-muted-foreground">Business Portal</div>
            </div>
          </Link>
          
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  pathname.startsWith(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Notifications">
            <span className="text-xl" aria-hidden="true">🔔</span>
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
          </button>
          
          {status === "loading" ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted sm:w-32 sm:rounded-lg" />
          ) : session?.user ? (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted p-2 sm:gap-3 sm:px-3">
              {/* User Avatar */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {session.user.name?.charAt(0).toUpperCase() ?? "U"}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-foreground">
                  {session.user.name ?? "User"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Account Manager
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden text-muted-foreground hover:text-destructive sm:flex"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
