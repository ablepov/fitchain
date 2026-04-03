import { Suspense } from "react";
import { DashboardPageContent } from "@/app/dashboard/DashboardPageContent";
import { Header } from "@/components/Header";
import { DashboardPageBodySkeleton } from "@/components/PageSkeletons";
import { requireSessionSnapshot } from "@/lib/sessionData";

export default async function DashboardPage() {
  const session = await requireSessionSnapshot();

  return (
    <>
      <Header currentPath="/dashboard" title="Дашборд" userEmail={session.email} />
      <Suspense fallback={<DashboardPageBodySkeleton />}>
        <DashboardPageContent />
      </Suspense>
    </>
  );
}
