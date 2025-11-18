export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Projects
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Manage your projects
          </p>
        </div>
        <button className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100">
          New Project
        </button>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-center py-12">
          <p className="text-zinc-600 dark:text-zinc-400">
            No projects found. Create your first project to get started.
          </p>
        </div>
      </div>
    </div>
  );
}

