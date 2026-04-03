import { saveDashboardTimezoneAction } from "@/app/dashboard/actions";
import { Header } from "@/components/Header";
import { SummaryPanel } from "@/components/SummaryPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { getTrainingOverview } from "@/lib/trainingData";

const timezones = ["Europe/Moscow", "UTC", "Europe/Berlin", "America/New_York", "Asia/Tokyo"];

type SearchParamsInput =
  | Promise<Record<string, string | string[] | undefined>>
  | Record<string, string | string[] | undefined>
  | undefined;

async function resolveSearchParams(searchParams: SearchParamsInput) {
  return searchParams ? await searchParams : {};
}

function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: SearchParamsInput;
}) {
  const [overview, params] = await Promise.all([
    getTrainingOverview({ includeRecentHistory: false }),
    resolveSearchParams(searchParams),
  ]);

  const message = getSingleSearchParam(params.message);
  const error = getSingleSearchParam(params.error);

  return (
    <>
      <Header currentPath="/dashboard" title="Дашборд" userEmail={overview.email} />
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

              <form action={saveDashboardTimezoneAction} className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300" htmlFor="timezone">
                    Часовой пояс
                  </label>
                  <Select id="timezone" name="timezone" defaultValue={overview.timezone}>
                    {timezones.map((timezone) => (
                      <option key={timezone} value={timezone}>
                        {timezone}
                      </option>
                    ))}
                  </Select>
                </div>

                <Button className="rounded-2xl" type="submit">
                  Сохранить
                </Button>
              </form>

              {message ? (
                <div className="rounded-2xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-sm text-zinc-400">
                  {message}
                </div>
              ) : null}

              {error ? (
                <div className="rounded-2xl border border-red-950/80 bg-zinc-950 px-3 py-2 text-sm text-red-200">
                  {error}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <SummaryPanel timezone={overview.timezone} summary={overview.summary} total={overview.total} />
        </div>
      </main>
    </>
  );
}
