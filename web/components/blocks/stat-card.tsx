import { cn } from "@/components/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  className?: string;
}

/**
 * Stat card component for displaying KPIs and metrics.
 */
export function StatCard({ label, value, icon, change, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-xs transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between">
        {icon && <span className="text-2xl">{icon}</span>}
        {change && (
          <span
            className={cn(
              "text-sm font-medium",
              change.trend === "up" && "text-green-600 dark:text-green-400",
              change.trend === "down" && "text-destructive",
              change.trend === "neutral" && "text-muted-foreground"
            )}
          >
            {change.value}
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-foreground">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

interface StatCardsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * Grid container for stat cards with responsive columns.
 */
export function StatCardsGrid({ children, columns = 4, className }: StatCardsGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}
