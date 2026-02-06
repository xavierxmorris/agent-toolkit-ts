"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AuthenticatedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Authenticated route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 text-6xl">⚠️</div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        Something went wrong
      </h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        An unexpected error occurred while loading this page. Please try again
        or navigate to a different section.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try Again</Button>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Go to Dashboard
        </Button>
      </div>
      {error.digest && (
        <p className="mt-6 text-xs text-muted-foreground">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
