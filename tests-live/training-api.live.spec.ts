import { randomUUID } from "node:crypto";
import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

type ApiEnvelope<T> = {
  data: T | null;
  error: {
    code: string;
    message: string;
  } | null;
};

type SessionSnapshot = {
  userId: string | null;
  email: string | null;
  isAuthenticated: boolean;
};

type ExerciseRecord = {
  id: string;
  type: string;
  goal: number;
  created_at?: string;
};

type SetRecord = {
  id: string;
  exercise_id: string;
  reps: number;
  created_at: string;
  note: string | null;
  source: "manual" | "quickbutton";
};

type ProfileSnapshot = {
  email: string | null;
  timezone: string;
};

type OverviewExercise = {
  id: string;
  type: string;
  goal: number;
  todayTotal: number;
  recentReps: number[];
};

type TrainingOverview = {
  email: string | null;
  timezone: string;
  total: number;
  exercises: OverviewExercise[];
};

type TrainingStats = {
  timezone: string;
  periods: {
    today: {
      totalReps: number;
      totalSets: number;
      activeDays: number;
      exerciseCount: number;
      topExercise: {
        type: string;
        total: number;
      } | null;
    };
    week: {
      totalReps: number;
      totalSets: number;
      activeDays: number;
      exerciseCount: number;
      topExercise: {
        type: string;
        total: number;
      } | null;
    };
    all: {
      totalReps: number;
      totalSets: number;
      activeDays: number;
      exerciseCount: number;
      topExercise: {
        type: string;
        total: number;
      } | null;
    };
  };
  highlights: {
    totalExercises: number;
    scheduledThisWeek: number;
  };
};

type PlanItem = {
  scheduleId: string;
  exerciseId: string;
  type: string;
  goal: number;
  position: number;
};

type WeeklyPlan = {
  timezone: string;
  isAvailable: boolean;
  days: Array<{
    weekday: number;
    items: PlanItem[];
  }>;
};

process.loadEnvFile?.(".env.local");

