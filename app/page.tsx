"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { QuickButtons } from "@/components/QuickButtons";
import { MiniChart } from "@/components/MiniChart";
import { SummaryPanel } from "@/components/SummaryPanel";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Exercise = {
  id: string;
  type: "pullups" | "pushups" | "squats";
  goal: number;
};

function formatLastSetTime(isoString: string | null): string {
  if (!isoString) return "Нет подходов";

  const date = new Date(isoString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return "Только что";
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

      const { data: ex } = await supabase
        .from("exercises")
        .select("id,type,goal")
        .order("created_at", { ascending: true });
      setExercises(ex ?? []);
    })();
  }, []);

  return (
    <>
      <Header title="Тренировка" />
      <main className="app-screen">
        <div className="screen-stack">
          <Card>
            <CardHeader className="gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>Сегодняшний темп</CardTitle>
                  <p className="mt-1 text-sm text-zinc-500">
                    Быстрый доступ к подходам и текущему прогрессу по целям
                  </p>
                </div>
                <Badge className="border-zinc-700 bg-zinc-100 text-black">live</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-zinc-900 bg-black p-3">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Упражнений</div>
                  <div className="mt-2 text-2xl font-semibold text-zinc-50">{exercises.length}</div>
                </div>
                <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-3">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Активность</div>
                  <div className="mt-2 text-sm font-medium text-zinc-300">
                    {Object.values(todayTotals).reduce((acc, value) => acc + value, 0)} повторений
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <SummaryPanel
            refreshTrigger={refreshTrigger}
            onTotalsChange={(totals) => {
              const totalsMap = totals.reduce<Record<string, number>>(
                (acc, item) => ({ ...acc, [item.type]: item.total }),
                {}
              );
              setTodayTotals(totalsMap);
            }}
          />

          <section className="space-y-3">
            {exercises.length === 0 ? (
              <Card>
                <CardContent className="pt-4 text-sm text-zinc-500">Пока нет упражнений</CardContent>
              </Card>
            ) : (
              exercises.map((exercise) => {
                const progress = todayTotals[exercise.type] || 0;
                const completion = exercise.goal > 0 ? Math.min(100, Math.round((progress / exercise.goal) * 100)) : 0;

                return (
                  <Card key={exercise.id}>
                    <CardHeader className="gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="capitalize">{exercise.type}</CardTitle>
                          <p className="mt-1 text-sm text-zinc-500">
                            Последний подход: {formatLastSetTime(lastSetTimes[exercise.id] || null)}
                          </p>
                        </div>
                        <Badge>{completion}%</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-zinc-500">
                          <span>Цель</span>
                          <span>
                            {progress}/{exercise.goal}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-zinc-900">
                          <div
                            className="h-full rounded-full bg-zinc-100 transition-[width] duration-300"
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <MiniChart
                        exerciseId={exercise.id}
                        refreshTrigger={refreshTrigger}
                        onLastSetTime={(time) =>
                          setLastSetTimes((prev) => ({
                            ...prev,
                            [exercise.id]: time,
                          }))
                        }
                      />

                      <QuickButtons
                        exerciseId={exercise.id}
                        onAdded={() => setRefreshTrigger((prev) => prev + 1)}
                        todayTotal={progress}
                      />
                    </CardContent>
                  </Card>
                );
              })
            )}
          </section>
        </div>
      </main>
    </>
  );
}
