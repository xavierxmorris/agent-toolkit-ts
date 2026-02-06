/**
 * Shared types used across the application.
 */

/** User role union — kept in sync with NextAuth session */
export type UserRole = "admin" | "manager" | "user";

/** Sort direction for table columns */
export type SortDirection = "asc" | "desc";
