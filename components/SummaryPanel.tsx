"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getDayBoundsISO } from "@/lib/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function SummaryPanel({
  timezone: propTimezone,
  refreshTrigger,
  onTotalsChange,
}: {
  timezone?: string;
  refreshTrigger?: number;
  onTotalsChange?: (totals: { type: string; total: number }[]) => void;
}) {
  const [timezone, setTimezone] = useState<string>("Europe/Moscow");
  const [summary, setSummary] = useState<{ type: string; total: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshSummary = async () => {
    setLoading(true);
    const { data: me } = await supabase.auth.getUser();
    const userId = me.user?.id;
    if (!userId) return;

    let tz = propTimezone ?? timezone;
    if (!propTimezone) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("timezone")
        .eq("user_id", userId)
        .maybeSingle();
      if (profile?.timezone) {
        tz = profile.timezone;
        setTimezone(profile.timezone);
      }
    }

    const { startISO, endISO } = getDayBoundsISO(tz);
    const { data: ex } = await supabase.from("exercises").select("id,type");
    const results: { type: string; total: number }[] = [];
    let grand = 0;

    for (const e of ex || []) {
      const { data: sets } = await supabase
        .from("sets")
        .select("reps,created_at")
        .eq("exercise_id", e.id)
        .gte("created_at", startISO)
        .lte("created_at", endISO);
      const exerciseTotal = (sets || []).reduce((acc, r) => acc + (r.reps as number), 0);
      results.push({ type: e.type as string, total: exerciseTotal });
      grand += exerciseTotal;
    }

    setSummary(results);
    setTotal(grand);
    setLoading(false);
    onTotalsChange?.(results);
  };

  useEffect(() => {
    refreshSummary();
  }, [propTimezone, refreshTrigger]);

  useEffect(() => {
    const channel = supabase
      .channel("sets-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sets" },
        () => refreshSummary()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card aria-labelledby="summary-heading" className="overflow-hidden">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle id="summary-heading">Сводка за сегодня</CardTitle>
            <p className="mt-1 text-sm text-zinc-500">Дневной объём по всем упражнениям</p>
          </div>
          <Badge aria-label="Часовой пояс">{timezone}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-zinc-900 bg-black p-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Итого</div>
            <div className="mt-2 text-2xl font-semibold text-zinc-50">{loading ? "..." : total}</div>
          </div>
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Упражнений</div>
            <div className="mt-2 text-2xl font-semibold text-zinc-50">{summary.length}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Separator />
        <ul className="space-y-2 text-sm">
          {summary.length === 0 ? (
            <li className="rounded-2xl border border-dashed border-zinc-900 bg-black/60 px-3 py-4 text-center text-zinc-500">
              Пока нет активности за сегодня
            </li>
          ) : (
            summary.map((item) => (
              <li
                key={item.type}
                className="flex items-center justify-between rounded-2xl border border-zinc-900 bg-black/70 px-3 py-3"
              >
                <span className="capitalize text-zinc-300">{item.type}</span>
                <span className="font-semibold text-zinc-50">{loading ? "..." : item.total}</span>
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
