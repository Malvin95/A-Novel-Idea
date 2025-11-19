export default function StatsCard({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{title}</div>
      <div className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">{value}</div>
    </div>
  );
}
