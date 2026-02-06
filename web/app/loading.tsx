export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xl font-bold">
          FB
        </div>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading&hellip;</p>
      </div>
    </div>
  );
}
