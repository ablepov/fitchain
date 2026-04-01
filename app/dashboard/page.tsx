"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { SummaryPanel } from "@/components/SummaryPanel";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

const timezones = [
  "Europe/Moscow",
  "UTC",
  "Europe/Berlin",
  "America/New_York",
  "Asia/Tokyo",
];

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string>("Europe/Moscow");
  const [savingTz, setSavingTz] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        router.replace("/auth");
        return;
      }
      setEmail(user.email ?? null);

      const { data: profile } = await supabase
        .from("profiles")
        .select("timezone")
        .eq("user_id", user.id)
        .maybeSingle();
      if (profile?.timezone) setTimezone(profile.timezone);

      setLoading(false);
    })();
  }, [router]);

  async function onSignOut() {
    await supabase.auth.signOut();
    router.replace("/auth");
  }

  async function onSaveTimezone() {
    setSavingTz(true);
    setMessage(null);
    const { data: me } = await supabase.auth.getUser();
    const userId = me.user?.id;
    if (!userId) return;
    const { error } = await supabase.from("profiles").upsert({ user_id: userId, timezone });
    setSavingTz(false);
    setMessage(error ? `Ошибка: ${error.message}` : "Таймзона сохранена");
  }

  if (loading) {
    return (
      <main className="app-screen">
        <p className="text-sm text-zinc-500">Загрузка...</p>
      </main>
    );
  }

  return (
    <>
      <Header title="Дашборд" />
      <main className="app-screen">
        <div className="screen-stack">
          <Card>
            <CardHeader>
              <CardTitle>Аккаунт</CardTitle>
              <CardDescription>Базовые настройки профиля и текущая рабочая зона.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {email && (
                <div className="rounded-2xl border border-zinc-900 bg-black/70 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Email</div>
                  <div className="mt-2 text-sm text-zinc-200">{email}</div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300" htmlFor="timezone">
                    Часовой пояс
                  </label>
                  <Select id="timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button disabled={savingTz} className="rounded-2xl" onClick={onSaveTimezone}>
                    {savingTz ? "Сохранение..." : "Сохранить"}
                  </Button>
                  <Button variant="secondary" className="rounded-2xl" onClick={onSignOut}>
                    Выйти
                  </Button>
                </div>
              </div>

              {message && (
                <div className="rounded-2xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-sm text-zinc-400">
                  {message}
                </div>
              )}
            </CardContent>
          </Card>

          <SummaryPanel timezone={timezone} />
        </div>
      </main>
    </>
  );
}
