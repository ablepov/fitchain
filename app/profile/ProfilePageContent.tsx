import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProfilePageClient } from "@/app/profile/ProfilePageClient";
import { getQueryClient } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { getSessionSnapshot } from "@/lib/sessionData";
import { getProfilePageData } from "@/lib/trainingData";

export async function ProfilePageContent() {
  const queryClient = getQueryClient();
  const [session, data] = await Promise.all([getSessionSnapshot(), getProfilePageData()]);

  queryClient.setQueryData(queryKeys.session, session);
  queryClient.setQueryData(queryKeys.profileSnapshot, data);

  return <HydrationBoundary state={dehydrate(queryClient)}><ProfilePageClient /></HydrationBoundary>;
}
