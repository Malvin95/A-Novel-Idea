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
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = Date.now() + Number(account.expires_in ?? 0) * 1000;
      }

      // Optionally refresh token if expired (simple implementation)
      if (token.expiresAt && Date.now() > (token.expiresAt as number) - 30_000) {
        try {
          const url = `${process.env.COGNITO_ISSUER}/oauth2/token`;
          const body = new URLSearchParams({
            grant_type: "refresh_token",
            client_id: process.env.COGNITO_CLIENT_ID || "",
            refresh_token: token.refreshToken as string,
          });

          const headers: Record<string, string> = {
            "Content-Type": "application/x-www-form-urlencoded",
          };

          // If client secret is present, include Basic auth
          if (process.env.COGNITO_CLIENT_SECRET) {
            headers["Authorization"] = `Basic ${Buffer.from(
              `${process.env.COGNITO_CLIENT_ID}:${process.env.COGNITO_CLIENT_SECRET}`
            ).toString("base64")}`;
          }

          const resp = await fetch(url, { method: "POST", headers, body: body.toString() });
          const refreshed = await resp.json();

          if (resp.ok) {
            token.accessToken = refreshed.access_token;
            token.idToken = refreshed.id_token ?? token.idToken;
            token.expiresAt = Date.now() + (refreshed.expires_in ?? 3600) * 1000;
            if (refreshed.refresh_token) token.refreshToken = refreshed.refresh_token;
          } else {
            token.error = "RefreshAccessTokenError";
          }
        } catch (e) {
          token.error = "RefreshAccessTokenError";
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Expose token values on the session object
      (session as any).accessToken = token.accessToken;
      (session as any).idToken = token.idToken;
      (session as any).error = token.error;
      return session;
    },
  },
};

export default function createNextAuthHandler(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions);
}
