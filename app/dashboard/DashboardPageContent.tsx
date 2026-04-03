import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DashboardPageClient } from "@/app/dashboard/DashboardPageClient";
import { getQueryClient } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { getSessionSnapshot } from "@/lib/sessionData";
import { getTrainingOverview } from "@/lib/trainingData";
 
export async function DashboardPageContent() {
  const queryClient = getQueryClient();
  const [session, overview] = await Promise.all([
    getSessionSnapshot(),
    getTrainingOverview({ includeRecentHistory: false }),
  ]);

  queryClient.setQueryData(queryKeys.session, session);
  queryClient.setQueryData(queryKeys.trainingOverview(false), overview);

  return <HydrationBoundary state={dehydrate(queryClient)}><DashboardPageClient /></HydrationBoundary>;
}
