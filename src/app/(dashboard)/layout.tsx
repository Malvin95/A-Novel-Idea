import Sidebar from "@/components/molecules/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <Sidebar />

      <div className="flex flex-1 flex-col">

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

