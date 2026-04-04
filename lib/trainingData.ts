import { cookies } from "next/headers";
import { z } from "zod";
import {
  formatDateKeyInTimezone,
  getDayBoundsISO,
  getMonthBoundsISO,
  getWeekBoundsISO,
  getWeekdayIndex,
} from "@/lib/date";
import {
  E2E_MOCK_TIMEZONE,
  getMockExercises,
  getMockSchedule,
  getMockSets,
  getMockTimezone,
} from "@/lib/e2eMock";
import { requireAppSession } from "@/lib/appSession";
import type {
  ExerciseOverview,
  ProfilePageData,
  StatsTopExercise,
  SummaryItem,
  TrainingOverview,
  TrainingStats,
  TrainingStatsPeriod,
  WeeklyPlan,
  WeeklyPlanDay,
  WeeklyPlanItem,
} from "@/lib/trainingTypes";

export type {
  ExerciseOverview,
  ProfilePageData,
  StatsTopExercise,
  SummaryItem,
  TrainingOverview,
  TrainingStats,
  TrainingStatsPeriod,
  WeeklyPlan,
  WeeklyPlanDay,
  WeeklyPlanItem,
} from "@/lib/trainingTypes";

type ExerciseRecord = {
  id: string;
  type: string;
  goal: number;
  created_at?: string;
};

type SetRecord = {
  exercise_id: string;
  reps: number;
  created_at: string;
};

type ScheduleRecord = {
  id: string;
  exercise_id: string;
  weekday: number;
  position: number;
  created_at?: string;
};

const topExerciseSchema = z
  .object({
    type: z.string(),
    total: z.number().int(),
  })
  .nullable();

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
  chart: z.array(z.number().int()),
  scheduledWeekdays: z.array(z.number().int()),
});

const trainingOverviewPayloadSchema = z.object({
  timezone: z.string(),
  total: z.number().int(),
  summary: z.array(summaryItemSchema),
  exercises: z.array(exerciseOverviewSchema),
});

const profilePagePayloadSchema = z.object({
  timezone: z.string(),
});

const weeklyPlanPayloadSchema = z.object({
  timezone: z.string(),
  days: z.array(
    z.object({
      weekday: z.number().int(),
      items: z.array(
        z.object({
          scheduleId: z.string(),
          exerciseId: z.string(),
          type: z.string(),
          goal: z.number().int(),
          position: z.number().int(),
        })
      ),
    })
  ),
});

const trainingStatsPeriodSchema = z.object({
  totalReps: z.number().int(),
  totalSets: z.number().int(),
  activeDays: z.number().int(),
  exerciseCount: z.number().int(),
  topExercise: topExerciseSchema,
});

const trainingStatsPayloadSchema = z.object({
  timezone: z.string(),
  periods: z.object({
    today: trainingStatsPeriodSchema,
    week: trainingStatsPeriodSchema,
    month: trainingStatsPeriodSchema,
    all: trainingStatsPeriodSchema,
  }),
  highlights: z.object({
    currentStreakDays: z.number().int(),
    bestDay: z
      .object({
        date: z.string(),
        total: z.number().int(),
      })
      .nullable(),
    totalExercises: z.number().int(),
    scheduledThisWeek: z.number().int(),
  }),
});

function isMissingRpcFunction(error: { code?: string; message?: string } | null) {
  if (!error) {
    return false;
  }

  return error.code === "PGRST202" || /function .* does not exist|Could not find the function/i.test(error.message ?? "");
}

function isMissingRelation(error: { code?: string; message?: string } | null) {
  if (!error) {
    return false;
  }

  return error.code === "42P01" || /relation .* does not exist/i.test(error.message ?? "");
}

function uniqueSortedWeekdays(values: number[]) {
  return [...new Set(values)].sort((a, b) => a - b);
}

function createEmptyOverview(email: string | null, timezone: string): TrainingOverview {
  return {
    email,
    timezone,
    total: 0,
    summary: [],
    exercises: [],
  };
}

function createProfilePageData(email: string | null, timezone: string): ProfilePageData {
  return {
    email,
    timezone,
  };
}

function createEmptyPlan(timezone: string): WeeklyPlan {
  return {
    timezone,
    days: Array.from({ length: 7 }, (_, weekday) => ({
      weekday,
      items: [],
    })),
  };
}

