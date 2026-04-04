import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DashboardPageClient } from "@/app/dashboard/DashboardPageClient";
import { getQueryClient } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { getSessionSnapshot } from "@/lib/sessionData";
import { getTrainingStats } from "@/lib/trainingData";

export async function DashboardPageContent() {
  const queryClient = getQueryClient();
  const [session, stats] = await Promise.all([getSessionSnapshot(), getTrainingStats()]);

  queryClient.setQueryData(queryKeys.session, session);
  queryClient.setQueryData(queryKeys.trainingStats, stats);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardPageClient />
    </HydrationBoundary>
  );
}
