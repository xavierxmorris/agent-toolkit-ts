"use server";

import { signIn as authSignIn } from "@/auth";
import { AuthError } from "next-auth";

export async function signInAction(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  try {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const rawCallback = formData.get("callbackUrl")?.toString() || "/dashboard";

    if (!email || !password) {
      return { error: "Email and password are required." };
    }

    // Prevent open redirect — only allow relative paths
    const callbackUrl = rawCallback.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : "/dashboard";

    await authSignIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });

    return { error: null };
  } catch (error) {
    // AuthError is thrown for invalid credentials, etc.
    // Everything else (including NEXT_REDIRECT on success) is re-thrown
    // so Next.js can handle redirects natively.
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password. Please try again." };
        default:
          return { error: "An authentication error occurred. Please try again." };
      }
    }

    // Re-throw redirect errors and anything else — do NOT swallow them
    throw error;
  }
}
