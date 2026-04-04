import { Suspense } from "react";
import { HomePageContent } from "@/app/_components/HomePageContent";
import { AppShell } from "@/components/AppShell";
import { HomeModeHeaderControl, normalizeHomeMode } from "@/components/HomeModeHeaderControl";
import { HomePageBodySkeleton } from "@/components/PageSkeletons";

type SearchParamsInput =
  | Promise<Record<string, string | string[] | undefined>>
  | Record<string, string | string[] | undefined>
  | undefined;

async function resolveSearchParams(searchParams: SearchParamsInput) {
  return searchParams ? await searchParams : {};
}

function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: SearchParamsInput;
}) {
  const params = await resolveSearchParams(searchParams);
  const mode = normalizeHomeMode(getSingleSearchParam(params.mode));

  return (
    <AppShell title={<HomeModeHeaderControl mode={mode} />} subtitle="Тренировка">
      <Suspense fallback={<HomePageBodySkeleton />}>
        <HomePageContent />
      </Suspense>
    </AppShell>
  );
}
