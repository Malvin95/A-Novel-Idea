export function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{children}</h1>;
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{children}</h1>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-zinc-600 dark:text-zinc-400">{children}</p>;
}
