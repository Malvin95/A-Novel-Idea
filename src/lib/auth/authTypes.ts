/**
 * Minimal TypeScript type extensions for NextAuth with Cognito roles
 */

import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

/**
 * Extend the built-in session types to include roles
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: string[];
    } & DefaultSession["user"];
  }
}

/**
 * Extend the built-in JWT types to include roles
 */
declare module "next-auth/jwt" {
  interface JWT {
    roles?: string[];
    expiresAt?: number;
  }
}
