import { expect, test, type Page } from "@playwright/test";

const EXERCISE_ID = "11111111-1111-1111-1111-111111111111";
const USER_ID = "22222222-2222-4222-8222-222222222222";
const USER_EMAIL = "tester@example.com";

type Source = "manual" | "quickbutton";

type SetRecord = {
  id: string;
  exercise_id: string;
  reps: number;
  created_at: string;
  note: string | null;
  source: Source;
};

type MockOptions = {
  historyReps?: number[];
};

function buildSet(reps: number, index: number): SetRecord {
  return {
    id: `set-${index + 1}`,
    exercise_id: EXERCISE_ID,
    reps,
    created_at: new Date(Date.now() - index * 60_000).toISOString(),
    note: null,
    source: "quickbutton",
  };
}

async function mountQuickButtons(page: Page, options: MockOptions = {}) {
  const historyReps = options.historyReps ?? [7, 5, 3];
  let sets = historyReps.map((reps, index) => buildSet(reps, index));
  const postedBodies: Array<{ exerciseId: string; reps: number; source: Source }> = [];

  const session = {
    access_token: "test-access-token",
    refresh_token: "test-refresh-token",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: "bearer",
    user: {
      id: USER_ID,
      aud: "authenticated",
      role: "authenticated",
      email: USER_EMAIL,
    },
  };

  await page.addInitScript(({ sessionJson }) => {
    const originalGetItem = Storage.prototype.getItem;
    const originalSetItem = Storage.prototype.setItem;

    Storage.prototype.getItem = function getItem(key: string) {
      if (typeof key === "string" && key.includes("auth-token")) {
        return sessionJson;
      }

      return originalGetItem.call(this, key);
    };

    Storage.prototype.setItem = function setItem(key: string, value: string) {
      if (typeof key === "string" && key.includes("auth-token")) {
        return;
      }

      return originalSetItem.call(this, key, value);
    };
  }, { sessionJson: JSON.stringify(session) });

  await page.route("**/auth/v1/user**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: USER_ID,
        aud: "authenticated",
        role: "authenticated",
        email: USER_EMAIL,
      }),
    });
  });

  await page.route("**/auth/v1/token**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(session),
    });
  });

  await page.route("**/rest/v1/profiles**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ timezone: "Europe/Moscow" }),
    });
  });

  await page.route("**/rest/v1/exercises**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ id: EXERCISE_ID, type: "pushups", goal: 100 }]),
    });
  });

  await page.route("**/rest/v1/sets**", async (route) => {
    const url = new URL(route.request().url());
    const requestedExerciseId = url.searchParams.get("exercise_id")?.replace(/^eq\./, "");
    const body = sets
      .filter((item) => !requestedExerciseId || item.exercise_id === requestedExerciseId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });

  await page.route("**/api/sets**", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: sets
            .filter((item) => item.exercise_id === EXERCISE_ID)
            .sort((a, b) => b.created_at.localeCompare(a.created_at)),
          error: null,
        }),
      });

      return;
    }

    const body = (await route.request().postDataJSON()) as {
      exerciseId: string;
      reps: number;
      source: Source;
    };

    postedBodies.push(body);

    const createdSet: SetRecord = {
      id: `set-${sets.length + 1}`,
      exercise_id: body.exerciseId,
      reps: body.reps,
      created_at: new Date().toISOString(),
      note: null,
      source: body.source,
    };

    sets = [createdSet, ...sets];

    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ data: createdSet, error: null }),
    });
  });

  await page.route("**/api/telemetry", async (route) => {
    await route.fulfill({ status: 204, body: "" });
  });

  await page.goto("/");
  await expect(page.getByTestId("quick-button-plus-one")).toBeVisible();

  return {
    postedBodies,
  };
}

