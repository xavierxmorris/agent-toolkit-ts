"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { cn } from "@/components/lib/utils";

// Toast types
type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Convenience functions
export function toast(options: Omit<Toast, "id">) {
  // This will be populated by the provider
  const event = new CustomEvent("toast", { detail: options });
  window.dispatchEvent(event);
}

toast.success = (title: string, description?: string) => {
  toast({ type: "success", title, description });
};

toast.error = (title: string, description?: string) => {
  toast({ type: "error", title, description });
};

toast.warning = (title: string, description?: string) => {
  toast({ type: "warning", title, description });
};

toast.info = (title: string, description?: string) => {
  toast({ type: "info", title, description });
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Listen for global toast events - properly cleanup to avoid memory leaks
  useEffect(() => {
    const handleToast = ((e: CustomEvent<Omit<Toast, "id">>) => {
      addToast(e.detail);
    }) as EventListener;
    
    window.addEventListener("toast", handleToast);
    return () => window.removeEventListener("toast", handleToast);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ 
  toasts, 
  onRemove 
}: { 
  toasts: Toast[]; 
  onRemove: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ 
  toast, 
  onRemove 
}: { 
  toast: Toast; 
  onRemove: (id: string) => void;
}) {
  const icons: Record<ToastType, string> = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  const colors: Record<ToastType, string> = {
    success: "border-green-600 bg-green-600/10 text-green-600 dark:border-green-400 dark:bg-green-400/10 dark:text-green-400",
    error: "border-destructive bg-destructive/10 text-destructive",
    warning: "border-yellow-600 bg-yellow-600/10 text-yellow-600 dark:border-yellow-400 dark:bg-yellow-400/10 dark:text-yellow-400",
    info: "border-primary bg-primary/10 text-primary",
  };

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      aria-live={toast.type === "error" ? "assertive" : "polite"}
      className={cn(
        "flex min-w-[300px] max-w-md items-start gap-3 rounded-lg border-l-4 bg-card p-4 shadow-lg",
        colors[toast.type]
      )}
    >
      <span className="text-lg">{icons[toast.type]}</span>
      <div className="flex-1">
        <p className="font-medium text-foreground">{toast.title}</p>
        {toast.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-muted-foreground hover:text-foreground"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}
