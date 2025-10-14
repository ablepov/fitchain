"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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

  async function onSignUp(e: React.FormEvent) {
    e.preventDefault();
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
    <main className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold">Вход</h1>
      {authed ? (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-600">Вы вошли. Перейти к дашборду.</p>
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded bg-black text-white" onClick={() => router.push("/dashboard")}>Dashboard</button>
            <button className="px-3 py-2 rounded border" onClick={onSignOut}>Выйти</button>
          </div>
        </div>
      ) : (
        <form className="mt-4 space-y-3" onSubmit={onSignIn}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button disabled={loading} className="px-3 py-2 rounded bg-black text-white" type="submit">
              {loading ? "Входим..." : "Войти"}
            </button>
            <button disabled={loading} className="px-3 py-2 rounded border" onClick={onSignUp}>
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
