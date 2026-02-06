"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInAction } from "./actions";

// Test accounts for quick login — only visible when NEXT_PUBLIC_SHOW_TEST_ACCOUNTS=true
const TEST_ACCOUNTS = [
  { email: "admin@securebank.com", password: "admin123", role: "Admin", color: "bg-destructive" },
  { email: "manager@securebank.com", password: "manager123", role: "Manager", color: "bg-yellow-500" },
  { email: "user@securebank.com", password: "user123", role: "User", color: "bg-green-600" },
];

const SHOW_TEST_ACCOUNTS = process.env.NEXT_PUBLIC_SHOW_TEST_ACCOUNTS === "true";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const urlError = searchParams.get("error");

  // useActionState handles the server action lifecycle properly —
  // it won't break on redirect errors like manual await does.
  const [state, formAction, isPending] = useActionState(signInAction, {
    error: null,
  });

  const displayError =
    state?.error || (urlError === "CredentialsSignin" ? "Invalid credentials" : urlError) || null;

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden w-1/2 bg-primary lg:flex lg:flex-col lg:justify-between p-12">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground text-primary font-bold text-xl">
              FB
            </div>
            <div className="text-primary-foreground">
              <div className="text-xl font-bold">FinanceBank</div>
              <div className="text-sm text-primary-foreground/70">Business Portal</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-primary-foreground leading-tight">
            Secure Banking<br />for Modern Business
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-md">
            Manage your client accounts, track transactions, and grow your business with our comprehensive banking platform.
          </p>
          <div className="flex gap-8 pt-4">
            <div>
              <div className="text-3xl font-bold text-primary-foreground">$2.5B+</div>
              <div className="text-sm text-primary-foreground/70">Transactions Processed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-foreground">50K+</div>
              <div className="text-sm text-primary-foreground/70">Business Clients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-foreground">99.9%</div>
              <div className="text-sm text-primary-foreground/70">Uptime</div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-primary-foreground/60">
          © 2026 FinanceBank. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
              FB
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">FinanceBank</div>
              <div className="text-sm text-muted-foreground">Business Portal</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-xs">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to access your business portal
              </p>
            </div>

            {/* Error Message */}
            {displayError && (
              <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                ⚠️ {displayError}
              </div>
            )}

            {/* Security Badge */}
            <div className="mb-6 flex items-center justify-center gap-2 rounded-lg bg-green-600/10 px-4 py-2 text-sm text-green-600 dark:text-green-400">
              <span>🔒</span>
              <span>256-bit SSL Encrypted Connection</span>
            </div>

            {/* Server Action Form — bound to useActionState for proper redirect handling */}
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="callbackUrl" value={callbackUrl} />
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
                  Business Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="yourname@company.com"
                  required
                  className="h-12"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="h-12"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input type="checkbox" className="rounded border-border" />
                  Remember this device
                </label>
                <button type="button" className="text-primary hover:underline cursor-not-allowed opacity-60" disabled aria-disabled="true">
                  Forgot password?
                </button>
              </div>
              <Button 
                type="submit" 
                className="h-12 w-full text-base font-semibold" 
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In to Portal"
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          {/* Help Section */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Need help? <button type="button" className="text-primary hover:underline cursor-not-allowed opacity-60" disabled aria-disabled="true">Contact Support</button>
          </div>

          {/* Test Accounts Section - Development Only */}
          {SHOW_TEST_ACCOUNTS && (
          <div className="mt-6 rounded-xl border border-dashed border-border bg-muted p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span>🧪</span>
              <span>Test Accounts (Development)</span>
            </div>
            <div className="space-y-2">
              {TEST_ACCOUNTS.map((account) => (
                <form key={account.email} action={formAction}>
                  <input type="hidden" name="email" value={account.email} />
                  <input type="hidden" name="password" value={account.password} />
                  <input type="hidden" name="callbackUrl" value={callbackUrl} />
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <span 
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold ${account.color}`}
                      >
                        {account.role[0]}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-foreground">{account.email}</div>
                        <div className="text-xs text-muted-foreground">Password: {account.password}</div>
                      </div>
                    </div>
                    <span 
                      className={`rounded-full px-2 py-1 text-xs font-medium text-white ${account.color}`}
                    >
                      {account.role}
                    </span>
                  </button>
                </form>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Click any account above to login instantly
            </p>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Suspense boundary required for useSearchParams() in Next.js 16
export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}