import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function HeaderSkeleton({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-950/80 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Fitchain</div>
          <h1 className="mt-1 text-lg font-semibold text-zinc-50">{title}</h1>
        </div>
      </div>
    </header>
  );
}

function BottomTabsSkeleton() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/92 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-1.5">
        <Skeleton className="h-16 rounded-[1.2rem]" />
        <Skeleton className="h-16 rounded-[1.2rem]" />
        <Skeleton className="h-16 rounded-[1.2rem]" />
      </div>
    </div>
  );
}

function HomeCarouselSkeleton() {
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-2 rounded-full border border-zinc-900 bg-zinc-950/80 p-1">
        <Skeleton className="h-10 rounded-full" />
        <Skeleton className="h-10 rounded-full" />
      </div>

      <Skeleton className="h-[34rem] w-full rounded-[2rem]" />

      <div className="flex items-center justify-center gap-2">
        <Skeleton className="size-2 rounded-full" />
        <Skeleton className="size-2 rounded-full" />
        <Skeleton className="size-2 rounded-full" />
      </div>
    </section>
  );
}

function StatsSectionSkeleton() {
  return (
    <section className="space-y-3">
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-40" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-28 rounded-3xl" />
        <Skeleton className="h-28 rounded-3xl" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24 rounded-3xl" />
        <Skeleton className="h-24 rounded-3xl" />
      </div>
    </section>
  );
}

export function HomePageSkeleton() {
  return (
    <>
      <HeaderSkeleton title="Тренировка" />
      <HomePageBodySkeleton />
      <BottomTabsSkeleton />
    </>
  );
}

export function HomePageBodySkeleton() {
  return (
    <main className="app-screen">
      <div className="screen-stack screen-stack--spacious">
        <HomeCarouselSkeleton />
      </div>
    </main>
  );
}

export function DashboardPageSkeleton() {
  return (
    <>
      <HeaderSkeleton title="Моя статистика" />
      <DashboardPageBodySkeleton />
      <BottomTabsSkeleton />
    </>
  );
}

export function DashboardPageBodySkeleton() {
  return (
    <main className="app-screen">
      <div className="screen-stack screen-stack--spacious">
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-24 rounded-3xl" />
          <Skeleton className="h-24 rounded-3xl" />
        </div>
        <StatsSectionSkeleton />
        <StatsSectionSkeleton />
      </div>
    </main>
  );
}

export function ProfilePageSkeleton() {
  return (
    <>
      <HeaderSkeleton title="Профиль" />
      <ProfilePageBodySkeleton />
      <BottomTabsSkeleton />
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
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-16 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 rounded-2xl" />
            </div>
            <Skeleton className="h-10 rounded-2xl" />
            <Skeleton className="h-10 rounded-2xl" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export function AuthPageSkeleton() {
  return (
    <>
      <HeaderSkeleton title="Авторизация" />
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
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 rounded-2xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 rounded-2xl" />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Skeleton className="h-10 rounded-2xl" />
              <Skeleton className="h-10 rounded-2xl" />
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
      <HeaderSkeleton title="Лаборатория анимаций" />
      <AnimationLabPageBodySkeleton />
    </>
  );
}

export function AnimationLabPageBodySkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
      <Skeleton className="h-[34rem] rounded-[2rem]" />
    </main>
  );
}
