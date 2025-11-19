import Link from "next/link";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={className}>
      <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">A Novel Idea</span>
    </Link>
  );
}
