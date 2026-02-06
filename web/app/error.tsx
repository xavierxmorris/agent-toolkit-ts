"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
      <div className="mb-6 text-6xl">⚠️</div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        Something went wrong
      </h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        An unexpected error occurred. Please try again or contact support if the
        problem persists.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try Again</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Go Home
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
