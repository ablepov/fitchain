import type { RequestCookies, ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { getWeekdayIndex } from "@/lib/date";

export const E2E_MOCK_EXERCISE_ID = "11111111-1111-4111-8111-111111111111";
export const E2E_MOCK_USER_ID = "22222222-2222-4222-8222-222222222222";
export const E2E_MOCK_USER_EMAIL = "tester@example.com";
export const E2E_MOCK_TIMEZONE = "Europe/Moscow";

export type MockExerciseRecord = {
  id: string;
  type: string;
  goal: number;
  created_at: string;
};

export type MockSetRecord = {
  id: string;
  exercise_id: string;
  reps: number;
  created_at: string;
  note: string | null;
  source: "manual" | "quickbutton";
};

export type MockScheduleRecord = {
  id: string;
  exercise_id: string;
  weekday: number;
  position: number;
  created_at: string;
};

type CookieStoreLike =
  | Pick<RequestCookies, "get">
  | Pick<ResponseCookies, "get">
  | { get(name: string): { value: string } | undefined };

type CookieWriterLike = {
  cookies: {
    set(name: string, value: string, options?: { path?: string; sameSite?: "lax" | "strict" | "none" }): void;
  };
};

function createDefaultExercise(): MockExerciseRecord {
  return {
    id: E2E_MOCK_EXERCISE_ID,
    type: "pushups",
    goal: 100,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  };
}

function buildDefaultSets(exerciseId: string, history: number[]) {
  return history.map((reps, index) => ({
    id: `mock-set-${index + 1}`,
    exercise_id: exerciseId,
    reps,
    created_at: new Date(Date.now() - index * 60_000).toISOString(),
    note: null,
    source: "quickbutton" as const,
  }));
}

function parseJsonCookie<T>(cookieStore: CookieStoreLike | null | undefined, name: string): T | null {
  const rawValue = cookieStore?.get(name)?.value;
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(rawValue)) as T;
  } catch {
    return null;
  }
}

export function isE2EMockMode() {
  return process.env.E2E_MOCK_MODE === "1";
}

export function stringifyMockCookie(value: unknown) {
  return encodeURIComponent(JSON.stringify(value));
}

export function applyMockStateCookies(
  response: CookieWriterLike,
  nextState: Partial<{
    exercises: MockExerciseRecord[];
    sets: MockSetRecord[];
    plan: MockScheduleRecord[];
    timezone: string;
  }>
) {
  const cookieOptions = {
    path: "/",
    sameSite: "lax" as const,
  };

  if (nextState.exercises) {
    response.cookies.set("e2e-exercises", stringifyMockCookie(nextState.exercises), cookieOptions);
  }

  if (nextState.sets) {
    response.cookies.set("e2e-sets", stringifyMockCookie(nextState.sets), cookieOptions);
  }

  if (nextState.plan) {
    response.cookies.set("e2e-plan", stringifyMockCookie(nextState.plan), cookieOptions);
  }

  if (nextState.timezone) {
    response.cookies.set("e2e-timezone", nextState.timezone, cookieOptions);
  }
}

export function getMockUser() {
  return {
    id: E2E_MOCK_USER_ID,
    email: E2E_MOCK_USER_EMAIL,
  };
}

export function getMockTimezone(cookieStore?: CookieStoreLike | null) {
  const cookieTimezone = cookieStore?.get("e2e-timezone")?.value;
  return cookieTimezone?.trim() || E2E_MOCK_TIMEZONE;
}

export function isMockPlannerDisabled(cookieStore?: CookieStoreLike | null) {
  return cookieStore?.get("e2e-plan-disabled")?.value === "1";
}

export function getMockHistory(cookieStore?: CookieStoreLike | null) {
  const rawValue = cookieStore?.get("e2e-history")?.value;

  if (!rawValue) {
    return [7, 5, 3];
  }

  if (rawValue === "__empty__") {
    return [];
  }

  const parsed = rawValue
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value) && value > 0)
    .map((value) => Math.round(value));

  return parsed.length > 0 ? parsed : [7, 5, 3];
}

export function getMockExercises(cookieStore?: CookieStoreLike | null) {
  const cookieExercises = parseJsonCookie<MockExerciseRecord[]>(cookieStore, "e2e-exercises");

  if (cookieExercises && cookieExercises.length > 0) {
    return cookieExercises;
  }

  return [createDefaultExercise()];
}

export function getMockExercise(cookieStore?: CookieStoreLike | null) {
  return getMockExercises(cookieStore)[0] ?? createDefaultExercise();
}

export function getMockSets(cookieStore?: CookieStoreLike | null) {
  const cookieSets = parseJsonCookie<MockSetRecord[]>(cookieStore, "e2e-sets");
  if (cookieSets) {
    return cookieSets;
  }

  const primaryExercise = getMockExercise(cookieStore);
  return buildDefaultSets(primaryExercise.id, getMockHistory(cookieStore));
}

export function getMockSchedule(cookieStore?: CookieStoreLike | null) {
  if (isMockPlannerDisabled(cookieStore)) {
    return [];
  }

  const cookiePlan = parseJsonCookie<MockScheduleRecord[]>(cookieStore, "e2e-plan");

  if (cookiePlan) {
    return cookiePlan;
  }

  const exercises = getMockExercises(cookieStore);
  const firstExercise = exercises[0];

  if (!firstExercise) {
    return [];
  }

  return [
    {
      id: "mock-schedule-1",
      exercise_id: firstExercise.id,
      weekday: getWeekdayIndex(getMockTimezone(cookieStore)),
      position: 0,
      created_at: new Date().toISOString(),
    },
  ];
}
