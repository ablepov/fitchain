"use client";

import { Activity, CalendarDays, Dumbbell, Flame, Trophy } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { trainingStatsQueryOptions } from "@/lib/queryOptions";
import type { TrainingStatsPeriod } from "@/lib/trainingTypes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PeriodKey = "today" | "week" | "month" | "all";

const periodSections: Array<{
  key: PeriodKey;
  title: string;
  description: string;
}> = [
  {
    key: "today",
    title: "Сегодня",
    description: "Что уже сделали за текущие сутки в выбранной таймзоне.",
  },
  {
    key: "week",
    title: "Неделя",
    description: "Текущая неделя как основной ритм и частота тренировок.",
  },
  {
    key: "month",
    title: "Месяц",
    description: "Длиннее дистанция, чтобы видеть стабильность и нагрузку.",
  },
  {
    key: "all",
    title: "Все время",
    description: "Общий объем и накопленный результат по всему аккаунту.",
  },
];

function StatTile({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <Card
      className={`rounded-[1.75rem] border ${
        accent
          ? "border-cyan-400/20 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.16),transparent_42%),linear-gradient(180deg,rgba(9,14,18,0.98),rgba(5,8,12,1))]"
          : "border-zinc-900 bg-zinc-950/80"
      }`}
    >
      <CardContent className="space-y-2 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">{label}</div>
        <div className="text-3xl font-semibold tracking-tight text-zinc-50">{value}</div>
        <p className="text-sm leading-6 text-zinc-400">{hint}</p>
      </CardContent>
    </Card>
  );
}

function formatTopExercise(period: TrainingStatsPeriod) {
  if (!period.topExercise) {
    return "Пока нет лидера";
  }

  return `${period.topExercise.type} · ${period.topExercise.total}`;
}

function StatsSection({
  title,
  description,
  period,
}: {
  title: string;
  description: string;
  period: TrainingStatsPeriod;
}) {
  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">{title}</h2>
        <p className="text-sm leading-6 text-zinc-400">{description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <StatTile
          label="Всего повторений"
          value={String(period.totalReps)}
          hint="Главная метрика периода. Показывает реальный объем, а не просто присутствие."
          accent
        />
        <StatTile
          label="Подходов"
          value={String(period.totalSets)}
          hint="Сколько отдельных логов вы уже зафиксировали в этом интервале."
        />
        <StatTile
          label="Активных дней"
          value={String(period.activeDays)}
          hint="Сколько разных дней в периоде были не пустыми."
        />
        <StatTile
          label="Активных упражнений"
          value={String(period.exerciseCount)}
          hint="Сколько разных карточек реально участвовали в работе."
        />
      </div>

      <Card className="rounded-[1.75rem] border-zinc-900 bg-zinc-950/80">
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Лидер периода</div>
            <div className="text-lg font-semibold text-zinc-50">{formatTopExercise(period)}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-zinc-100">
            <Trophy className="size-5" />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export function DashboardPageClient() {
  const { data } = useSuspenseQuery(trainingStatsQueryOptions());

  const bestDayValue = data.highlights.bestDay
    ? `${data.highlights.bestDay.date} · ${data.highlights.bestDay.total}`
    : "Пока нет данных";

  const highlights = [
    {
      label: "Текущий стрик",
      value: `${data.highlights.currentStreakDays}`,
      hint: "дней подряд с активностью",
      icon: Flame,
    },
    {
      label: "Лучший день",
      value: bestDayValue,
      hint: "день с максимальным количеством повторений",
      icon: Trophy,
    },
    {
      label: "Всего упражнений",
      value: `${data.highlights.totalExercises}`,
      hint: "карточек доступно в системе",
      icon: Dumbbell,
    },
    {
      label: "План на неделю",
      value: `${data.highlights.scheduledThisWeek}`,
      hint: "назначений в recurring-плане",
      icon: CalendarDays,
    },
  ];

  return (
    <main className="app-screen">
      <div className="screen-stack screen-stack--spacious">
        <section className="space-y-3">
          <Card className="rounded-[2rem] border-zinc-900 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_34%),linear-gradient(180deg,rgba(17,17,17,0.96),rgba(5,5,6,1))]">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-2xl tracking-tight text-zinc-50">Сводка по вашему ритму</CardTitle>
                  <CardDescription className="mt-1 text-zinc-400">
                    Экран для понимания динамики, а не для логгинга. Все главные сигналы собраны по периодам.
                  </CardDescription>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-zinc-100">
                  <Activity className="size-5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {highlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                          {item.label}
                        </div>
                        <Icon className="size-4 text-zinc-200" />
                      </div>
                      <div className="text-lg font-semibold tracking-tight text-zinc-50">{item.value}</div>
                      <div className="mt-1 text-sm leading-6 text-zinc-400">{item.hint}</div>
                    </div>
                  );
                })}
              </div>
            </CardHeader>
          </Card>
        </section>

        {periodSections.map((section) => (
          <StatsSection
            key={section.key}
            title={section.title}
            description={section.description}
            period={data.periods[section.key]}
          />
        ))}
      </div>
    </main>
  );
}
