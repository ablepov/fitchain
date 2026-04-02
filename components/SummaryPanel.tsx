"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getDayBoundsISO } from "@/lib/date";
import { logger } from "@/lib/logger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type SummaryItem = {
  type: string;
  total: number;
};

export function SummaryPanel({
  timezone: propTimezone,
  refreshTrigger,
  onTotalsChange,
}: {
  timezone?: string;
  refreshTrigger?: number;
  onTotalsChange?: (totals: SummaryItem[]) => void;
}) {
  const [timezone, setTimezone] = useState<string>("Europe/Moscow");
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshSummary = useCallback(async () => {
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      const userId = authData.user?.id;

      if (authError || !userId) {
        setSummary([]);
        setTotal(0);
        onTotalsChange?.([]);
        return;
      }

      let effectiveTimezone = propTimezone ?? timezone;

      if (!propTimezone) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("timezone")
          .eq("user_id", userId)
          .maybeSingle();

        if (profileError) {
          throw new Error(profileError.message);
        }

        if (profile?.timezone) {
          effectiveTimezone = profile.timezone;
          setTimezone((currentTimezone) =>
            currentTimezone === profile.timezone ? currentTimezone : profile.timezone
          );
        }
      }

      const { startISO, endISO } = getDayBoundsISO(effectiveTimezone);

      const [exercisesResult, setsResult] = await Promise.all([
        supabase.from("exercises").select("id, type").order("created_at", { ascending: true }),
        supabase
          .from("sets")
          .select("exercise_id, reps")
          .gte("created_at", startISO)
          .lte("created_at", endISO),
      ]);

      if (exercisesResult.error) {
        throw new Error(exercisesResult.error.message);
      }

      if (setsResult.error) {
        throw new Error(setsResult.error.message);
      }

      const totalsByExerciseId = new Map<string, number>();
      for (const set of setsResult.data ?? []) {
        const currentTotal = totalsByExerciseId.get(set.exercise_id) ?? 0;
        totalsByExerciseId.set(set.exercise_id, currentTotal + set.reps);
      }

      const results = (exercisesResult.data ?? []).map((exercise) => ({
        type: exercise.type as string,
        total: totalsByExerciseId.get(exercise.id) ?? 0,
      }));

      const nextTotal = results.reduce((sum, item) => sum + item.total, 0);

      setSummary(results);
      setTotal(nextTotal);
      onTotalsChange?.(results);
    } catch (error) {
      logger.warn(
        "Failed to refresh summary",
        "SummaryPanel",
        error instanceof Error ? error : new Error(String(error))
      );
      setSummary([]);
      setTotal(0);
      onTotalsChange?.([]);
    } finally {
      setLoading(false);
    }
  }, [onTotalsChange, propTimezone, timezone]);

  useEffect(() => {
    refreshSummary();
  }, [refreshSummary, refreshTrigger]);

  useEffect(() => {
    const handleFocus = () => {
      void refreshSummary();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refreshSummary();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshSummary]);

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
