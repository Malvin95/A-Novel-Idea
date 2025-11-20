"use client";
import { useEffect, useState, useCallback } from "react";
import StatsCard from "../molecules/StatsCard";
import InfoCard from "../molecules/InfoCard";
import { normalizeItemsResponse } from "../../lib/dynamo/normalize";
import { Project } from "@/shared/interfaces";

interface ProjectsPanelProps {
  onRefreshNeeded?: (refreshFn: () => void) => void;
}

export default function ProjectsPanel({ onRefreshNeeded }: ProjectsPanelProps) {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteProject = async (id: string | undefined, dateCreated: string) => {
    if (!id) return;
    
    try {
      const response = await fetch(`/api/projects/${id}?dateCreated=${encodeURIComponent(dateCreated)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete project: ${response.statusText}`);
      }

      // Refresh the list after successful deletion
      await fetchProjects();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Error deleting project:", msg);
      setError(msg);
    }
  };

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
        {!loading && items.slice(0, 6).map((it, idx) => (
          <InfoCard
            key={idx}
            item={it}
            type="project"
            onEdit={() => fetchProjects()}
            onDelete={() => handleDeleteProject(it.id, it.dateCreated)}
          />
        ))}
      </div>
    </div>
  );
}