function createEmptyPeriod(): TrainingStatsPeriod {
  return {
    totalReps: 0,
    totalSets: 0,
    activeDays: 0,
    exerciseCount: 0,
    topExercise: null,
  };
}

function createEmptyStats(timezone: string): TrainingStats {
  return {
    timezone,
    periods: {
      today: createEmptyPeriod(),
      week: createEmptyPeriod(),
      month: createEmptyPeriod(),
      all: createEmptyPeriod(),
    },
    highlights: {
      currentStreakDays: 0,
      bestDay: null,
      totalExercises: 0,
      scheduledThisWeek: 0,
    },
  };
}

function lastSevenDateKeys(timezone: string, date: Date = new Date()) {
  return Array.from({ length: 7 }, (_, index) => {
    const offset = 6 - index;
    return formatDateKeyInTimezone(timezone, new Date(date.getTime() - offset * 24 * 60 * 60 * 1000));
  });
}

function buildOverviewFromRows(input: {
  email: string | null;
  timezone: string;
  exercises: ExerciseRecord[];
  todaySets: Array<{ exercise_id: string; reps: number }>;
  recentSets: SetRecord[];
  chartSets: SetRecord[];
  scheduleRows: ScheduleRecord[];
  recentLimit: number;
}) {
  const totalsByExerciseId = new Map<string, number>();
  for (const set of input.todaySets) {
    totalsByExerciseId.set(set.exercise_id, (totalsByExerciseId.get(set.exercise_id) ?? 0) + set.reps);
  }

  const recentByExerciseId = new Map<string, SetRecord[]>();
  for (const set of input.recentSets) {
    const current = recentByExerciseId.get(set.exercise_id) ?? [];
    if (current.length >= input.recentLimit) {
      continue;
    }

    current.push(set);
    recentByExerciseId.set(set.exercise_id, current);
  }

  const chartKeys = lastSevenDateKeys(input.timezone);
  const chartTotals = new Map<string, Map<string, number>>();
  for (const set of input.chartSets) {
    const dateKey = formatDateKeyInTimezone(input.timezone, set.created_at);
    const exerciseChart = chartTotals.get(set.exercise_id) ?? new Map<string, number>();
    exerciseChart.set(dateKey, (exerciseChart.get(dateKey) ?? 0) + set.reps);
    chartTotals.set(set.exercise_id, exerciseChart);
  }

  const weekdaysByExerciseId = new Map<string, number[]>();
  for (const row of input.scheduleRows) {
    const current = weekdaysByExerciseId.get(row.exercise_id) ?? [];
    current.push(row.weekday);
    weekdaysByExerciseId.set(row.exercise_id, current);
  }

  const exercises = input.exercises.map((exercise) => {
    const recentSets = recentByExerciseId.get(exercise.id) ?? [];
    const chartSeries = chartKeys.map((key) => chartTotals.get(exercise.id)?.get(key) ?? 0);
    const scheduledWeekdays = uniqueSortedWeekdays(weekdaysByExerciseId.get(exercise.id) ?? []);

    return {
      id: exercise.id,
      type: exercise.type,
      goal: exercise.goal,
      todayTotal: totalsByExerciseId.get(exercise.id) ?? 0,
      lastSetTime: recentSets[0]?.created_at ?? null,
      recentReps: [...recentSets].reverse().map((set) => set.reps),
      chart: chartSeries,
      scheduledWeekdays,
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

function buildWeeklyPlanFromRows(
  timezone: string,
  exercises: ExerciseRecord[],
  scheduleRows: ScheduleRecord[]
): WeeklyPlan {
  const exerciseMap = new Map(exercises.map((exercise) => [exercise.id, exercise]));
  const days = Array.from({ length: 7 }, (_, weekday) => ({
    weekday,
    items: [] as WeeklyPlanItem[],
  }));

  for (const row of scheduleRows) {
    const exercise = exerciseMap.get(row.exercise_id);
    if (!exercise || !days[row.weekday]) {
      continue;
    }

    days[row.weekday].items.push({
      scheduleId: row.id,
      exerciseId: exercise.id,
      type: exercise.type,
      goal: exercise.goal,
      position: row.position,
    });
  }

  for (const day of days) {
    day.items.sort((left, right) => left.position - right.position || left.type.localeCompare(right.type));
  }

  return {
    timezone,
    days,
  };
}

function summarizePeriod(rows: Array<SetRecord & { type: string }>, timezone: string): TrainingStatsPeriod {
  if (rows.length === 0) {
    return createEmptyPeriod();
  }

  const dayKeys = new Set<string>();
  const exerciseIds = new Set<string>();
  const totalsByExerciseId = new Map<string, { type: string; total: number }>();

  for (const row of rows) {
    dayKeys.add(formatDateKeyInTimezone(timezone, row.created_at));
    exerciseIds.add(row.exercise_id);
    const current = totalsByExerciseId.get(row.exercise_id) ?? {
      type: row.type,
      total: 0,
    };

    current.total += row.reps;
    totalsByExerciseId.set(row.exercise_id, current);
  }

  let topExercise: StatsTopExercise = null;
  for (const value of totalsByExerciseId.values()) {
    if (!topExercise || value.total > topExercise.total) {
      topExercise = {
        type: value.type,
        total: value.total,
      };
    }
  }

  return {
    totalReps: rows.reduce((sum, row) => sum + row.reps, 0),
    totalSets: rows.length,
    activeDays: dayKeys.size,
    exerciseCount: exerciseIds.size,
    topExercise,
  };
}

function buildTrainingStatsFromRows(input: {
  timezone: string;
  exercises: ExerciseRecord[];
  sets: SetRecord[];
  scheduleRows: ScheduleRecord[];
  date?: Date;
}): TrainingStats {
  const timezone = input.timezone;
  const date = input.date ?? new Date();
  const exerciseMap = new Map(input.exercises.map((exercise) => [exercise.id, exercise.type]));
  const rows = input.sets
    .map((set) => ({
      ...set,
      type: exerciseMap.get(set.exercise_id) ?? "exercise",
    }))
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime());

  const todayBounds = getDayBoundsISO(timezone, date);
  const weekBounds = getWeekBoundsISO(timezone, date);
  const monthBounds = getMonthBoundsISO(timezone, date);

  const todayRows = rows.filter((row) => row.created_at >= todayBounds.startISO && row.created_at <= todayBounds.endISO);
  const weekRows = rows.filter((row) => row.created_at >= weekBounds.startISO && row.created_at < weekBounds.endISO);
  const monthRows = rows.filter((row) => row.created_at >= monthBounds.startISO && row.created_at < monthBounds.endISO);

  const totalsByDay = new Map<string, number>();
  for (const row of rows) {
    const dateKey = formatDateKeyInTimezone(timezone, row.created_at);
    totalsByDay.set(dateKey, (totalsByDay.get(dateKey) ?? 0) + row.reps);
  }

  let bestDay: TrainingStats["highlights"]["bestDay"] = null;
  for (const [dateKey, total] of totalsByDay.entries()) {
    if (!bestDay || total > bestDay.total) {
      bestDay = { date: dateKey, total };
    }
  }

  const distinctDayKeys = new Set(totalsByDay.keys());
  let currentStreakDays = 0;
  for (let offset = 0; offset < 365; offset += 1) {
    const dateKey = formatDateKeyInTimezone(timezone, new Date(date.getTime() - offset * 24 * 60 * 60 * 1000));
    if (!distinctDayKeys.has(dateKey)) {
      break;
    }

    currentStreakDays += 1;
  }

  return {
    timezone,
    periods: {
      today: summarizePeriod(todayRows, timezone),
      week: summarizePeriod(weekRows, timezone),
      month: summarizePeriod(monthRows, timezone),
      all: summarizePeriod(rows, timezone),
    },
    highlights: {
      currentStreakDays,
      bestDay,
      totalExercises: input.exercises.length,
      scheduledThisWeek: input.scheduleRows.length,
    },
  };
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
  return createProfilePageData(email, parsed.timezone);
}

function parseWeeklyPlanPayload(payload: unknown): WeeklyPlan {
  return weeklyPlanPayloadSchema.parse(payload);
}

function parseTrainingStatsPayload(payload: unknown): TrainingStats {
  return trainingStatsPayloadSchema.parse(payload);
}

async function getBaseUserData(session: Awaited<ReturnType<typeof requireAppSession>>) {
  const { supabase, user } = session;
  if (!supabase) {
    throw new Error("Supabase client is unavailable for authenticated query execution");
  }
  const [profileResult, exercisesResult] = await Promise.all([
    supabase.from("profiles").select("timezone").eq("user_id", user.id).maybeSingle(),
    supabase.from("exercises").select("id, type, goal, created_at").order("created_at", { ascending: true }),
  ]);

  if (profileResult.error) {
    throw new Error(profileResult.error.message);
  }

  if (exercisesResult.error) {
    throw new Error(exercisesResult.error.message);
  }

  return {
    timezone: profileResult.data?.timezone ?? E2E_MOCK_TIMEZONE,
    exercises:
      exercisesResult.data?.map((exercise) => ({
        id: exercise.id as string,
        type: exercise.type as string,
        goal: exercise.goal as number,
        created_at: exercise.created_at as string,
      })) ?? [],
  };
}

async function getScheduleRows(
  session: Awaited<ReturnType<typeof requireAppSession>>
): Promise<ScheduleRecord[]> {
  if (session.isMock || !session.supabase) {
    const cookieStore = await cookies();
    return getMockSchedule(cookieStore);
  }

  const { supabase, user } = session;
  const { data, error } = await supabase
    .from("exercise_schedule")
    .select("id, exercise_id, weekday, position, created_at")
    .eq("user_id", user.id)
    .order("weekday", { ascending: true })
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    if (isMissingRelation(error)) {
      return [];
    }

    throw new Error(error.message);
  }

  return (
    data?.map((row) => ({
      id: row.id as string,
      exercise_id: row.exercise_id as string,
      weekday: row.weekday as number,
      position: row.position as number,
      created_at: row.created_at as string,
    })) ?? []
  );
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
    const timezone = getMockTimezone(cookieStore);
    const exercises = getMockExercises(cookieStore);
    const sets = getMockSets(cookieStore);
    const todayBounds = getDayBoundsISO(timezone);

    return buildOverviewFromRows({
      email: session.user.email ?? null,
      timezone,
      exercises,
      todaySets: sets
        .filter((set) => set.created_at >= todayBounds.startISO && set.created_at <= todayBounds.endISO)
        .map((set) => ({
          exercise_id: set.exercise_id,
          reps: set.reps,
        })),
      recentSets: options?.includeRecentHistory === false ? [] : sets,
      chartSets: sets,
      scheduleRows: getMockSchedule(cookieStore),
      recentLimit,
    });
  }

  const { supabase, user } = session;
  const { timezone, exercises } = await getBaseUserData(session);

  if (exercises.length === 0) {
    return createEmptyOverview(user.email ?? null, timezone);
  }

  const exerciseIds = exercises.map((exercise) => exercise.id);
  const { startISO, endISO } = getDayBoundsISO(timezone);
  const chartStart = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString();

  const requests: Array<PromiseLike<{ data: unknown[] | null; error: { message: string; code?: string } | null }>> = [
    supabase
      .from("sets")
      .select("exercise_id, reps")
      .in("exercise_id", exerciseIds)
      .is("deleted_at", null)
      .gte("created_at", startISO)
      .lte("created_at", endISO),
    supabase
      .from("sets")
      .select("exercise_id, reps, created_at")
      .in("exercise_id", exerciseIds)
      .is("deleted_at", null)
      .gte("created_at", chartStart)
      .order("created_at", { ascending: false }),
  ];

  if (options?.includeRecentHistory !== false) {
    requests.push(
      supabase
        .from("sets")
        .select("exercise_id, reps, created_at")
        .in("exercise_id", exerciseIds)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(Math.max(exerciseIds.length * recentLimit * 2, 80))
    );
  }

  const [todaySetsResult, chartSetsResult, recentSetsResult] = await Promise.all(requests);

  if (todaySetsResult.error) {
    throw new Error(todaySetsResult.error.message);
  }

  if (chartSetsResult.error) {
    throw new Error(chartSetsResult.error.message);
  }

  if (recentSetsResult?.error) {
    throw new Error(recentSetsResult.error.message);
  }

  const scheduleRows = await getScheduleRows(session);

  return buildOverviewFromRows({
    email: user.email ?? null,
    timezone,
    exercises,
    todaySets: (todaySetsResult.data as Array<{ exercise_id: string; reps: number }> | null) ?? [],
    recentSets:
      ((recentSetsResult?.data as Array<{ exercise_id: string; reps: number; created_at: string }> | null) ?? []),
    chartSets:
      ((chartSetsResult.data as Array<{ exercise_id: string; reps: number; created_at: string }> | null) ?? []),
    scheduleRows,
    recentLimit,
  });
}

async function getProfilePageDataFromQueries(session: Awaited<ReturnType<typeof requireAppSession>>) {
  if (session.isMock || !session.supabase) {
    const cookieStore = await cookies();
    return createProfilePageData(session.user.email ?? null, getMockTimezone(cookieStore));
  }

  const { timezone } = await getBaseUserData(session);
  return createProfilePageData(session.user.email ?? null, timezone);
}

async function getWeeklyPlanFromQueries(session: Awaited<ReturnType<typeof requireAppSession>>) {
  if (session.isMock || !session.supabase) {
    const cookieStore = await cookies();
    const timezone = getMockTimezone(cookieStore);
    return buildWeeklyPlanFromRows(timezone, getMockExercises(cookieStore), getMockSchedule(cookieStore));
  }

  const { timezone, exercises } = await getBaseUserData(session);

  if (exercises.length === 0) {
    return createEmptyPlan(timezone);
  }

  const scheduleRows = await getScheduleRows(session);
  return buildWeeklyPlanFromRows(timezone, exercises, scheduleRows);
}

async function getTrainingStatsFromQueries(session: Awaited<ReturnType<typeof requireAppSession>>) {
  if (session.isMock || !session.supabase) {
    const cookieStore = await cookies();
    const timezone = getMockTimezone(cookieStore);
    return buildTrainingStatsFromRows({
      timezone,
      exercises: getMockExercises(cookieStore),
      sets: getMockSets(cookieStore),
      scheduleRows: getMockSchedule(cookieStore),
    });
  }

  const { supabase } = session;
  const { timezone, exercises } = await getBaseUserData(session);

  if (exercises.length === 0) {
    return createEmptyStats(timezone);
  }

  const exerciseIds = exercises.map((exercise) => exercise.id);
  const { data, error } = await supabase
    .from("sets")
    .select("exercise_id, reps, created_at")
    .in("exercise_id", exerciseIds)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const scheduleRows = await getScheduleRows(session);

  return buildTrainingStatsFromRows({
    timezone,
    exercises,
    sets: (data as Array<{ exercise_id: string; reps: number; created_at: string }> | null) ?? [],
    scheduleRows,
  });
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
    if (isMissingRpcFunction(error) || isMissingRelation(error)) {
      return getTrainingOverviewFromQueries(session, options);
    }

    throw new Error(error.message);
  }

  try {
    return parseTrainingOverviewPayload(data, user.email ?? null);
  } catch {
    return getTrainingOverviewFromQueries(session, options);
  }
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

  try {
    return parseProfilePagePayload(data, user.email ?? null);
  } catch {
    return getProfilePageDataFromQueries(session);
  }
}

