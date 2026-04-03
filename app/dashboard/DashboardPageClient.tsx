"use client";

import { useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { saveTimezone } from "@/lib/apiClient";
import { applyTimezoneToCaches, restoreTrainingOverviewCaches, snapshotTrainingOverviewCaches } from "@/lib/cacheUpdates";
import { queryKeys } from "@/lib/queryKeys";
import { trainingOverviewQueryOptions } from "@/lib/queryOptions";
import type { ProfilePageData } from "@/lib/trainingData";
import { SummaryPanel } from "@/components/SummaryPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

const timezones = ["Europe/Moscow", "UTC", "Europe/Berlin", "America/New_York", "Asia/Tokyo"];

export function DashboardPageClient() {
  const queryClient = useQueryClient();
  const { data: overview } = useSuspenseQuery(
    trainingOverviewQueryOptions({
      includeRecentHistory: false,
    })
  );
  const [timezone, setTimezone] = useState(overview.timezone);
  const [message, setMessage] = useState<string | null>(null);

  const timezoneMutation = useMutation({
    mutationFn: saveTimezone,
    onMutate: async (nextTimezone) => {
      setMessage(null);
      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.trainingOverviewRoot }),
        queryClient.cancelQueries({ queryKey: queryKeys.profileSnapshot }),
      ]);

      const previousProfile = queryClient.getQueryData<ProfilePageData>(queryKeys.profileSnapshot);
      const previousOverviews = snapshotTrainingOverviewCaches(queryClient);

      applyTimezoneToCaches(queryClient, nextTimezone);

      return {
        previousProfile,
        previousOverviews,
      };
    },
    onError: (error, _variables, context) => {
      if (context) {
        restoreTrainingOverviewCaches(queryClient, context.previousOverviews);
        queryClient.setQueryData(queryKeys.profileSnapshot, context.previousProfile);
      }

      setMessage(`Ошибка: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`);
    },
    onSuccess: ({ timezone: savedTimezone }) => {
      setTimezone(savedTimezone);
      applyTimezoneToCaches(queryClient, savedTimezone);
      setMessage("Таймзона сохранена");
    },
  });

  return (
    <main className="app-screen">
      <div className="screen-stack">
        <Card>
          <CardHeader>
            <CardTitle>Аккаунт</CardTitle>
            <CardDescription>Базовые настройки профиля и текущая рабочая зона.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {overview.email ? (
              <div className="rounded-2xl border border-zinc-900 bg-black/70 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Email</div>
                <div className="mt-2 text-sm text-zinc-200">{overview.email}</div>
              </div>
            ) : null}

            <form
              className="grid grid-cols-1 gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                void timezoneMutation.mutateAsync(timezone);
              }}
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300" htmlFor="timezone">
                  Часовой пояс
                </label>
                <Select
                  id="timezone"
                  name="timezone"
                  value={timezone}
                  onChange={(event) => setTimezone(event.target.value)}
                >
                  {timezones.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              </div>

              <Button className="rounded-2xl" type="submit" disabled={timezoneMutation.isPending}>
                {timezoneMutation.isPending ? "Сохранение..." : "Сохранить"}
              </Button>
            </form>

            {message ? (
              <div
                className={`rounded-2xl border px-3 py-2 text-sm ${
                  message.startsWith("Ошибка")
                    ? "border-red-950/80 bg-zinc-950 text-red-200"
                    : "border-zinc-900 bg-zinc-950 text-zinc-400"
                }`}
              >
                {message}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <SummaryPanel timezone={overview.timezone} summary={overview.summary} total={overview.total} />
      </div>
    </main>
  );
}
