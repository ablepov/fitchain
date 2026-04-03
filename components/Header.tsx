import Link from "next/link";
import { signOutAction } from "@/app/auth/actions";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  currentPath: string;
  title?: string;
  showBackButton?: boolean;
  userEmail?: string | null;
}

const navItems = [
  { href: "/", label: "Р“Р»Р°РІРЅР°СЏ" },
  { href: "/dashboard", label: "Р”Р°С€Р±РѕСЂРґ" },
  { href: "/animation-lab", label: "Р›Р°Р±" },
  { href: "/profile", label: "РџСЂРѕС„РёР»СЊ" },
];

export function Header({ currentPath, title, showBackButton = false, userEmail }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-950/90 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <Button asChild size="icon" variant="outline" className="size-10 rounded-full">
              <Link href="/" aria-label="РќР°Р·Р°Рґ">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} />
                </svg>
              </Link>
            </Button>
          ) : null}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">Fitchain</span>
              <Badge className="border-zinc-900 bg-zinc-950 text-zinc-500">mobile</Badge>
            </div>
            {title ? (
              <h1 className="mt-1 text-lg font-semibold text-zinc-50">{title}</h1>
            ) : (
              <p className="mt-1 text-sm text-zinc-500">РљРѕРјРїР°РєС‚РЅС‹Р№ С‚СЂРµРєРµСЂ С‚СЂРµРЅРёСЂРѕРІРѕРє</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {userEmail ? (
              <>
                <div className="hidden max-w-40 truncate text-right text-xs text-zinc-500 sm:block">{userEmail}</div>
                <form action={signOutAction}>
                  <Button variant="secondary" size="sm" className="rounded-full" type="submit">
                    Р’С‹Р№С‚Рё
                  </Button>
                </form>
              </>
            ) : (
              <Button asChild variant="secondary" size="sm" className="rounded-full">
                <Link href="/auth">Р’РѕР№С‚Рё</Link>
              </Button>
            )}
          </div>
        </div>

        <nav
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
          aria-label="РћСЃРЅРѕРІРЅР°СЏ РЅР°РІРёРіР°С†РёСЏ"
        >
          {navItems.map((item) => {
            const active = currentPath === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-2xl border px-3 py-3 text-center text-sm font-medium transition-colors",
                  active
                    ? "border-zinc-700 bg-zinc-100 text-black"
                    : "border-zinc-900 bg-zinc-950 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
