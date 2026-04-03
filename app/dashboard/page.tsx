import { Suspense } from "react";
import { DashboardPageContent } from "@/app/dashboard/DashboardPageContent";
import { DashboardPageSkeleton } from "@/components/PageSkeletons";

type SearchParamsInput =
  | Promise<Record<string, string | string[] | undefined>>
  | Record<string, string | string[] | undefined>
  | undefined;

export default function DashboardPage({
  searchParams,
}: {
  searchParams?: SearchParamsInput;
}) {
  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <DashboardPageContent searchParams={searchParams} />
    </Suspense>
  );
}
