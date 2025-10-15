"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { QuickButtons } from "@/components/QuickButtons";
import { MiniChart } from "@/components/MiniChart";
import { SummaryPanel } from "@/components/SummaryPanel";



type Exercise = {
  id: string;
  type: 'pullups' | 'pushups' | 'squats';
  goal: number;
};

export default function Home() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [todayTotals, setTodayTotals] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const { data: me } = await supabase.auth.getUser();
      if (!me.user) {
        window.location.href = "/auth";
        return;
      }
      // загрузим упражнения
      const { data: ex } = await supabase
        .from("exercises")
        .select("id,type,goal")
        .order("created_at", { ascending: true });
      setExercises(ex ?? []);
    })();
  }, []);

  async function createBaseExercises() {
    setCreating(true);
    setMessage(null);
    const base = [
      { type: 'pullups' as const, goal: 100 },
      { type: 'pushups' as const, goal: 100 },
      { type: 'squats' as const, goal: 100 },
    ];
    // фильтруем те, которых ещё нет
    const existingTypes = new Set(exercises.map((e) => e.type));
    const toInsertBase = base.filter((b) => !existingTypes.has(b.type));
    if (toInsertBase.length === 0) {
      setMessage("Базовые упражнения уже созданы");
      setCreating(false);
      return;
    }
    const { data: me } = await supabase.auth.getUser();
    const userId = me.user?.id;
    if (!userId) {
      setMessage("Нет сессии пользователя");
      setCreating(false);
      return;
    }
    const toInsert = toInsertBase.map((b) => ({ ...b, user_id: userId }));
    const { error } = await supabase.from("exercises").insert(toInsert);
    if (error) {
      setMessage(`Ошибка: ${error.message}`);
    } else {
      // перезагрузим список
      const { data: ex } = await supabase
        .from("exercises")
        .select("id,type,goal")
        .order("created_at", { ascending: true });
      setExercises(ex ?? []);
      setMessage("Созданы базовые упражнения");
    }
    setCreating(false);
  }





  return (
    <main className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="hidden">
        <SummaryPanel 
          refreshTrigger={refreshTrigger}
          onTotalsChange={(totals) => {
            const totalsMap = totals.reduce((acc, { type, total }) => ({ ...acc, [type]: total }), {});
            setTodayTotals(totalsMap);
          }}
        />
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Упражнения</h2>
          <div className="flex gap-2">
            <button
              disabled={creating}
              onClick={createBaseExercises}
              className="px-3 py-2 rounded bg-black text-white disabled:opacity-60"
            >
              {creating ? "Создание..." : "Создать базовые (3)"}
            </button>
          </div>
        </div>
        {exercises.length === 0 ? (
          <p className="text-sm text-gray-500">Пока нет упражнений</p>
        ) : (
          <ul className="divide-y border rounded">
            {exercises.map((e) => (
              <li key={e.id} className="p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{e.type}</div>
                  <div className="text-sm text-gray-600">цель: {todayTotals[e.type] || 0}/{e.goal}</div>
                </div>
                <MiniChart exerciseId={e.id} refreshTrigger={refreshTrigger} />
                <QuickButtons 
                  exerciseId={e.id} 
                  onAdded={() => setRefreshTrigger(prev => prev + 1)}
                  todayTotal={todayTotals[e.type] || 0}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
