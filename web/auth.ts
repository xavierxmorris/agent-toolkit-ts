import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

// Build providers list based on available configuration
const providers = [];

// Add Azure AD if configured
if (process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET && process.env.AZURE_AD_TENANT_ID) {
  providers.push(
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
    })
  );
}

// Add Credentials provider (test accounts only in development)
providers.push(
  Credentials({
    name: "Development Login",
    credentials: {
      email: { label: "Email", type: "email", placeholder: "user@example.com" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.toString();
      const password = credentials?.password?.toString();

      if (!email || !password) return null;

      // Test accounts — only available in development
      if (process.env.NODE_ENV === "development") {
        const testUsers = [
          {
            id: "admin-1",
            email: "admin@securebank.com",
            password: "admin123",
            name: "Admin User",
            role: "admin",
          },
          {
            id: "manager-1",
            email: "manager@securebank.com",
            password: "manager123",
            name: "Sarah Manager",
            role: "manager",
          },
          {
            id: "user-1",
            email: "user@securebank.com",
            password: "user123",
            name: "John User",
            role: "user",
          },
        ];

        const user = testUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
      }

      return null;
    },
  })
);

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers,
  trustHost: true, // Required for development
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Return true if user is authenticated
      return !!auth;
    },
    jwt: async ({ token, user }) => {
      // Persist user data in JWT token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
