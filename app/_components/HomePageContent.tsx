import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { HomePageClient } from "@/app/_components/HomePageClient";
import { getQueryClient } from "@/lib/queryClient";
import { DEFAULT_RECENT_LIMIT, queryKeys } from "@/lib/queryKeys";
import { getSessionSnapshot } from "@/lib/sessionData";
import { getTrainingOverview } from "@/lib/trainingData";

export async function HomePageContent() {
  const queryClient = getQueryClient();
  const [session, overview] = await Promise.all([
    getSessionSnapshot(),
    getTrainingOverview({
      includeRecentHistory: true,
      recentLimit: DEFAULT_RECENT_LIMIT,
    }),
  ]);

  queryClient.setQueryData(queryKeys.session, session);
  queryClient.setQueryData(queryKeys.trainingOverview(true, DEFAULT_RECENT_LIMIT), overview);

  return <HydrationBoundary state={dehydrate(queryClient)}><HomePageClient /></HydrationBoundary>;
}
