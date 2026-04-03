"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { QuickButtons } from "@/components/QuickButtons";
import { MiniChart } from "@/components/MiniChart";
import { SummaryPanel } from "@/components/SummaryPanel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTimeFromNow } from "@/lib/date";
import { DEFAULT_RECENT_LIMIT } from "@/lib/queryKeys";
import { trainingOverviewQueryOptions } from "@/lib/queryOptions";

export function HomePageClient() {
  const { data: overview } = useSuspenseQuery(
    trainingOverviewQueryOptions({
      includeRecentHistory: true,
      recentLimit: DEFAULT_RECENT_LIMIT,
    })
  );

  return (
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
                <div className="mt-2 text-2xl font-semibold text-zinc-50">{overview.exercises.length}</div>
              </div>
              <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-3">
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Активность</div>
                <div className="mt-2 text-sm font-medium text-zinc-300">{overview.total} повторений</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <SummaryPanel timezone={overview.timezone} summary={overview.summary} total={overview.total} />

        <section className="space-y-3">
          {overview.exercises.length === 0 ? (
            <Card>
              <CardContent className="pt-4 text-sm text-zinc-500">Пока нет упражнений</CardContent>
            </Card>
          ) : (
            overview.exercises.map((exercise) => {
              const completion =
                exercise.goal > 0 ? Math.min(100, Math.round((exercise.todayTotal / exercise.goal) * 100)) : 0;

              return (
                <Card key={exercise.id}>
                  <CardHeader className="gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="capitalize">{exercise.type}</CardTitle>
                        <p className="mt-1 text-sm text-zinc-500">
                          Последний подход: {formatRelativeTimeFromNow(exercise.lastSetTime)}
                        </p>
                      </div>
                      <Badge>{completion}%</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-zinc-500">
                        <span>Цель</span>
                        <span>
                          {exercise.todayTotal}/{exercise.goal}
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
                    <MiniChart reps={exercise.recentReps} />
                    <QuickButtons
                      exerciseId={exercise.id}
                      lastReps={exercise.recentReps}
                      todayTotal={exercise.todayTotal}
                    />
                  </CardContent>
                </Card>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
