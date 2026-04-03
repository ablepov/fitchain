import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AuthPageClient } from "@/app/auth/AuthPageClient";
import { getQueryClient } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { getSessionSnapshot } from "@/lib/sessionData";

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

export async function AuthPageContent({
  searchParams,
}: {
  searchParams?: SearchParamsInput;
}) {
  const queryClient = getQueryClient();
  const [session, params] = await Promise.all([getSessionSnapshot(), resolveSearchParams(searchParams)]);
  const error = getSingleSearchParam(params.error);
  const message = getSingleSearchParam(params.message);

  queryClient.setQueryData(queryKeys.session, session);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuthPageClient error={error} message={message} />
    </HydrationBoundary>
  );
}
