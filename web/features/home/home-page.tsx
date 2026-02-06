import Link from "next/link";
import { Button } from "@/components/ui/button";

export const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              FB
            </div>
            <span className="text-lg font-bold text-foreground">FinanceBank</span>
          </div>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-24 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          <span>🔒</span>
          <span>Enterprise-grade security</span>
        </div>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Secure Banking for{" "}
          <span className="text-primary">Modern Business</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Manage client accounts, track transactions, generate reports, and grow
          your business with our comprehensive banking platform.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/auth/signin">
            <Button size="lg" className="h-12 px-8 text-base font-semibold">
              Get Started
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base font-semibold"
            >
              View Demo
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid gap-8 sm:grid-cols-3">
          {[
            { value: "$2.5B+", label: "Transactions Processed" },
            { value: "50K+", label: "Business Clients" },
            { value: "99.9%", label: "Uptime SLA" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="mt-20 grid max-w-4xl gap-6 sm:grid-cols-3">
          {[
            {
              icon: "👥",
              title: "Client Management",
              description:
                "Track and manage all your business client accounts in one place.",
            },
            {
              icon: "💳",
              title: "Transaction Tracking",
              description:
                "Monitor wire transfers, payments, deposits, and withdrawals in real-time.",
            },
            {
              icon: "📊",
              title: "Advanced Reports",
              description:
                "Generate detailed financial reports with role-based access control.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card p-6 text-left"
            >
              <div className="mb-3 text-3xl">{feature.icon}</div>
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border bg-card py-8 text-center text-sm text-muted-foreground">
        © 2026 FinanceBank. All rights reserved.
      </footer>
    </div>
  );
};
