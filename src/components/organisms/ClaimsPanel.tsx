"use client";
import { useEffect, useState, useCallback } from "react";
import StatsCard from "../molecules/StatsCard";
import InfoCard from "../molecules/InfoCard";
import { normalizeItemsResponse } from "../../lib/dynamo/normalize";
import { Claim } from "@/shared/interfaces";

interface ClaimsPanelProps {
  onRefreshNeeded?: (refreshFn: () => void) => void;
}

export default function ClaimsPanel({ onRefreshNeeded }: ClaimsPanelProps) {
  const [items, setItems] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/claims");
      const data = await r.json();
      const normalized = normalizeItemsResponse(data) as Record<string, unknown>;
      const list = Array.isArray(normalized?.Items as unknown) ? (normalized.Items as unknown[]) : [];
      setItems(list as Claim[]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    if (mounted) fetchClaims();
    return () => {
      mounted = false;
    };
  }, [fetchClaims]);

  useEffect(() => {
    if (onRefreshNeeded) {
      onRefreshNeeded(fetchClaims);
    }
  }, [onRefreshNeeded, fetchClaims]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <StatsCard title="Claims" value={loading ? "…" : items.length} />
        <button className="ml-3 rounded px-2 py-1 text-sm bg-zinc-100 dark:bg-zinc-800" onClick={fetchClaims}>
          Refresh
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {loading && <div className="text-sm text-zinc-500">Loading claims…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {!loading && items.length === 0 && <div className="text-sm text-zinc-500">No claims found.</div>}
        {!loading && items.slice(0, 6).map((it, idx) => (
          <InfoCard
            key={idx}
            item={it}
            type="claim"
            onEdit={() => console.log("Edit claim:", it.id)}
            onDelete={() => console.log("Delete claim:", it.id)}
          />
        ))}
      </div>
    </div>
  );
}
