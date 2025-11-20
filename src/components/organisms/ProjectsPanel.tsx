"use client";
import { useEffect, useState, useCallback } from "react";
import StatsCard from "../molecules/StatsCard";
import { normalizeItemsResponse } from "../../lib/dynamo/normalize";
import { Project } from "@/shared/interfaces";
import { Button } from "../atoms/ui/button";
import { Edit2Icon, Trash2 } from "lucide-react";
import { H3 } from "../atoms/Typography";

interface ProjectsPanelProps {
  onRefreshNeeded?: (refreshFn: () => void) => void;
}

export default function ProjectsPanel({ onRefreshNeeded }: ProjectsPanelProps) {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      const normalized = normalizeItemsResponse(data) as Record<string, unknown>;
      const list = Array.isArray(normalized?.Items as unknown) ? (normalized.Items as unknown[]) : [];
      setItems(list as Project[]);
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    if (mounted) fetchProjects();
    return () => {
      mounted = false;
    };
  }, [fetchProjects]);

  useEffect(() => {
    if (onRefreshNeeded) {
      onRefreshNeeded(fetchProjects);
    }
  }, [onRefreshNeeded, fetchProjects]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <StatsCard title="Projects" value={loading ? "…" : items.length} />
        <button className="ml-3 rounded px-2 py-1 text-sm bg-zinc-100 dark:bg-zinc-800" onClick={fetchProjects}>
          Refresh
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {loading && <div className="text-sm text-zinc-500">Loading projects…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {!loading && items.length === 0 && <div className="text-sm text-zinc-500">No projects found.</div>}
        {!loading && items.slice(0, 6).map((it, idx) => {
          const name = it.projectName;
          return (
              <div key={idx} className="rounded-md border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex">
                    <div>
                        <H3>{String(name)}</H3>
                        <pre className="my-1 text-xs text-zinc-500 dark:text-zinc-400">Date Created: {String(it.dateCreated)}</pre>
                    </div>
                    <div className="ml-auto flex flex-wrap items-center gap-2 md:flex-row">
                        <Button variant="outline" size="icon" aria-label="Edit" >
                            <Edit2Icon width="15" height="15" />
                        </Button>
                        <Button variant="outline" size="icon" aria-label="Delete">
                            <Trash2 width="15" height="15" />
                        </Button>
                    </div>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
