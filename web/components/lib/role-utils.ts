import { cn } from "@/components/lib/utils";

/**
 * Returns Tailwind classes for a role badge (background + text color).
 * Centralises the repeated role → colour mapping across the app.
 */
export function getRoleBadgeClasses(role: string): string {
  switch (role) {
    case "admin":
      return "bg-destructive/10 text-destructive";
    case "manager":
      return "bg-yellow-600/10 text-yellow-600 dark:text-yellow-400";
    default:
      return "bg-green-600/10 text-green-600 dark:text-green-400";
  }
}

/**
 * Returns Tailwind classes for a role badge with border (used in larger pills).
 */
export function getRolePillClasses(role: string): string {
  switch (role) {
    case "admin":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "manager":
      return "bg-yellow-600/10 text-yellow-600 border-yellow-600/20 dark:text-yellow-400 dark:border-yellow-400/20";
    default:
      return "bg-green-600/10 text-green-600 border-green-600/20 dark:text-green-400 dark:border-green-400/20";
  }
}

/**
 * Capitalises the first letter of a role string.
 */
export function formatRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

/**
 * Merge role badge classes with additional classnames using cn().
 */
export function roleBadge(role: string, className?: string): string {
  return cn("rounded-full px-2 py-0.5 text-xs font-medium", getRoleBadgeClasses(role), className);
}
