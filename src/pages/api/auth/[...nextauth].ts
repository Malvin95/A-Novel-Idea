import NextAuth, { AuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth/nextAuth";

export default NextAuth(authOptions as AuthOptions);
