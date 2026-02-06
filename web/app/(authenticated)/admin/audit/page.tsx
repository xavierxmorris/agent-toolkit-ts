"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

const mockAuditLogs = [
  { id: 1, user: "Admin User", action: "User Created", target: "jane@company.com", timestamp: "Feb 5, 2026 10:30 AM", ip: "192.168.1.1", status: "success" },
  { id: 2, user: "Sarah Manager", action: "Transaction Approved", target: "TXN-2024-001234", timestamp: "Feb 5, 2026 09:15 AM", ip: "192.168.1.45", status: "success" },
  { id: 3, user: "Admin User", action: "Role Changed", target: "user@securebank.com", timestamp: "Feb 4, 2026 04:45 PM", ip: "192.168.1.1", status: "success" },
  { id: 4, user: "John User", action: "Login Attempt", target: "john@securebank.com", timestamp: "Feb 4, 2026 02:30 PM", ip: "203.0.113.42", status: "failed" },
  { id: 5, user: "System", action: "Backup Completed", target: "Database", timestamp: "Feb 4, 2026 12:00 AM", ip: "Internal", status: "success" },
  { id: 6, user: "Sarah Manager", action: "Report Generated", target: "Q4 Revenue Report", timestamp: "Feb 3, 2026 11:20 AM", ip: "192.168.1.45", status: "success" },
  { id: 7, user: "Admin User", action: "User Deactivated", target: "bob@company.com", timestamp: "Feb 3, 2026 09:00 AM", ip: "192.168.1.1", status: "success" },
  { id: 8, user: "System", action: "Security Alert", target: "Multiple failed logins", timestamp: "Feb 2, 2026 08:45 PM", ip: "External", status: "warning" },
];

export default function AuditLogPage() {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Show loading state while session is being fetched
  if (status === "loading") {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Redirect if not admin
  if (userRole !== "admin") {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <span className="text-5xl">🔐</span>
        <h1 className="mt-4 text-xl font-bold text-foreground">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">You need administrator privileges to access this page.</p>
      </div>
    );
  }

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || log.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-600/10 text-green-600 dark:text-green-400";
      case "failed":
        return "bg-destructive/10 text-destructive";
      case "warning":
        return "bg-yellow-600/10 text-yellow-600 dark:text-yellow-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes("Login")) return "🔑";
    if (action.includes("User")) return "👤";
    if (action.includes("Transaction")) return "💳";
    if (action.includes("Report")) return "📊";
    if (action.includes("Role")) return "🔐";
    if (action.includes("Backup")) return "💾";
    if (action.includes("Security")) return "⚠️";
    return "📋";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Log</h1>
          <p className="mt-1 text-muted-foreground">Track all system activities and user actions</p>
        </div>
        <Button onClick={() => toast.info("Log export is coming soon")} className="bg-primary hover:bg-primary/80">
          📥 Export Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="text-2xl font-bold text-foreground">{mockAuditLogs.length}</div>
          <div className="text-sm text-muted-foreground">Total Events</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{mockAuditLogs.filter((l) => l.status === "success").length}</div>
          <div className="text-sm text-muted-foreground">Successful</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="text-2xl font-bold text-destructive">{mockAuditLogs.filter((l) => l.status === "failed").length}</div>
          <div className="text-sm text-muted-foreground">Failed</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{mockAuditLogs.filter((l) => l.status === "warning").length}</div>
          <div className="text-sm text-muted-foreground">Warnings</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
          <Input
            placeholder="Search by user, action, or target..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {["all", "success", "failed", "warning"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filterType === type
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Timestamp</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">User</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Action</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Target</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">IP Address</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted">
                  <td className="px-6 py-4 text-muted-foreground">{log.timestamp}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{log.user}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span>{getActionIcon(log.action)}</span>
                      <span className="text-foreground">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{log.target}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{log.ip}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(log.status)}`}>
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