export async function getWeeklyPlan(): Promise<WeeklyPlan> {
  const session = await requireAppSession();

  if (session.isMock || !session.supabase) {
    return getWeeklyPlanFromQueries(session);
  }

  const { supabase } = session;
  const { data, error } = await supabase.rpc("get_weekly_plan");

  if (error) {
    if (isMissingRpcFunction(error) || isMissingRelation(error)) {
      return getWeeklyPlanFromQueries(session);
    }

    throw new Error(error.message);
  }

  try {
    return parseWeeklyPlanPayload(data);
  } catch {
    return getWeeklyPlanFromQueries(session);
  }
}

export async function getTrainingStats(): Promise<TrainingStats> {
  const session = await requireAppSession();

  if (session.isMock || !session.supabase) {
    return getTrainingStatsFromQueries(session);
  }

  const { supabase } = session;
  const { data, error } = await supabase.rpc("get_training_stats");

  if (error) {
    if (isMissingRpcFunction(error) || isMissingRelation(error)) {
      return getTrainingStatsFromQueries(session);
    }

    throw new Error(error.message);
  }

  try {
    return parseTrainingStatsPayload(data);
  } catch {
    return getTrainingStatsFromQueries(session);
  }
}

export function getDefaultWeekdayForTimezone(timezone: string) {
  return getWeekdayIndex(timezone);
}
