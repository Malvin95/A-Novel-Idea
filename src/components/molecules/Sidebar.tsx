import Logo from "@/components/atoms/Logo";
import NavLink from "@/components/atoms/NavLink";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
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
        </ul>
      </nav>
    </aside>
  );
}
