"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { SummaryPanel } from "@/components/SummaryPanel";
import { Header } from "@/components/Header";

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

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        router.replace("/auth");
        return;
      }
      setEmail(user.email ?? null);
      // загрузим профиль
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
    const { error } = await supabase
      .from("profiles")
      .upsert({ user_id: userId, timezone });
    setSavingTz(false);
    setMessage(error ? `Ошибка: ${error.message}` : "Таймзона сохранена");
  }



  if (loading) {
    return (
      <main className="p-6">
        <p className="text-sm text-gray-500">Загрузка...</p>
      </main>
    );
  }

  return (
    <>
      <Header title="Dashboard" />
      <main className="p-6 space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {email && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600" aria-label="Email пользователя">{email}</span>
              <button className="px-3 py-2 rounded border" onClick={onSignOut}>Выйти</button>
            </div>
          )}
        </div>

        <section>
          <h2 className="font-medium">Часовой пояс</h2>
          <div className="mt-2 flex gap-2 items-center">
            <select
              className="border rounded px-3 py-2"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
            <button
              disabled={savingTz}
              className="px-3 py-2 rounded bg-black text-white disabled:opacity-60"
              onClick={onSaveTimezone}
            >
              {savingTz ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
          {message && <p className="text-sm mt-2 text-gray-600">{message}</p>}
        </section>

        <SummaryPanel />
      </main>
    </>
  );
}
