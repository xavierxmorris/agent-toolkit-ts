"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

const reportTypes = [
  { id: "transactions", name: "Transaction Report", description: "Detailed breakdown of all transactions", icon: "💳" },
  { id: "clients", name: "Client Summary", description: "Overview of all client accounts", icon: "👥" },
  { id: "revenue", name: "Revenue Analysis", description: "Monthly and yearly revenue trends", icon: "📈" },
  { id: "compliance", name: "Compliance Report", description: "Regulatory compliance status", icon: "✅" },
];

const recentReports = [
  { id: 1, name: "Q4 2025 Financial Summary", type: "Revenue Analysis", date: "Jan 15, 2026", status: "completed" },
  { id: 2, name: "December Transactions", type: "Transaction Report", date: "Jan 5, 2026", status: "completed" },
  { id: 3, name: "Annual Compliance Review", type: "Compliance Report", date: "Jan 2, 2026", status: "completed" },
  { id: 4, name: "Client Portfolio Analysis", type: "Client Summary", date: "Dec 28, 2025", status: "completed" },
];

export default function ReportsPage() {
  const { data: session } = useSession();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const userRole = session?.user?.role ?? "user";
  const canExport = userRole === "admin" || userRole === "manager";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="mt-1 text-muted-foreground">Generate and download business reports</p>
        </div>
        {canExport && (
          <Button onClick={() => toast.info("Report scheduling is coming soon")} className="bg-primary hover:bg-primary/80">
            📊 Schedule Report
          </Button>
        )}
      </div>

      {/* Report Types */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Generate New Report</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reportTypes.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`rounded-xl border p-6 text-left transition-all hover:border-primary/50 hover:shadow-md ${
                selectedReport === report.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <span className="text-3xl">{report.icon}</span>
              <h3 className="mt-3 font-semibold text-foreground">{report.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{report.description}</p>
            </button>
          ))}
        </div>
        {selectedReport && (
          <div className="mt-4 flex gap-3">
            <Button onClick={() => toast.info("Report generation is coming soon")} className="bg-primary hover:bg-primary/80">Generate Report</Button>
            <Button variant="outline" onClick={() => setSelectedReport(null)}>Cancel</Button>
          </div>
        )}
      </div>

      {/* Recent Reports */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Reports</h2>
        <div className="rounded-xl border border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted">
                <tr>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Report Name</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Type</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Generated</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-muted">
                    <td className="px-6 py-4 font-medium text-foreground">{report.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{report.type}</td>
                    <td className="px-6 py-4 text-muted-foreground">{report.date}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-green-600/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                        ✓ Completed
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => toast.info("Report viewer is coming soon")}>View</Button>
                        {canExport && <Button variant="outline" size="sm" onClick={() => toast.info("Report download is coming soon")}>Download</Button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
