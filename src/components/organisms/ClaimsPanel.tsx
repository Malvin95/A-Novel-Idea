"use client";
import { useEffect, useState, useCallback } from "react";
import StatsCard from "../molecules/StatsCard";
import { normalizeItemsResponse } from "../../lib/dynamo/normalize";
import { Claim } from "@/shared/interfaces";
import { Button } from "../atoms/ui/button";
import { Edit2Icon, Trash2 } from "lucide-react";
import { H1, H3 } from "../atoms/Typography";

export default function ClaimsPanel() {
  const [items, setItems] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/claims");
      const data = await r.json();
      const normalized = normalizeItemsResponse(data);
      const list = Array.isArray(normalized?.Items) ? normalized.Items : [];
      setItems(list);
    } catch (err: any) {
      setError(String(err));
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
        {!loading && items.slice(0, 6).map((it, idx) => {
          return (
            <div key={idx} className="rounded-md border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                <H3>{String(it.companyName)}</H3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Associated Project: {String(it.associatedProject)}</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Claim Period: {String(it.claimPeriod)}</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Claim Amount: {String(it.amount)}</p>
                <div className="flex">
                    <div>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Current Status: {String(it.status)}</p>
                        <pre className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{String(it.claimPeriod)}</pre>
                    </div>
                    <div className="ml-auto flex flex-wrap items-center gap-1 md:flex-row">
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
