import { cn } from "@/components/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "destructive";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-secondary text-secondary-foreground",
        variant === "success" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        variant === "warning" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        variant === "destructive" && "bg-destructive/10 text-destructive",
        className
      )}
    >
      {children}
    </span>
  );
}
