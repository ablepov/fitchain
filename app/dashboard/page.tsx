"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { QuickButtons } from "@/components/QuickButtons";
import { SummaryPanel } from "@/components/SummaryPanel";
import { MiniChart } from "@/components/MiniChart";

const timezones = [
  "Europe/Moscow",
  "UTC",
  "Europe/Berlin",
  "America/New_York",
  "Asia/Tokyo",
];

type Exercise = {
  id: string;
  type: 'pullups' | 'pushups' | 'squats';
  goal: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string>("Europe/Moscow");
  const [savingTz, setSavingTz] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [creating, setCreating] = useState(false);
  const [adding, setAdding] = useState(false);
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

      // загрузим упражнения
      const { data: ex } = await supabase
        .from("exercises")
        .select("id,type,goal")
        .order("created_at", { ascending: true });
      setExercises(ex ?? []);

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

  async function addTestSet() {
    if (exercises.length === 0) {
      setMessage("Сначала создайте упражнение");
      return;
    }
    setAdding(true);
    setMessage(null);
    const first = exercises[0];
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    const res = await fetch(`/api/sets`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ exerciseId: first.id, reps: 5, source: 'quickbutton' }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setMessage(`Ошибка API: ${res.status} ${(j.error?.message) || ''}`);
    } else {
      setMessage("Добавлен тестовый подход +5");
    }
    setAdding(false);
  }

  if (loading) {
    return (
      <main className="p-6">
        <p className="text-sm text-gray-500">Загрузка...</p>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6 max-w-2xl mx-auto">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-3">
          {email && <span className="text-sm text-gray-600" aria-label="Email пользователя">{email}</span>}
          <button className="px-3 py-2 rounded border" onClick={onSignOut}>Выйти</button>
        </div>
      </header>

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

      <SummaryPanel timezone={timezone} refreshTrigger={refreshTrigger} />

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
            <button
              disabled={adding}
              onClick={addTestSet}
              className="px-3 py-2 rounded border disabled:opacity-60"
            >
              {adding ? "Добавление..." : "+5 к первому упражнению"}
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
                  <div className="text-sm text-gray-600">цель: {e.goal}</div>
                </div>
                <MiniChart exerciseId={e.id} refreshTrigger={refreshTrigger} />
                <QuickButtons exerciseId={e.id} onAdded={() => setRefreshTrigger(prev => prev + 1)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <p className="text-sm text-gray-500">Здесь появятся быстрые кнопки и график.</p>
      </section>
    </main>
  );
}
