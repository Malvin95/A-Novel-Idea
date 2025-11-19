import ProjectsPanel from "./ProjectsPanel";
import ClaimsPanel from "./ClaimsPanel";

export default function DashboardPanel() {
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">Welcome to your dashboard. Here`s an overview of your data.</p>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Recent Activity</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">No recent activity to display.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ProjectsPanel />
            <ClaimsPanel />
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Pending Claims</div>
                <div className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">0</div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Approved Claims</div>
                <div className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">0</div>
            </div>
        </div>
    </div>
  );
}
