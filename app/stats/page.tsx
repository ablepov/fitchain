import { Suspense } from "react";
import { DashboardPageContent } from "@/app/dashboard/DashboardPageContent";
import { AppShell } from "@/components/AppShell";
import { DashboardPageBodySkeleton } from "@/components/PageSkeletons";

export default async function StatsPage() {
  return (
    <AppShell title="Моя статистика">
      <Suspense fallback={<DashboardPageBodySkeleton />}>
        <DashboardPageContent />
      </Suspense>
    </AppShell>
  );
}
