"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { getRolePillClasses, formatRole } from "@/components/lib/role-utils";

// Mock statistics
const stats = [
  { label: "Total Clients", value: "2,847", change: "+12.5%", trend: "up", icon: "👥" },
  { label: "Active Transactions", value: "1,234", change: "+8.2%", trend: "up", icon: "💳" },
  { label: "Revenue (MTD)", value: "$847,392", change: "+23.1%", trend: "up", icon: "📈" },
  { label: "Pending Approvals", value: "47", change: "-5.4%", trend: "down", icon: "⏳" },
];

const recentActivity = [
  { id: 1, type: "transaction", description: "Wire transfer completed for Acme Corp", amount: "$25,000", time: "2 min ago", status: "success" },
  { id: 2, type: "client", description: "New client account opened - John Smith", amount: null, time: "15 min ago", status: "info" },
  { id: 3, type: "transaction", description: "Payment pending approval - Globex Inc", amount: "$12,500", time: "1 hour ago", status: "warning" },
  { id: 4, type: "alert", description: "Unusual activity detected - Review required", amount: null, time: "2 hours ago", status: "danger" },
  { id: 5, type: "transaction", description: "Monthly statement generated", amount: null, time: "3 hours ago", status: "info" },
];

const quickActions = [
  { label: "New Transaction", href: "/orders", icon: "➕", color: "bg-primary" },
  { label: "Add Client", href: "/customers", icon: "👤", color: "bg-green-600 dark:bg-green-700" },
  { label: "Generate Report", href: "/reports", icon: "📄", color: "bg-violet-600 dark:bg-violet-700" },
  { label: "View Analytics", href: "/reports", icon: "📊", color: "bg-yellow-600 dark:bg-yellow-700" },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role ?? "user";
  const isAdmin = userRole === "admin";
  const isManager = userRole === "manager" || isAdmin;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {session?.user?.name ?? "User"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here's what's happening with your accounts today.
          </p>
        </div>
        <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${getRolePillClasses(userRole)}`}>
          <span>👤</span>
          <span>{formatRole(userRole)} Access</span>
        </div>
      </div>

      {/* Role-based Alerts */}
      {isAdmin && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-medium text-destructive">Admin Alert: 3 pending user access requests</p>
              <p className="text-sm text-muted-foreground">Review and approve new user accounts in the admin panel.</p>
            </div>
            <Link href="/admin/users" className="ml-auto rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/80">
              Review Now
            </Link>
          </div>
        </div>
      )}

      {isManager && !isAdmin && (
        <div className="rounded-xl border border-yellow-600/20 bg-yellow-600/5 p-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">📋</span>
            <div>
              <p className="font-medium text-yellow-600 dark:text-yellow-400">Manager Notice: 5 transactions require your approval</p>
              <p className="text-sm text-muted-foreground">High-value transfers pending manager sign-off.</p>
            </div>
            <Link href="/orders" className="ml-auto rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700">
              View Pending
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-6 shadow-xs transition-all hover:shadow-md hover:border-primary/30"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl">{stat.icon}</span>
              <span
                className={`flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium ${
                  stat.trend === "up" ? "bg-green-600/10 text-green-600 dark:text-green-400" : "bg-destructive/10 text-destructive"
                }`}
              >
                {stat.trend === "up" ? "↑" : "↓"} {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card shadow-xs">
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="text-lg font-semibold text-foreground">
                Recent Activity
              </h2>
              <Link
                href="/orders"
                className="text-sm font-medium text-primary hover:underline"
              >
                View All →
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        activity.status === "success"
                          ? "bg-green-600/10"
                          : activity.status === "warning"
                          ? "bg-yellow-600/10"
                          : activity.status === "danger"
                          ? "bg-destructive/10"
                          : "bg-primary/10"
                      }`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          activity.status === "success"
                            ? "bg-green-600"
                            : activity.status === "warning"
                            ? "bg-yellow-600"
                            : activity.status === "danger"
                            ? "bg-destructive"
                            : "bg-primary"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                  {activity.amount && (
                    <span className="font-semibold text-foreground">
                      {activity.amount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`flex flex-col items-center justify-center rounded-lg ${action.color} p-4 text-white transition-all hover:scale-105 hover:shadow-lg`}
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="mt-2 text-xs font-medium text-center">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Account Summary */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Account Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Operating Balance
                </span>
                <span className="font-semibold text-foreground">
                  $1,284,392.00
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Reserve Account
                </span>
                <span className="font-semibold text-foreground">
                  $500,000.00
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Credit Line Available
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  $2,000,000.00
                </span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between">
                <span className="font-medium text-foreground">
                  Total Assets
                </span>
                <span className="font-bold text-foreground">
                  $3,784,392.00
                </span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">🔒</span>
              <div>
                <p className="text-sm font-medium text-primary">
                  Security Reminder
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Never share your login credentials. FinanceBank will never
                  ask for your password via email or phone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
