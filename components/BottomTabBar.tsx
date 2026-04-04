"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/",
    label: "Главная",
    icon: Home,
    match: (pathname: string) => pathname === "/",
  },
  {
    href: "/stats",
    label: "Статистика",
    icon: BarChart3,
    match: (pathname: string) => pathname === "/stats" || pathname === "/dashboard",
  },
  {
    href: "/profile",
    label: "Профиль",
    icon: UserRound,
    match: (pathname: string) => pathname === "/profile",
  },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Основная навигация"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/92 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl"
    >
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-1.5 shadow-[0_-18px_60px_-36px_rgba(0,0,0,0.95)]">
        {navItems.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1 rounded-[1.2rem] px-2 py-2 text-[11px] font-medium transition-colors",
                active ? "bg-zinc-100 text-black" : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="size-4" strokeWidth={2.2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
