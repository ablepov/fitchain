"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { signOutAction } from "@/app/auth/actions";
import { saveTimezone } from "@/lib/apiClient";
import { applyTimezoneToCaches, restoreTrainingOverviewCaches, snapshotTrainingOverviewCaches } from "@/lib/cacheUpdates";
import { profileSnapshotQueryOptions } from "@/lib/queryOptions";
import { queryKeys } from "@/lib/queryKeys";
import type { ProfilePageData } from "@/lib/trainingTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

const timezones = ["Europe/Moscow", "UTC", "Europe/Berlin", "America/New_York", "Asia/Tokyo"];

export function ProfilePageClient() {
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(profileSnapshotQueryOptions());
  const [timezone, setTimezone] = useState(data.timezone);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setTimezone(data.timezone);
  }, [data.timezone]);

  const timezoneMutation = useMutation({
    mutationFn: saveTimezone,
    onMutate: async (nextTimezone) => {
      setMessage(null);
      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.trainingOverviewRoot }),
        queryClient.cancelQueries({ queryKey: queryKeys.trainingStats }),
        queryClient.cancelQueries({ queryKey: queryKeys.weeklyPlan }),
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
      setMessage("Часовой пояс сохранён");
    },
  });

  return (
    <main className="app-screen">
      <div className="screen-stack">
        <Card>
          <CardHeader>
            <CardTitle>Аккаунт</CardTitle>
            <CardDescription>Базовые настройки профиля и рабочая таймзона приложения.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.email ? (
              <div className="rounded-2xl border border-zinc-900 bg-black/70 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Email</div>
                <div className="mt-2 text-sm text-zinc-200">{data.email}</div>
              </div>
            ) : null}

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300" htmlFor="profile-timezone">
                Часовой пояс
              </label>
              <Select id="profile-timezone" value={timezone} onChange={(event) => setTimezone(event.target.value)}>
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </Select>
            </div>

            {message ? (
              <div
                className={`rounded-2xl border px-3 py-2 text-sm ${
                  message.startsWith("Ошибка")
                    ? "border-red-950/80 bg-zinc-950 text-red-200"
                    : "border-zinc-900 bg-zinc-950 text-zinc-300"
                }`}
              >
                {message}
              </div>
            ) : null}

            <Button
              disabled={timezoneMutation.isPending}
              className="w-full rounded-2xl"
              onClick={() => void timezoneMutation.mutateAsync(timezone)}
            >
              {timezoneMutation.isPending ? "Сохранение..." : "Сохранить таймзону"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Сессия</CardTitle>
            <CardDescription>Выход из текущего аккаунта на этом устройстве.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={signOutAction}>
              <Button variant="secondary" className="w-full rounded-2xl" type="submit">
                Выйти
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