test.describe("QuickButtons buffer flow", () => {
  test("starts a countdown and commits only after five seconds", async ({ page }) => {
    const harness = await mountQuickButtons(page);

    await page.getByTestId("quick-button-plus-one").click();

    await expect(page.getByTestId("quick-buffer-panel")).toBeVisible();
    await expect(page.getByTestId("quick-buffer-value")).toHaveText("+1");
    await expect(page.getByTestId("quick-buffer-progress")).toBeVisible();
    await expect(page.getByTestId("quick-buffer-seconds")).toHaveText(/5/);

    await page.waitForTimeout(1_200);
    await expect(page.getByTestId("quick-buffer-seconds")).toHaveText(/4/);

    await page.waitForTimeout(3_000);
    expect(harness.postedBodies).toHaveLength(0);

    await page.waitForTimeout(1_400);
    await expect.poll(() => harness.postedBodies.length).toBe(1);
    await expect(page.getByTestId("quick-buffer-panel")).toBeHidden();

    expect(harness.postedBodies[0]).toEqual({
      exerciseId: EXERCISE_ID,
      reps: 1,
      source: "quickbutton",
    });
  });

  test("pauses the countdown for one second without resetting or stacking pauses", async ({ page }) => {
    const harness = await mountQuickButtons(page);

    await page.getByTestId("quick-button-plus-one").click();
    await page.waitForTimeout(2_100);
    await expect(page.getByTestId("quick-buffer-seconds")).toHaveText(/3/);

    await page.getByTestId("quick-button-plus-one").click();
    await page.waitForTimeout(200);
    await page.getByTestId("quick-button-plus-one").click();

    await expect(page.getByTestId("quick-buffer-value")).toHaveText("+3");
    await expect(page.getByTestId("quick-buffer-progress")).toBeVisible();
    await expect(page.getByTestId("quick-buffer-seconds")).toHaveText(/3/);

    await page.waitForTimeout(900);
    await expect(page.getByTestId("quick-buffer-seconds")).toHaveText(/3/);

    await page.waitForTimeout(1_000);
    await expect(page.getByTestId("quick-buffer-seconds")).toHaveText(/2/);
    expect(harness.postedBodies).toHaveLength(0);

    await page.waitForTimeout(2_400);
    await expect.poll(() => harness.postedBodies.length).toBe(1);
    expect(harness.postedBodies[0]?.reps).toBe(3);
  });

  test("pauses the countdown for one second when correcting with -1", async ({ page }) => {
    const harness = await mountQuickButtons(page);

    await page.getByTestId("quick-button-plus-one").click();
    await page.getByTestId("quick-button-plus-one").click();
    await page.getByTestId("quick-button-plus-one").click();
    await page.waitForTimeout(2_100);
    await expect(page.getByTestId("quick-buffer-seconds")).toHaveText(/3/);

    await page.getByTestId("quick-button-minus-one").click();

    await expect(page.getByTestId("quick-buffer-value")).toHaveText("+2");
    await expect(page.getByTestId("quick-buffer-progress")).toBeVisible();
    await expect(page.getByTestId("quick-buffer-seconds")).toHaveText(/3/);

    await page.waitForTimeout(900);
    await expect(page.getByTestId("quick-buffer-seconds")).toHaveText(/3/);

    await page.waitForTimeout(2_900);
    expect(harness.postedBodies).toHaveLength(0);

    await page.waitForTimeout(1_300);
    await expect.poll(() => harness.postedBodies.length).toBe(1);
    expect(harness.postedBodies[0]?.reps).toBe(2);
  });

  test("cancels the pending buffer without creating a set", async ({ page }) => {
    const harness = await mountQuickButtons(page);

    await page.getByTestId("quick-button-plus-one").click();
    await expect(page.getByTestId("quick-buffer-panel")).toBeVisible();

    await page.getByTestId("quick-buffer-cancel").click();
    await expect(page.getByTestId("quick-buffer-panel")).toBeHidden();

    await page.waitForTimeout(5_300);
    expect(harness.postedBodies).toHaveLength(0);
  });

  test("does not submit when the buffer is corrected back to zero", async ({ page }) => {
    const harness = await mountQuickButtons(page, { historyReps: [] });

    await expect(page.getByTestId("quick-button-minus-one")).toBeDisabled();
    await page.getByTestId("quick-button-plus-one").click();
    await expect(page.getByTestId("quick-button-minus-one")).toBeEnabled();
    await page.getByTestId("quick-button-minus-one").click();

    await expect(page.getByTestId("quick-buffer-panel")).toBeVisible();
    await expect(page.getByTestId("quick-buffer-value")).toHaveText("+0");

    await page.waitForTimeout(5_300);
    expect(harness.postedBodies).toHaveLength(0);
  });

  test("rejects values above one hundred without starting the buffer", async ({ page }) => {
    const harness = await mountQuickButtons(page, { historyReps: [99, 99, 99] });

    await page.getByTestId("quick-button-plus-101").click();

    await expect(page.getByText(/0 до 100/)).toBeVisible();
    await expect(page.getByTestId("quick-buffer-panel")).toBeHidden();
    expect(harness.postedBodies).toHaveLength(0);
  });
});
