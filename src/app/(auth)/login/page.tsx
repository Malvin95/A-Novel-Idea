"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { H1, P } from "@/components/atoms/Typography";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [useMockAuth, setUseMockAuth] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Check if mock auth is enabled
  useEffect(() => {
    const checkMockAuth = async () => {
      try {
        const res = await fetch("/api/config/auth-mode");
        const data = await res.json();
        setUseMockAuth(data.useMockAuth || false);
      } catch {
        setUseMockAuth(false);
      }
    };
    checkMockAuth();
  }, []);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      console.log("✅ Session authenticated, redirecting to dashboard...", session);
      router.push("/dashboard");
    } else if (status === "unauthenticated") {
      console.log("❌ No session found");
    } else {
      console.log("⏳ Session status:", status);
    }
  }, [status, router, session]);

  async function handleMockSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("mock-credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      setError((err as Error)?.message || "Mock sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCognitoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = (await signIn("cognito", {
        redirect: false,
        login_hint: email,
        callbackUrl: "/dashboard",
      })) as unknown;

      if (typeof result === "object" && result !== null) {
        const r = result as Record<string, unknown>;
        if (r.error && typeof r.error === "string") {
          setError(r.error);
        } else if (r.url && typeof r.url === "string") {
          window.location.href = r.url;
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError((err as Error)?.message || "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = useMockAuth ? handleMockSubmit : handleCognitoSubmit;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
        <div>
          <H1>Sign in to your account</H1>
          <P>
            {useMockAuth
              ? "🧪 Mock Auth Mode - Enter any email to sign in (dev only)"
              : "Enter your details to access the dashboard or use the Cognito sign-in button below."}
          </P>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Input id="email" label="Email address" value={email} onChange={setEmail} type="email" placeholder="you@example.com" />
            </div>
            <div>
              <Input id="password" label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-300 text-zinc-600 focus:ring-zinc-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-zinc-600 hover:text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300">
                Forgot password?
              </a>
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div>
            <Button type="submit" className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>

        {!useMockAuth && (
          <div className="space-y-4">
            <Button type="button" onClick={() => signIn("cognito", { callbackUrl: "/dashboard" })} className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              Sign in with Cognito
            </Button>
          </div>
        )}
        <div className="text-center text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Do not have an account? </span>
          <a href="/register" className="font-medium text-zinc-900 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}

