import type { QueryClient, QueryKey } from "@tanstack/react-query";
import type { ExerciseApiRecord, PlanApiRecord, SetApiRecord } from "@/lib/apiClient";
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

function uniqueSorted(values: number[]) {
  return [...new Set(values)].sort((left, right) => left - right);
}

function rebuildOverview(overview: TrainingOverview, exercises: TrainingOverview["exercises"]) {
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

export function applyCreatedExerciseToOverviewCaches(
  queryClient: QueryClient,
  exerciseRecord: ExerciseApiRecord
) {
  const matchingQueries = snapshotTrainingOverviewCaches(queryClient);

  for (const [queryKey, current] of matchingQueries) {
    if (!current || !isTrainingOverviewKey(queryKey)) {
      continue;
    }

    if (current.exercises.some((exercise) => exercise.id === exerciseRecord.id)) {
      continue;
    }

    const chartLength = current.exercises[0]?.chart.length ?? 7;

    queryClient.setQueryData<TrainingOverview>(
      queryKey,
      rebuildOverview(current, [
        ...current.exercises,
        {
          id: exerciseRecord.id,
          type: exerciseRecord.type,
          goal: exerciseRecord.goal,
          todayTotal: 0,
          lastSetTime: null,
          recentReps: [],
          chart: Array.from({ length: chartLength }, () => 0),
          scheduledWeekdays: [],
        },
      ])
    );
  }
}

export function applyUpdatedExerciseToCaches(queryClient: QueryClient, exerciseRecord: ExerciseApiRecord) {
  const matchingQueries = snapshotTrainingOverviewCaches(queryClient);

  for (const [queryKey, current] of matchingQueries) {
    if (!current || !isTrainingOverviewKey(queryKey)) {
      continue;
    }

    queryClient.setQueryData<TrainingOverview>(
      queryKey,
      rebuildOverview(
        current,
        current.exercises.map((exercise) =>
          exercise.id === exerciseRecord.id
            ? {
                ...exercise,
                type: exerciseRecord.type,
                goal: exerciseRecord.goal,
              }
            : exercise
        )
      )
    );
  }

  queryClient.setQueryData<WeeklyPlan>(queryKeys.weeklyPlan, (current) =>
    current
      ? {
          ...current,
          days: current.days.map((day) => ({
            ...day,
            items: day.items.map((item) =>
              item.exerciseId === exerciseRecord.id
                ? {
                    ...item,
                    type: exerciseRecord.type,
                    goal: exerciseRecord.goal,
                  }
                : item
            ),
          })),
        }
      : current
  );
}

export function applyDeletedExerciseToCaches(queryClient: QueryClient, exerciseId: string) {
  const matchingQueries = snapshotTrainingOverviewCaches(queryClient);

  for (const [queryKey, current] of matchingQueries) {
    if (!current || !isTrainingOverviewKey(queryKey)) {
      continue;
    }

    queryClient.setQueryData<TrainingOverview>(
      queryKey,
      rebuildOverview(
        current,
        current.exercises.filter((exercise) => exercise.id !== exerciseId)
      )
    );
  }

  queryClient.setQueryData<WeeklyPlan>(queryKeys.weeklyPlan, (current) =>
    current
      ? {
          ...current,
          days: current.days.map((day) => ({
            ...day,
            items: day.items.filter((item) => item.exerciseId !== exerciseId),
          })),
        }
      : current
  );
}

export function applyCreatedPlanAssignmentToCaches(
  queryClient: QueryClient,
  assignment: PlanApiRecord,
  exerciseRecord: Pick<ExerciseApiRecord, "id" | "type" | "goal">
) {
  const matchingQueries = snapshotTrainingOverviewCaches(queryClient);

  for (const [queryKey, current] of matchingQueries) {
    if (!current || !isTrainingOverviewKey(queryKey)) {
      continue;
    }

    queryClient.setQueryData<TrainingOverview>(
      queryKey,
      rebuildOverview(
        current,
        current.exercises.map((exercise) =>
          exercise.id === assignment.exercise_id
            ? {
                ...exercise,
                scheduledWeekdays: uniqueSorted([...exercise.scheduledWeekdays, assignment.weekday]),
              }
            : exercise
        )
      )
    );
  }

  queryClient.setQueryData<WeeklyPlan>(queryKeys.weeklyPlan, (current) => {
    if (!current) {
      return current;
    }

    return {
      ...current,
      days: current.days.map((day) => {
        if (day.weekday !== assignment.weekday) {
          return day;
        }

        if (day.items.some((item) => item.scheduleId === assignment.id)) {
          return day;
        }

        return {
          ...day,
          items: [
            ...day.items,
            {
              scheduleId: assignment.id,
              exerciseId: assignment.exercise_id,
              type: exerciseRecord.type,
              goal: exerciseRecord.goal,
              position: assignment.position,
            },
          ].sort((left, right) => left.position - right.position || left.type.localeCompare(right.type)),
        };
      }),
    };
  });
}

export function applyDeletedPlanAssignmentToCaches(queryClient: QueryClient, assignmentId: string) {
  let removedAssignment: { exerciseId: string; weekday: number } | null = null;

  queryClient.setQueryData<WeeklyPlan>(queryKeys.weeklyPlan, (current) => {
    if (!current) {
      return current;
    }

    return {
      ...current,
      days: current.days.map((day) => {
        const nextItems = day.items.filter((item) => item.scheduleId !== assignmentId);

        if (nextItems.length === day.items.length) {
          return day;
        }

        const removedItem = day.items.find((item) => item.scheduleId === assignmentId);
        if (removedItem) {
          removedAssignment = {
            exerciseId: removedItem.exerciseId,
            weekday: day.weekday,
          };
        }

        return {
          ...day,
          items: nextItems,
        };
      }),
    };
  });

  if (!removedAssignment) {
    return;
  }

  const {
    exerciseId: removedExerciseId,
    weekday: removedWeekday,
  } = removedAssignment as { exerciseId: string; weekday: number };
  const matchingQueries = snapshotTrainingOverviewCaches(queryClient);

  for (const [queryKey, current] of matchingQueries) {
    if (!current || !isTrainingOverviewKey(queryKey)) {
      continue;
    }

    queryClient.setQueryData<TrainingOverview>(
      queryKey,
      rebuildOverview(
        current,
        current.exercises.map((exercise) =>
          exercise.id === removedExerciseId
            ? {
                ...exercise,
                scheduledWeekdays: exercise.scheduledWeekdays.filter((weekday) => weekday !== removedWeekday),
              }
            : exercise
        )
      )
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
