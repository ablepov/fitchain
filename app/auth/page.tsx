"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAuthed(Boolean(data.user));
    });
  }, []);

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setAuthed(true);
    router.push("/dashboard");
  }

  async function onSignUp() {
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setAuthed(true);
    router.push("/dashboard");
  }

  async function onSignOut() {
    await supabase.auth.signOut();
    setAuthed(false);
  }

  return (
    <>
      <Header title="Авторизация" />
      <main className="app-screen">
        <div className="screen-stack">
          <Card>
            <CardHeader>
              <CardTitle>Доступ к аккаунту</CardTitle>
              <CardDescription>Вход и регистрация без лишних действий, в компактном мобильном формате.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {authed ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-zinc-900 bg-black/70 px-4 py-3 text-sm text-zinc-300">
                    Вы уже вошли. Можно продолжить тренировку или выйти из текущей сессии.
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Button className="w-full rounded-2xl" onClick={() => router.push("/dashboard")}>
                      Открыть дашборд
                    </Button>
                    <Button variant="secondary" className="w-full rounded-2xl" onClick={onSignOut}>
                      Выйти
                    </Button>
                  </div>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={onSignIn}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300" htmlFor="email">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300" htmlFor="password">
                      Пароль
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Введите пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <div className="rounded-2xl border border-red-950/80 bg-zinc-950 px-3 py-2 text-sm text-red-200">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Button disabled={loading} className="w-full rounded-2xl" type="submit">
                      {loading ? "Входим..." : "Войти"}
                    </Button>
                    <Button
                      disabled={loading}
                      variant="secondary"
                      className="w-full rounded-2xl"
                      type="button"
                      onClick={onSignUp}
                    >
                      {loading ? "Регистрация..." : "Зарегистрироваться"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
