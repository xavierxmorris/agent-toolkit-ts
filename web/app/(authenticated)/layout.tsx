import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Sidebar } from "@/components/blocks/sidebar";
import { AuthenticatedMobileNav } from "@/components/blocks/mobile-nav";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <SessionProvider session={session}>
        <div className="min-h-screen bg-background">
        {/* Skip to content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
        >
          Skip to content
        </a>

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content - offset for sidebar */}
        <main className="lg:pl-64">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="flex items-center gap-4">
              {/* Mobile Menu */}
              <div className="lg:hidden">
                <AuthenticatedMobileNav />
              </div>
              {/* Breadcrumb / Search could go here */}
              <div className="hidden md:block">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>🏦</span>
                  <span>FinanceBank Business Portal</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative rounded-lg p-2 hover:bg-muted" aria-label="Notifications">
                <span className="text-xl" aria-hidden="true">🔔</span>
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
              </button>
              {/* Help */}
              <button className="rounded-lg p-2 hover:bg-muted" aria-label="Help">
                <span className="text-xl" aria-hidden="true">❓</span>
              </button>
            </div>
          </header>

          {/* Page Content */}
          <div id="main-content" className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
