"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center">
          <div className="mb-4 text-5xl">⚠️</div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Something went wrong
          </h2>
          <p className="mb-6 max-w-md text-muted-foreground">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
          <div className="flex gap-3">
            <Button onClick={this.handleReset}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre className="mt-6 max-w-full overflow-auto rounded-lg bg-muted p-4 text-left text-xs text-destructive">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
