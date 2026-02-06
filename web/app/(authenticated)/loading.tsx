export default function AuthenticatedLoading() {
  return (
    <div className="space-y-6 p-0">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-96 animate-pulse rounded-lg bg-muted" />
      </div>

      {/* Stats skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="mb-3 h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="mb-2 h-8 w-20 animate-pulse rounded bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-4">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                <div className="h-3 w-32 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
