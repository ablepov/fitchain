import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const navItems = [
  { href: "/", label: "Главная" },
  { href: "/dashboard", label: "Дашборд" },
  { href: "/animation-lab", label: "Лаб" },
  { href: "/profile", label: "Профиль" },
];

function HeaderSkeleton({
  currentPath,
  title,
}: {
  currentPath: string;
  title: string;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-950/90 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">Fitchain</span>
              <div className="rounded-full border border-zinc-900 bg-zinc-950 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                mobile
              </div>
            </div>
            <h1 className="mt-1 text-lg font-semibold text-zinc-50">{title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="hidden h-4 w-28 rounded-full sm:block" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </div>

        <nav
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
          aria-label="Основная навигация"
        >
          {navItems.map((item) => {
            const active = currentPath === item.href;

            return (
              <div
                key={item.href}
                className={
                  active
                    ? "rounded-2xl border border-zinc-700 bg-zinc-100 px-3 py-3 text-center text-sm font-medium text-black"
                    : "rounded-2xl border border-zinc-900 bg-zinc-950 px-3 py-3 text-center text-sm font-medium text-zinc-400"
                }
              >
                {item.label}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function SummaryPanelSkeleton() {
  return (
    <Card aria-hidden="true" className="overflow-hidden">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-52" />
          </div>
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-px w-full rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </CardContent>
    </Card>
  );
}

function ExerciseCardSkeleton() {
  return (
    <Card aria-hidden="true">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-10 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-2xl" />
        </div>
      </CardContent>
    </Card>
  );
}

export function HomePageSkeleton() {
  return (
    <>
      <HeaderSkeleton currentPath="/" title="Тренировка" />
      <HomePageBodySkeleton />
    </>
  );
}

export function HomePageBodySkeleton() {
  return (
    <main className="app-screen">
      <div className="screen-stack">
        <Card aria-hidden="true">
          <CardHeader className="gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-2xl" />
            </div>
          </CardHeader>
        </Card>

        <SummaryPanelSkeleton />

        <section className="space-y-3">
          <ExerciseCardSkeleton />
          <ExerciseCardSkeleton />
        </section>
      </div>
    </main>
  );
}

export function DashboardPageSkeleton() {
  return (
    <>
      <HeaderSkeleton currentPath="/dashboard" title="Дашборд" />
      <DashboardPageBodySkeleton />
    </>
  );
}

export function DashboardPageBodySkeleton() {
  return (
    <main className="app-screen">
      <div className="screen-stack">
        <Card aria-hidden="true">
          <CardHeader className="gap-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-10 w-full rounded-2xl" />
            <Skeleton className="h-10 w-full rounded-2xl" />
          </CardContent>
        </Card>

        <SummaryPanelSkeleton />
      </div>
    </main>
  );
}

export function ProfilePageSkeleton() {
  return (
    <>
      <HeaderSkeleton currentPath="/profile" title="Профиль" />
      <ProfilePageBodySkeleton />
    </>
  );
}

export function ProfilePageBodySkeleton() {
  return (
    <main className="app-screen">
      <div className="screen-stack">
        <Card aria-hidden="true">
          <CardHeader className="gap-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-10 w-full rounded-2xl" />
          </CardContent>
        </Card>

        <Card aria-hidden="true">
          <CardHeader className="gap-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export function AuthPageSkeleton() {
  return (
    <>
      <HeaderSkeleton currentPath="/auth" title="Авторизация" />
      <AuthPageBodySkeleton />
    </>
  );
}

export function AuthPageBodySkeleton() {
  return (
    <main className="app-screen">
      <div className="screen-stack">
        <Card aria-hidden="true">
          <CardHeader className="gap-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-2xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-2xl" />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Skeleton className="h-10 w-full rounded-2xl" />
              <Skeleton className="h-10 w-full rounded-2xl" />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export function AnimationLabPageSkeleton() {
  return (
    <>
      <HeaderSkeleton currentPath="/animation-lab" title="Лаборатория анимаций" />
      <AnimationLabPageBodySkeleton />
    </>
  );
}

export function AnimationLabPageBodySkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
      <div className="space-y-4">
        <Skeleton className="h-72 w-full rounded-[2rem]" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-56 w-full rounded-[2rem]" />
          <Skeleton className="h-56 w-full rounded-[2rem]" />
        </div>
      </div>
    </main>
  );
}
