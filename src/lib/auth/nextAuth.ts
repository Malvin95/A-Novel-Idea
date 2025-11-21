import CognitoProvider from "next-auth/providers/cognito";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";

const useMockAuth = process.env.USE_MOCK_AUTH === "true";

export const authOptions: NextAuthOptions = {
  providers: useMockAuth
    ? [
        // Mock Credentials Provider for development
        CredentialsProvider({
          id: "mock-credentials",
          name: "Mock Auth (Dev Only)",
          credentials: {
            email: { label: "Email", type: "email", placeholder: "dev@example.com" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            // Accept any email/password in development
            if (credentials?.email) {
              return {
                id: "mock-user-123",
                email: credentials.email,
                name: credentials.email.split("@")[0],
              };
            }
            return null;
          },
        }),
      ]
    : [
        // Real Cognito Provider for production
        CognitoProvider({
          clientId: process.env.COGNITO_CLIENT_ID || "",
          clientSecret: process.env.COGNITO_CLIENT_SECRET || "",
          issuer: process.env.COGNITO_ISSUER || undefined,
        }),
      ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === "production", // Secure cookies in production
      },
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (useMockAuth) {
        console.log("🧪 Mock SignIn - User authenticated:", user?.email);
      } else {
        console.log("✅ SignIn callback - User authenticated:", user?.email);
      }
      // Allow sign in
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("🔀 Redirect callback - url:", url, "baseUrl:", baseUrl);
      // If url is relative, prepend baseUrl
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`;
        console.log("  → Redirecting to:", redirectUrl);
        return redirectUrl;
      }
      // Allow callback to same origin
      if (new URL(url).origin === baseUrl) {
        console.log("  → Redirecting to:", url);
        return url;
      }
      // Default to dashboard
      const defaultUrl = `${baseUrl}/dashboard`;
      console.log("  → Redirecting to default:", defaultUrl);
      return defaultUrl;
    },
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account) {
        if (useMockAuth) {
          console.log("🧪 Mock JWT - Creating token for user:", user?.email);
          // In mock mode, assign admin role for testing
          token.roles = ["admin"];
        } else {
          console.log("🎫 JWT callback - Creating token for user:", user?.email);
          console.log("   Account provider:", account.provider);
          console.log("   Has access_token:", !!account.access_token);
          
          // Extract Cognito groups from the ID token
          const idToken = account.id_token;
          if (idToken) {
            try {
              // Decode the JWT to extract groups (base64 decode the payload)
              const payload = JSON.parse(
                Buffer.from(idToken.split('.')[1], 'base64').toString()
              );
              token.roles = payload['cognito:groups'] || [];
              console.log("   Cognito groups:", token.roles);
            } catch (error) {
              console.error("   Error decoding ID token:", error);
              token.roles = [];
            }
          } else {
            token.roles = [];
          }
        }
        
        // Only store essential info to keep cookie size small
        token.sub = user?.id;
        token.email = user?.email;
        token.name = user?.name;
        // Don't store full tokens in cookie to reduce size
        // token.accessToken = account.access_token;
        // token.idToken = account.id_token;
        // token.refreshToken = account.refresh_token;
        token.expiresAt = Date.now() + Number(account.expires_in ?? 0) * 1000;
      } else {
        console.log("🎫 JWT callback - Existing token for:", token.email);
      }

      return token;
    },
    async session({ session, token }) {
      console.log("📋 Session callback - Creating session for:", token.email);
      // Add user info and roles to session
      if (session.user) {
        (session.user as any).id = token.sub as string;
        (session.user as any).roles = token.roles || [];
      }
      return session;
    },
  },
};

export default function createNextAuthHandler(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions);
}