function requireEnv(name: "E2E_TEST_EMAIL" | "E2E_TEST_PASSWORD") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} must be set for live Playwright tests.`);
  }

  return value;
}

const testEmail = requireEnv("E2E_TEST_EMAIL");
const testPassword = requireEnv("E2E_TEST_PASSWORD");

function makeExerciseName(prefix: string) {
  const suffix = randomUUID().replace(/-/g, " ").slice(0, 8);
  return `${prefix} ${suffix}`.replace(/\s+/g, " ").trim();
}

async function requestEnvelope<T>(
  request: APIRequestContext,
  input: string,
  init?: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
  }
) {
  const response = await request.fetch(input, {
    method: init?.method ?? "GET",
    data: init?.body,
    headers: init?.body
      ? {
          "Content-Type": "application/json",
        }
      : undefined,
  });

  if (response.status() === 204) {
    return {
      status: response.status(),
      envelope: null as ApiEnvelope<T> | null,
    };
  }

  const responseText = await response.text();
  let envelope: ApiEnvelope<T> | null = null;

  if (responseText) {
    try {
      envelope = JSON.parse(responseText) as ApiEnvelope<T>;
    } catch {
      throw new Error(
        `Expected JSON response for ${init?.method ?? "GET"} ${input}, got ${response.status()}: ${responseText.slice(0, 500)}`
      );
    }
  }

  return {
    status: response.status(),
    envelope,
  };
}

async function login(page: Page) {
  await page.goto("/auth");
  await page.locator('input[name="email"]').fill(testEmail);
  await page.locator('input[name="password"]').fill(testPassword);
  await page.locator('form button[type="submit"]').first().click();
  await expect(page).toHaveURL(/\/$/);

  const sessionResponse = await requestEnvelope<SessionSnapshot>(page.context().request, "/api/session");
  expect(sessionResponse.status).toBe(200);
  expect(sessionResponse.envelope?.error).toBeNull();
  expect(sessionResponse.envelope?.data).toMatchObject({
    email: testEmail,
    isAuthenticated: true,
  });
}

async function cleanupAccountState(request: APIRequestContext) {
  const timezoneResponse = await requestEnvelope<{ timezone: string }>(request, "/api/profile/timezone", {
    method: "PATCH",
    body: {
      timezone: "UTC",
    },
  });

  if (timezoneResponse.status !== 200) {
    return;
  }

  const overviewResponse = await requestEnvelope<TrainingOverview>(
    request,
    "/api/training/overview?history=0&recentLimit=1"
  );

  if (overviewResponse.status !== 200 || !overviewResponse.envelope?.data) {
    return;
  }

  for (const exercise of overviewResponse.envelope.data.exercises) {
    const deleteResponse = await requestEnvelope<{ id: string; type: string }>(
      request,
      `/api/exercises/${exercise.id}`,
      {
        method: "DELETE",
      }
    );

    expect([200, 404]).toContain(deleteResponse.status);
  }
}

async function createExercise(request: APIRequestContext, type: string, goal: number) {
  const response = await requestEnvelope<ExerciseRecord>(request, "/api/exercises", {
    method: "POST",
    body: {
      type,
      goal,
    },
  });

  expect(response.status).toBe(201);
  expect(response.envelope?.error).toBeNull();
  expect(response.envelope?.data).not.toBeNull();
  return response.envelope?.data as ExerciseRecord;
}

test.describe("live training api flows", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await cleanupAccountState(page.context().request);
  });

  test.afterEach(async ({ page }) => {
    await cleanupAccountState(page.context().request);
  });

  test("creates, updates, rejects duplicates, and deletes exercises", async ({ page }) => {
    const request = page.context().request;
    const createdExercise = await createExercise(request, makeExerciseName("Live Exercise Crud"), 42);

    const duplicateResponse = await requestEnvelope<ExerciseRecord>(request, "/api/exercises", {
      method: "POST",
      body: {
        type: createdExercise.type.toLowerCase(),
        goal: 42,
      },
    });

    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.envelope?.error?.code).toBe("CONFLICT");

    const overviewAfterCreate = await requestEnvelope<TrainingOverview>(
      request,
      "/api/training/overview?history=1&recentLimit=5"
    );

    expect(overviewAfterCreate.status).toBe(200);
    expect(overviewAfterCreate.envelope?.data?.exercises).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdExercise.id,
          type: createdExercise.type,
          goal: 42,
          todayTotal: 0,
          recentReps: [],
        }),
      ])
    );

    const updatedName = makeExerciseName("Live Exercise Updated");
    const updateResponse = await requestEnvelope<ExerciseRecord>(request, `/api/exercises/${createdExercise.id}`, {
      method: "PATCH",
      body: {
        type: updatedName,
        goal: 64,
      },
    });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.envelope?.data).toMatchObject({
      id: createdExercise.id,
      type: updatedName,
      goal: 64,
    });

    const deleteResponse = await requestEnvelope<{ id: string; type: string }>(
      request,
      `/api/exercises/${createdExercise.id}`,
      {
        method: "DELETE",
      }
    );

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.envelope?.data).toMatchObject({
      id: createdExercise.id,
      type: updatedName,
    });

    const overviewAfterDelete = await requestEnvelope<TrainingOverview>(
      request,
      "/api/training/overview?history=1&recentLimit=5"
    );

    expect(overviewAfterDelete.status).toBe(200);
    expect(
      overviewAfterDelete.envelope?.data?.exercises.find((exercise) => exercise.id === createdExercise.id)
    ).toBeUndefined();
  });

  test("adds sets, updates overview and stats, and soft deletes sets", async ({ page }) => {
    const request = page.context().request;
    const exercise = await createExercise(request, makeExerciseName("Live Sets Flow"), 80);

    const firstSetResponse = await requestEnvelope<SetRecord>(request, "/api/sets", {
      method: "POST",
      body: {
        exerciseId: exercise.id,
        reps: 12,
        note: "first live set",
        source: "manual",
      },
    });

    expect(firstSetResponse.status).toBe(201);
    expect(firstSetResponse.envelope?.data).toMatchObject({
      exercise_id: exercise.id,
      reps: 12,
      note: "first live set",
      source: "manual",
    });

    const secondSetResponse = await requestEnvelope<SetRecord>(request, "/api/sets", {
      method: "POST",
      body: {
        exercise: exercise.type,
        reps: 15,
        source: "quickbutton",
      },
    });

    expect(secondSetResponse.status).toBe(201);
    expect(secondSetResponse.envelope?.data).toMatchObject({
      exercise_id: exercise.id,
      reps: 15,
      note: null,
      source: "quickbutton",
    });

    const setsResponse = await requestEnvelope<SetRecord[]>(request, `/api/sets?exerciseId=${exercise.id}`);
    expect(setsResponse.status).toBe(200);
    expect(setsResponse.envelope?.data).toHaveLength(2);
    expect(setsResponse.envelope?.data?.map((set) => set.reps)).toEqual([15, 12]);

    const overviewResponse = await requestEnvelope<TrainingOverview>(
      request,
      "/api/training/overview?history=1&recentLimit=5"
    );

    expect(overviewResponse.status).toBe(200);
    expect(
      overviewResponse.envelope?.data?.exercises.find((item) => item.id === exercise.id)
    ).toMatchObject({
      id: exercise.id,
      type: exercise.type,
      goal: 80,
      todayTotal: 27,
      recentReps: [12, 15],
    });

    const statsResponse = await requestEnvelope<TrainingStats>(request, "/api/training/stats");
    expect(statsResponse.status).toBe(200);
    expect(statsResponse.envelope?.data).toMatchObject({
      periods: {
        today: {
          totalReps: 27,
          totalSets: 2,
          exerciseCount: 1,
          topExercise: {
            type: exercise.type,
            total: 27,
          },
        },
        week: {
          totalReps: 27,
          totalSets: 2,
          exerciseCount: 1,
        },
        all: {
          totalReps: 27,
          totalSets: 2,
          exerciseCount: 1,
        },
      },
      highlights: {
        totalExercises: 1,
      },
    });

    const latestSetId = setsResponse.envelope?.data?.[0]?.id;
    expect(latestSetId).toBeTruthy();

    const deleteSetResponse = await requestEnvelope<null>(request, `/api/sets/${latestSetId}`, {
      method: "DELETE",
    });
    expect(deleteSetResponse.status).toBe(204);

    const setsAfterDelete = await requestEnvelope<SetRecord[]>(request, `/api/sets?exerciseId=${exercise.id}`);
    expect(setsAfterDelete.status).toBe(200);
    expect(setsAfterDelete.envelope?.data).toHaveLength(1);
    expect(setsAfterDelete.envelope?.data?.[0]).toMatchObject({
      reps: 12,
      source: "manual",
    });

    const overviewAfterDelete = await requestEnvelope<TrainingOverview>(
      request,
      "/api/training/overview?history=1&recentLimit=5"
    );
    expect(
      overviewAfterDelete.envelope?.data?.exercises.find((item) => item.id === exercise.id)
    ).toMatchObject({
      todayTotal: 12,
      recentReps: [12],
    });

    const statsAfterDelete = await requestEnvelope<TrainingStats>(request, "/api/training/stats");
    expect(statsAfterDelete.status).toBe(200);
    expect(statsAfterDelete.envelope?.data).toMatchObject({
      periods: {
        today: {
          totalReps: 12,
          totalSets: 1,
          exerciseCount: 1,
          topExercise: {
            type: exercise.type,
            total: 12,
          },
        },
      },
    });
  });

  test("updates timezone and performs weekly plan CRUD", async ({ page }) => {
    const request = page.context().request;

    const timezoneResponse = await requestEnvelope<ProfileSnapshot>(request, "/api/profile/timezone", {
      method: "PATCH",
      body: {
        timezone: "Europe/Moscow",
      },
    });

    expect(timezoneResponse.status).toBe(200);
    expect(timezoneResponse.envelope?.data).toMatchObject({
      timezone: "Europe/Moscow",
    });

    const profileResponse = await requestEnvelope<ProfileSnapshot>(request, "/api/profile/snapshot");
    expect(profileResponse.status).toBe(200);
    expect(profileResponse.envelope?.data).toMatchObject({
      email: testEmail,
      timezone: "Europe/Moscow",
    });

    const exercise = await createExercise(request, makeExerciseName("Live Planner Flow"), 35);

    const createPlanResponse = await requestEnvelope<{
      id: string;
      exercise_id: string;
      weekday: number;
      position: number;
      created_at: string;
    }>(request, "/api/training/plan", {
      method: "POST",
      body: {
        exerciseId: exercise.id,
        weekday: 1,
      },
    });

    expect(createPlanResponse.status).toBe(201);
    expect(createPlanResponse.envelope?.data).toMatchObject({
      exercise_id: exercise.id,
      weekday: 1,
      position: 0,
    });

    const duplicatePlanResponse = await requestEnvelope<unknown>(request, "/api/training/plan", {
      method: "POST",
      body: {
        exerciseId: exercise.id,
        weekday: 1,
      },
    });

    expect(duplicatePlanResponse.status).toBe(409);
    expect(duplicatePlanResponse.envelope?.error?.code).toBe("CONFLICT");

    const planId = createPlanResponse.envelope?.data?.id;
    expect(planId).toBeTruthy();

    const initialPlanResponse = await requestEnvelope<WeeklyPlan>(request, "/api/training/plan");
    expect(initialPlanResponse.status).toBe(200);
    expect(initialPlanResponse.envelope?.data?.timezone).toBe("Europe/Moscow");
    expect(initialPlanResponse.envelope?.data?.isAvailable).toBe(true);
    expect(initialPlanResponse.envelope?.data?.days[1]?.items).toEqual([
      expect.objectContaining({
        scheduleId: planId,
        exerciseId: exercise.id,
        type: exercise.type,
        goal: 35,
        position: 0,
      }),
    ]);

    const updatePlanResponse = await requestEnvelope<{
      id: string;
      exercise_id: string;
      weekday: number;
      position: number;
    }>(request, `/api/training/plan/${planId}`, {
      method: "PATCH",
      body: {
        weekday: 4,
      },
    });

    expect(updatePlanResponse.status).toBe(200);
    expect(updatePlanResponse.envelope?.data).toMatchObject({
      id: planId,
      weekday: 4,
      position: 0,
    });

    const updatedPlanResponse = await requestEnvelope<WeeklyPlan>(request, "/api/training/plan");
    expect(updatedPlanResponse.status).toBe(200);
    expect(updatedPlanResponse.envelope?.data?.days[1]?.items).toEqual([]);
    expect(updatedPlanResponse.envelope?.data?.days[4]?.items).toEqual([
      expect.objectContaining({
        scheduleId: planId,
        exerciseId: exercise.id,
        type: exercise.type,
        goal: 35,
      }),
    ]);

    const deletePlanResponse = await requestEnvelope<{ id: string }>(request, `/api/training/plan/${planId}`, {
      method: "DELETE",
    });

    expect(deletePlanResponse.status).toBe(200);
    expect(deletePlanResponse.envelope?.data).toMatchObject({
      id: planId,
    });

    const planAfterDelete = await requestEnvelope<WeeklyPlan>(request, "/api/training/plan");
    expect(planAfterDelete.status).toBe(200);
    expect(planAfterDelete.envelope?.data?.days.every((day) => day.items.length === 0)).toBe(true);
  });
});
