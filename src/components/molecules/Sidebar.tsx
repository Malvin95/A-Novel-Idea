"use client";

import Logo from "@/components/atoms/Logo";
import NavLink from "@/components/atoms/NavLink";
import { signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "../atoms/ui/button";

export default function Sidebar() {
    const handleSignOut = async () => {
      await signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    };

  return (
    <aside className="w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 flex flex-col">
      <div className="flex h-16 items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
        <Logo />
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <NavLink href="/dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink href="/dashboard/projects">Projects</NavLink>
          </li>
          <li>
            <NavLink href="/dashboard/claims">Claims</NavLink>
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>

      <div className="flex items-center gap-4 mt-auto mb-10 p-4">
        <Button
          onClick={handleSignOut}
          variant="destructive"
          aria-label="Sign Out"
          className="mx-auto"
          // className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
        >
          Sign out
        </Button>
      </div>
    </aside>
  );
}
