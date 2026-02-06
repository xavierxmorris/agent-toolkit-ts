"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/components/lib/utils";

interface MobileNavProps {
  items: Array<{
    href: string;
    label: string;
    icon: string;
  }>;
}

const adminItems = [
  { href: "/admin/users", label: "User Management", icon: "🔐" },
  { href: "/admin/audit", label: "Audit Log", icon: "📋" },
];

export function MobileNav({ items }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus the close button when drawer opens
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      // Return focus to toggle button when drawer closes
      toggleButtonRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus trap inside the drawer
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !drawerRef.current) return;

    const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  return (
    <>
      {/* Hamburger Button */}
      <button
        ref={toggleButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted lg:hidden"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal={isOpen ? "true" : undefined}
        aria-label="Navigation menu"
        onKeyDown={isOpen ? handleKeyDown : undefined}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform bg-card shadow-xl transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              FB
            </div>
            <div>
              <div className="font-bold text-foreground">FinanceBank</div>
              <div className="text-xs text-muted-foreground">Business Portal</div>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4">
          <div className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  pathname.startsWith(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <div className="mt-6">
              <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Administration
              </div>
              <div className="space-y-1">
                {adminItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      pathname.startsWith(item.href)
                        ? "bg-destructive/10 text-destructive"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
          <div className="rounded-lg bg-primary/5 p-3">
            <div className="flex items-center gap-2 text-sm text-primary">
              <span>🔒</span>
              <span>Secure Session Active</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Pre-configured MobileNav for the authenticated layout (matches sidebar items)
const authenticatedItems = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/customers", label: "Client Accounts", icon: "👥" },
  { href: "/orders", label: "Transactions", icon: "💳" },
  { href: "/reports", label: "Reports", icon: "📊" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function AuthenticatedMobileNav() {
  return <MobileNav items={authenticatedItems} />;
}
