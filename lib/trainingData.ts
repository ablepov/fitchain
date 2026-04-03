import { cookies } from "next/headers";
import { z } from "zod";
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

const summaryItemSchema = z.object({
  type: z.string(),
  total: z.number().int(),
});

const exerciseOverviewSchema = z.object({
  id: z.string(),
  type: z.string(),
  goal: z.number().int(),
  todayTotal: z.number().int(),
  lastSetTime: z.string().nullable(),
  recentReps: z.array(z.number().int()),
});

const trainingOverviewPayloadSchema = z.object({
  timezone: z.string(),
  total: z.number().int(),
  summary: z.array(summaryItemSchema),
  exercises: z.array(exerciseOverviewSchema),
});

const profilePagePayloadSchema = z.object({
  timezone: z.string(),
  exercises: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      goal: z.number().int(),
    })
  ),
});

function createEmptyOverview(email: string | null, timezone: string): TrainingOverview {
  return {
    email,
    timezone,
    total: 0,
    summary: [],
    exercises: [],
  };
}

function createProfilePageData(email: string | null, timezone: string, exercises: ProfilePageData["exercises"]) {
  return {
    email,
    timezone,
    exercises,
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

function isMissingRpcFunction(error: { code?: string; message?: string } | null) {
  if (!error) {
    return false;
  }

  return error.code === "PGRST202" || /function .* does not exist|Could not find the function/i.test(error.message ?? "");
}

function parseTrainingOverviewPayload(payload: unknown, email: string | null): TrainingOverview {
  const parsed = trainingOverviewPayloadSchema.parse(payload);

  return {
    email,
    timezone: parsed.timezone,
    total: parsed.total,
    summary: parsed.summary,
    exercises: parsed.exercises,
  };
}

function parseProfilePagePayload(payload: unknown, email: string | null): ProfilePageData {
  const parsed = profilePagePayloadSchema.parse(payload);

  return createProfilePageData(email, parsed.timezone, parsed.exercises);
}

async function getTrainingOverviewFromQueries(
  session: Awaited<ReturnType<typeof requireAppSession>>,
  options?: {
    includeRecentHistory?: boolean;
    recentLimit?: number;
  }
) {
  const recentLimit = options?.recentLimit ?? 20;

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

async function getProfilePageDataFromQueries(session: Awaited<ReturnType<typeof requireAppSession>>) {
  if (session.isMock || !session.supabase) {
    const exercise = getMockExercise();

    return createProfilePageData(session.user.email ?? null, E2E_MOCK_TIMEZONE, [exercise]);
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

  return createProfilePageData(
    user.email ?? null,
    profileResult.data?.timezone ?? E2E_MOCK_TIMEZONE,
    exercisesResult.data?.map((exercise) => ({
      id: exercise.id as string,
      type: exercise.type as string,
      goal: exercise.goal as number,
    })) ?? []
  );
}

export async function getTrainingOverview(options?: {
  includeRecentHistory?: boolean;
  recentLimit?: number;
}): Promise<TrainingOverview> {
  const session = await requireAppSession();

  if (session.isMock || !session.supabase) {
    return getTrainingOverviewFromQueries(session, options);
  }

  const { supabase, user } = session;
  const recentLimit = options?.recentLimit ?? 20;
  const includeRecentHistory = options?.includeRecentHistory !== false;

  const { data, error } = await supabase.rpc("get_training_overview", {
    include_recent_history: includeRecentHistory,
    recent_limit: recentLimit,
  });

  if (error) {
    if (isMissingRpcFunction(error)) {
      return getTrainingOverviewFromQueries(session, options);
    }

    throw new Error(error.message);
  }

  return parseTrainingOverviewPayload(data, user.email ?? null);
}

export async function getProfilePageData(): Promise<ProfilePageData> {
  const session = await requireAppSession();

  if (session.isMock || !session.supabase) {
    return getProfilePageDataFromQueries(session);
  }

  const { supabase, user } = session;
  const { data, error } = await supabase.rpc("get_profile_snapshot");

  if (error) {
    if (isMissingRpcFunction(error)) {
      return getProfilePageDataFromQueries(session);
    }

    throw new Error(error.message);
  }

  return parseProfilePagePayload(data, user.email ?? null);
}
