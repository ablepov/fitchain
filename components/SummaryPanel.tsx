"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getDayBoundsISO } from "@/lib/date";

export function SummaryPanel({ 
  timezone: propTimezone, 
  refreshTrigger,
  onTotalsChange
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
    
    // Используем переданную таймзону или загружаем из профиля
    let tz = propTimezone;
    if (!tz) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("timezone")
        .eq("user_id", userId)
        .maybeSingle();
      tz = profile?.timezone || "Europe/Moscow";
    }
    setTimezone(tz);

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
      const s = (sets || []).reduce((acc, r) => acc + (r.reps as number), 0);
      results.push({ type: e.type as string, total: s });
      grand += s;
    }
    setSummary(results);
    setTotal(grand);
    setLoading(false);
    if (onTotalsChange) onTotalsChange(results);
  };

  useEffect(() => {
    refreshSummary();
  }, [propTimezone, refreshTrigger]);

  // Обновляем сводку при изменении данных
  useEffect(() => {
    const channel = supabase
      .channel('sets-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sets' },
        () => refreshSummary()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="p-3 border rounded space-y-2" aria-labelledby="summary-heading">
      <div className="flex items-center justify-between">
        <h2 id="summary-heading" className="font-medium">Сводка за сегодня</h2>
        <span className="text-xs text-gray-500" aria-label="Часовой пояс">Часовой пояс: {timezone}</span>
      </div>
        <ul className="text-sm space-y-1">
          {summary.map((s) => (
            <li key={s.type} className="flex items-center justify-between">
              <span>{s.type}</span>
              {loading ? (<span className="font-medium">?</span>):(<span className="font-medium">{s.total}</span>)}
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t pt-2">
          <span>Итого</span>
          {loading ? (<span className="font-medium">?</span>):(<span className="font-semibold">{total}</span>)}
        </div>

    </section>
  );
}
