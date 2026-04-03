import { cookies } from "next/headers";
import { getDayBoundsISO } from "@/lib/date";
import {
  E2E_MOCK_EXERCISE_ID,
  E2E_MOCK_TIMEZONE,
  getMockExercise,
  getMockHistory,
} from "@/lib/e2eMock";
import { requireAppSession } from "@/lib/appSession";

export type SummaryItem = {
  type: string;
  total: number;
};

export type ExerciseOverview = {
  id: string;
  type: string;
  goal: number;
  todayTotal: number;
  lastSetTime: string | null;
  recentReps: number[];
};

export type TrainingOverview = {
  email: string | null;
  timezone: string;
  total: number;
  summary: SummaryItem[];
  exercises: ExerciseOverview[];
};

export type ProfilePageData = {
  email: string | null;
  timezone: string;
  exercises: Array<{
    id: string;
    type: string;
    goal: number;
  }>;
};

function createEmptyOverview(email: string | null, timezone: string): TrainingOverview {
  return {
    email,
    timezone,
    total: 0,
    summary: [],
    exercises: [],
  };
}

function buildOverviewFromRows(input: {
  email: string | null;
  timezone: string;
  exercises: Array<{ id: string; type: string; goal: number }>;
  todaySets: Array<{ exercise_id: string; reps: number }>;
  recentSets: Array<{ exercise_id: string; reps: number; created_at: string }>;
  recentLimit: number;
}) {
  const totalsByExerciseId = new Map<string, number>();

  for (const set of input.todaySets) {
    totalsByExerciseId.set(set.exercise_id, (totalsByExerciseId.get(set.exercise_id) ?? 0) + set.reps);
  }

  const recentByExerciseId = new Map<string, Array<{ reps: number; created_at: string }>>();

  for (const set of input.recentSets) {
    const current = recentByExerciseId.get(set.exercise_id) ?? [];

    if (current.length >= input.recentLimit) {
      continue;
    }

    current.push(set);
    recentByExerciseId.set(set.exercise_id, current);
  }

  const exercises = input.exercises.map((exercise) => {
    const recentSets = recentByExerciseId.get(exercise.id) ?? [];

    return {
      id: exercise.id,
      type: exercise.type,
      goal: exercise.goal,
      todayTotal: totalsByExerciseId.get(exercise.id) ?? 0,
      lastSetTime: recentSets[0]?.created_at ?? null,
      recentReps: [...recentSets].reverse().map((set) => set.reps),
    };
  });

  const summary = exercises.map((exercise) => ({
    type: exercise.type,
    total: exercise.todayTotal,
  }));

  return {
    email: input.email,
    timezone: input.timezone,
    total: summary.reduce((sum, item) => sum + item.total, 0),
    summary,
    exercises,
  };
}

export async function getTrainingOverview(options?: {
  includeRecentHistory?: boolean;
  recentLimit?: number;
}): Promise<TrainingOverview> {
  const recentLimit = options?.recentLimit ?? 20;
  const session = await requireAppSession();

  if (session.isMock || !session.supabase) {
    const cookieStore = await cookies();
    const history = getMockHistory(cookieStore);
    const exercise = getMockExercise();

    return buildOverviewFromRows({
      email: session.user.email ?? null,
      timezone: E2E_MOCK_TIMEZONE,
      exercises: [exercise],
      todaySets: [],
      recentSets:
        options?.includeRecentHistory === false
          ? []
          : history.map((reps, index) => ({
              exercise_id: E2E_MOCK_EXERCISE_ID,
              reps,
              created_at: new Date(Date.now() - index * 60_000).toISOString(),
            })),
      recentLimit,
    });
  }

  const { supabase, user } = session;

  const [profileResult, exercisesResult] = await Promise.all([
    supabase.from("profiles").select("timezone").eq("user_id", user.id).maybeSingle(),
    supabase.from("exercises").select("id, type, goal").order("created_at", { ascending: true }),
  ]);

  if (profileResult.error) {
    throw new Error(profileResult.error.message);
  }

  if (exercisesResult.error) {
    throw new Error(exercisesResult.error.message);
  }

  const timezone = profileResult.data?.timezone ?? E2E_MOCK_TIMEZONE;
  const exercises =
    exercisesResult.data?.map((exercise) => ({
      id: exercise.id as string,
      type: exercise.type as string,
      goal: exercise.goal as number,
    })) ?? [];

  if (exercises.length === 0) {
    return createEmptyOverview(user.email ?? null, timezone);
  }

  const exerciseIds = exercises.map((exercise) => exercise.id);
  const { startISO, endISO } = getDayBoundsISO(timezone);

  const requests: Array<PromiseLike<{ data: unknown[] | null; error: { message: string } | null }>> = [
    supabase
      .from("sets")
      .select("exercise_id, reps")
      .in("exercise_id", exerciseIds)
      .gte("created_at", startISO)
      .lte("created_at", endISO),
  ];

  if (options?.includeRecentHistory !== false) {
    requests.push(
      supabase
        .from("sets")
        .select("exercise_id, reps, created_at")
        .in("exercise_id", exerciseIds)
        .order("created_at", { ascending: false })
        .limit(Math.max(exerciseIds.length * recentLimit * 2, 80))
    );
  }

  const [todaySetsResult, recentSetsResult] = await Promise.all(requests);

  if (todaySetsResult.error) {
    throw new Error(todaySetsResult.error.message);
  }

  if (recentSetsResult?.error) {
    throw new Error(recentSetsResult.error.message);
  }

  return buildOverviewFromRows({
    email: user.email ?? null,
    timezone,
    exercises,
    todaySets: (todaySetsResult.data as Array<{ exercise_id: string; reps: number }> | null) ?? [],
    recentSets:
      ((recentSetsResult?.data as Array<{ exercise_id: string; reps: number; created_at: string }> | null) ?? []),
    recentLimit,
  });
}

export async function getProfilePageData(): Promise<ProfilePageData> {
  const session = await requireAppSession();

  if (session.isMock || !session.supabase) {
    const exercise = getMockExercise();

    return {
      email: session.user.email ?? null,
      timezone: E2E_MOCK_TIMEZONE,
      exercises: [exercise],
    };
  }

  const { supabase, user } = session;
  const [profileResult, exercisesResult] = await Promise.all([
    supabase.from("profiles").select("timezone").eq("user_id", user.id).maybeSingle(),
    supabase.from("exercises").select("id, type, goal").order("created_at", { ascending: true }),
  ]);

  if (profileResult.error) {
    throw new Error(profileResult.error.message);
  }

  if (exercisesResult.error) {
    throw new Error(exercisesResult.error.message);
  }

  return {
    email: user.email ?? null,
    timezone: profileResult.data?.timezone ?? E2E_MOCK_TIMEZONE,
    exercises:
      exercisesResult.data?.map((exercise) => ({
        id: exercise.id as string,
        type: exercise.type as string,
        goal: exercise.goal as number,
      })) ?? [],
  };
}
