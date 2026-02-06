"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  isLoading?: boolean;
}

/**
 * Confirmation dialog component for destructive or important actions.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
}: ConfirmDialogProps) {
  const icons = {
    danger: "⚠️",
    warning: "⚡",
    default: "❓",
  };

  const buttonStyles = {
    danger: "bg-destructive text-white hover:bg-destructive/80",
    warning: "bg-yellow-600 text-white hover:bg-yellow-700",
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
  };

  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center">
        <span className="text-5xl">{icons[variant]}</span>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          {title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className={buttonStyles[variant]}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processing...
            </span>
          ) : (
            confirmLabel
          )}
        </Button>
      </div>
    </Dialog>
  );
}
