import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-3xl font-bold">
        FB
      </div>
      <h1 className="mt-6 text-6xl font-bold text-foreground">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-foreground">
        Page Not Found
      </h2>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Please check the URL or navigate back to the portal.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
