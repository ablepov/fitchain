"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { QuickButtons } from "@/components/QuickButtons";
import { MiniChart } from "@/components/MiniChart";
import { SummaryPanel } from "@/components/SummaryPanel";
import { Header } from "@/components/Header";



type Exercise = {
  id: string;
  type: 'pullups' | 'pushups' | 'squats';
  goal: number;
};

function formatLastSetTime(isoString: string | null): string {
  if (!isoString) return 'Нет подходов';

  const date = new Date(isoString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Только что';
  if (diffInMinutes < 60) return `${diffInMinutes} мин назад`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ч назад`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} д назад`;
}

export default function Home() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [todayTotals, setTodayTotals] = useState<Record<string, number>>({});
  const [lastSetTimes, setLastSetTimes] = useState<Record<string, string | null>>({});

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






  return (
    <>
      <Header title="Упражнения" />
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

                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-500">
                      Последний подход: {formatLastSetTime(lastSetTimes[e.id] || null)}
                    </div>
                  </div>

                  <div className="mb-3">
                    <MiniChart
                      exerciseId={e.id}
                      refreshTrigger={refreshTrigger}
                      onLastSetTime={(time) => setLastSetTimes(prev => ({ ...prev, [e.id]: time }))}
                    />
                  </div>

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
    </>
  );
}
