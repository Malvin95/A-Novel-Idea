import Link from "next/link";
import Sidebar from "@/components/molecules/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      {/* Sidebar (atomised) */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top navbar */}
        <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Dashboard</h2>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                Sign out
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

