import CognitoProvider from "next-auth/providers/cognito";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";

export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID || "",
      clientSecret: process.env.COGNITO_CLIENT_SECRET || '',
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
        secure: false, // Set to false for localhost
      },
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("✅ SignIn callback - User authenticated:", user?.email);
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
        console.log("🎫 JWT callback - Creating token for user:", user?.email);
        console.log("   Account provider:", account.provider);
        console.log("   Has access_token:", !!account.access_token);
        // Only store essential info to keep cookie size small
        token.sub = user?.id;
        token.email = user?.email;
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
      // Add user info to session
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
};

export default function createNextAuthHandler(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions);
}
