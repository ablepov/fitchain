import type { QueryClient, QueryKey } from "@tanstack/react-query";
import type { SetApiRecord } from "@/lib/apiClient";
import { DEFAULT_RECENT_LIMIT, queryKeys } from "@/lib/queryKeys";
import type { ProfilePageData, TrainingOverview, TrainingStats, WeeklyPlan } from "@/lib/trainingTypes";

function updateOverviewExercise(
  overview: TrainingOverview,
  setRecord: SetApiRecord,
  recentLimit: number,
  includeRecentHistory: boolean
) {
  let matched = false;

  const exercises = overview.exercises.map((exercise) => {
    if (exercise.id !== setRecord.exercise_id) {
      return exercise;
    }

    matched = true;
    const nextChart = [...exercise.chart];

    if (nextChart.length > 0) {
      nextChart[nextChart.length - 1] = (nextChart[nextChart.length - 1] ?? 0) + setRecord.reps;
    }

    return {
      ...exercise,
      todayTotal: exercise.todayTotal + setRecord.reps,
      lastSetTime:
        !exercise.lastSetTime || new Date(setRecord.created_at) > new Date(exercise.lastSetTime)
          ? setRecord.created_at
          : exercise.lastSetTime,
      recentReps: includeRecentHistory
        ? [...exercise.recentReps, setRecord.reps].slice(-Math.max(1, recentLimit))
        : exercise.recentReps,
      chart: nextChart,
    };
  });

  if (!matched) {
    return overview;
  }

  const summary = exercises.map((exercise) => ({
    type: exercise.type,
    total: exercise.todayTotal,
  }));

  return {
    ...overview,
    total: summary.reduce((sum, item) => sum + item.total, 0),
    summary,
    exercises,
  };
}

function isTrainingOverviewKey(queryKey: QueryKey): queryKey is ReturnType<typeof queryKeys.trainingOverview> {
  return Array.isArray(queryKey) && queryKey[0] === queryKeys.trainingOverviewRoot[0];
}

export type TrainingOverviewCacheSnapshot = Array<[QueryKey, TrainingOverview | undefined]>;

export function snapshotTrainingOverviewCaches(queryClient: QueryClient): TrainingOverviewCacheSnapshot {
  return queryClient.getQueriesData<TrainingOverview>({
    queryKey: queryKeys.trainingOverviewRoot,
  });
}

export function restoreTrainingOverviewCaches(queryClient: QueryClient, snapshot: TrainingOverviewCacheSnapshot) {
  for (const [queryKey, data] of snapshot) {
    queryClient.setQueryData(queryKey, data);
  }
}

export function applyCreatedSetToOverviewCaches(queryClient: QueryClient, setRecord: SetApiRecord) {
  const matchingQueries = snapshotTrainingOverviewCaches(queryClient);

  for (const [queryKey, current] of matchingQueries) {
    if (!current || !isTrainingOverviewKey(queryKey)) {
      continue;
    }

    const includeRecentHistory = queryKey[1] === "history";
    const recentLimit = typeof queryKey[2] === "number" ? queryKey[2] : DEFAULT_RECENT_LIMIT;

    queryClient.setQueryData<TrainingOverview>(
      queryKey,
      updateOverviewExercise(current, setRecord, recentLimit, includeRecentHistory)
    );
  }
}

export function applyTimezoneToCaches(queryClient: QueryClient, timezone: string) {
  const matchingOverviewQueries = snapshotTrainingOverviewCaches(queryClient);

  for (const [queryKey, current] of matchingOverviewQueries) {
    if (!current || !isTrainingOverviewKey(queryKey)) {
      continue;
    }

    queryClient.setQueryData<TrainingOverview>(queryKey, {
      ...current,
      timezone,
    });
  }

  queryClient.setQueryData<TrainingStats>(queryKeys.trainingStats, (current) =>
    current
      ? {
          ...current,
          timezone,
        }
      : current
  );

  queryClient.setQueryData<WeeklyPlan>(queryKeys.weeklyPlan, (current) =>
    current
      ? {
          ...current,
          timezone,
        }
      : current
  );

  queryClient.setQueryData<ProfilePageData>(queryKeys.profileSnapshot, (current) =>
    current
      ? {
          ...current,
          timezone,
        }
      : current
  );
}
