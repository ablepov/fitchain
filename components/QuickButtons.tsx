"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return sorted[mid];
}

export function QuickButtons({ exerciseId, onAdded }: { exerciseId: string; onAdded?: () => void }) {
  const [lastReps, setLastReps] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMsg(null);
      const params = new URLSearchParams({ exerciseId, limit: "20" });
      const res = await fetch(`/api/sets?${params.toString()}`);
      if (!res.ok) {
        setMsg(`Ошибка загрузки: ${res.status}`);
        setLoading(false);
        return;
      }
      const j = await res.json();
      const reps: number[] = (j.data as any[]).map((r) => r.reps);
      setLastReps(reps);
      setLoading(false);
    })();
  }, [exerciseId]);

  const buttons = useMemo(() => {
    const m = median(lastReps);
    if (!m) return [3, 5, 8];
    return [m - 2, m, m + 2].map((v) => Math.max(1, v));
  }, [lastReps]);

  async function addReps(amount: number) {
    setMsg(null);
    setSending(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
    const res = await fetch(`/api/sets`, {
      method: "POST",
      headers,
      body: JSON.stringify({ exerciseId, reps: amount, source: "quickbutton" }),
    });
    // отправим телеметрию (best-effort)
    fetch('/api/telemetry', {
      method: 'POST',
      headers,
      body: JSON.stringify({ event: 'quickbutton_click', exerciseId, reps: amount })
    }).catch(() => {});

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setMsg(`Ошибка: ${res.status} ${j.error?.message ?? ""}`);
      setSending(false);
      return;
    }
    if (onAdded) onAdded();
    setLastReps((prev) => [amount, ...prev].slice(0, 20));
    setSending(false);
  }

  return (
    <div className="flex flex-col gap-2" role="group" aria-label="Быстрые кнопки">
      <div className="flex gap-2">
        {buttons.map((v, index) => (
          <button
            key={`${v}-${index}`}
            className="px-3 py-2 rounded bg-black text-white disabled:opacity-60"
            onClick={() => addReps(v)}
            aria-label={`Добавить ${v}`}
            disabled={sending}
          >
            +{v}
          </button>
        ))}
        <button className="px-3 py-2 rounded border disabled:opacity-60" onClick={() => addReps(1)} disabled={sending} aria-label="Добавить 1">+1</button>
      </div>
      {loading && <p className="text-xs text-gray-500">Загрузка истории...</p>}
      {msg && <p className="text-xs text-gray-600">{msg}</p>}
    </div>
  );
}
