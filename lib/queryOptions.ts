import { queryOptions } from "@tanstack/react-query";
import {
  fetchProfileSnapshot,
  fetchSessionSnapshot,
  fetchTrainingOverview,
  fetchTrainingStats,
  fetchWeeklyPlan,
} from "@/lib/apiClient";
import { DEFAULT_RECENT_LIMIT, queryKeys } from "@/lib/queryKeys";

export function sessionQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.session,
    queryFn: fetchSessionSnapshot,
    staleTime: 60_000,
  });
}

export function trainingOverviewQueryOptions(options: {
  includeRecentHistory: boolean;
  recentLimit?: number;
}) {
  const recentLimit = options.recentLimit ?? DEFAULT_RECENT_LIMIT;

  return queryOptions({
    queryKey: queryKeys.trainingOverview(options.includeRecentHistory, recentLimit),
    queryFn: () =>
      fetchTrainingOverview({
        includeRecentHistory: options.includeRecentHistory,
        recentLimit,
      }),
    staleTime: 15_000,
  });
}

export function trainingStatsQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.trainingStats,
    queryFn: fetchTrainingStats,
    staleTime: 15_000,
  });
}

export function weeklyPlanQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.weeklyPlan,
    queryFn: fetchWeeklyPlan,
    staleTime: 15_000,
  });
}

export function profileSnapshotQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.profileSnapshot,
    queryFn: fetchProfileSnapshot,
    staleTime: 30_000,
  });
}
