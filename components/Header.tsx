"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const navItems = [
  { href: "/", label: "Главная" },
  { href: "/dashboard", label: "Дашборд" },
  { href: "/animation-lab", label: "Лаб" },
  { href: "/profile", label: "Профиль" },
];

export function Header({ title, showBackButton = false }: HeaderProps) {
  const [user, setUser] = useState<{ email?: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
      setLoading(false);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-950/90 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button
              size="icon"
              variant="outline"
              className="size-10 rounded-full"
              onClick={() => router.back()}
              aria-label="Назад"
            >
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} />
              </svg>
            </Button>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">Fitchain</span>
              <Badge className="border-zinc-900 bg-zinc-950 text-zinc-500">mobile</Badge>
            </div>
            {title ? (
              <h1 className="mt-1 text-lg font-semibold text-zinc-50">{title}</h1>
            ) : (
              <p className="mt-1 text-sm text-zinc-500">Компактный трекер тренировок</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {loading ? (
              <div className="h-10 w-20 animate-pulse rounded-full border border-zinc-900 bg-zinc-950" />
            ) : user ? (
              <>
                <div className="hidden max-w-40 truncate text-right text-xs text-zinc-500 sm:block">
                  {user.email}
                </div>
                <Button variant="secondary" size="sm" className="rounded-full" onClick={handleSignOut}>
                  Выйти
                </Button>
              </>
            ) : (
              <Button variant="secondary" size="sm" className="rounded-full" onClick={() => router.push("/auth")}>
                Войти
              </Button>
            )}
          </div>
        </div>

        <nav
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
          aria-label="Основная навигация"
        >
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  "rounded-2xl border px-3 py-3 text-sm font-medium transition-colors",
                  active
                    ? "border-zinc-700 bg-zinc-100 text-black"
                    : "border-zinc-900 bg-zinc-950 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
