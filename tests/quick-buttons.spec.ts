import { expect, test, type Page } from "@playwright/test";

const EXERCISE_ID = "11111111-1111-1111-1111-111111111111";

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

  await page.context().addCookies([
    {
      name: "e2e-history",
      value: historyReps.length > 0 ? historyReps.join(",") : "__empty__",
      url: "http://127.0.0.1:3100",
    },
  ]);

  await page.route("**/api/sets", async (route) => {
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

  test("restarts the one-second pause from the last click without resetting the main timer", async ({ page }) => {
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

    await page.waitForTimeout(400);
    await expect(page.getByTestId("quick-buffer-seconds")).toHaveText(/2/);
    expect(harness.postedBodies).toHaveLength(0);

    await page.waitForTimeout(2_900);
    await expect.poll(() => harness.postedBodies.length).toBe(1);
    expect(harness.postedBodies[0]?.reps).toBe(3);
  });

  test("restarts the pause on each -1 so several quick corrections are possible", async ({ page }) => {
    const harness = await mountQuickButtons(page, { historyReps: [8, 8, 8] });

    await page.getByTestId("quick-button-plus-8").click();
    await page.waitForTimeout(3_100);
    await expect(page.getByTestId("quick-buffer-seconds")).toHaveText(/2/);

    await page.getByTestId("quick-button-minus-one").click();
    await expect(page.getByTestId("quick-buffer-value")).toHaveText("+7");
    await expect(page.getByTestId("quick-buffer-seconds")).toHaveText(/2/);

    await page.waitForTimeout(700);
    await page.getByTestId("quick-button-minus-one").click();
    await expect(page.getByTestId("quick-buffer-value")).toHaveText("+6");
    await expect(page.getByTestId("quick-buffer-seconds")).toHaveText(/2/);

    await page.waitForTimeout(700);
    await page.getByTestId("quick-button-minus-one").click();
    await expect(page.getByTestId("quick-buffer-value")).toHaveText("+5");
    await expect(page.getByTestId("quick-buffer-seconds")).toHaveText(/2/);

    await page.waitForTimeout(800);
    await expect(page.getByTestId("quick-buffer-seconds")).toHaveText(/2/);

    await page.waitForTimeout(500);
    await expect(page.getByTestId("quick-buffer-seconds")).toHaveText(/2/);
    expect(harness.postedBodies).toHaveLength(0);

    await page.waitForTimeout(2_100);
    await expect.poll(() => harness.postedBodies.length).toBe(1);
    expect(harness.postedBodies[0]?.reps).toBe(5);
  });

  test("keeps variant B behavior when the buffer is corrected back to zero", async ({ page }) => {
    const harness = await mountQuickButtons(page);

    await page.getByTestId("quick-button-plus-one").click();
    await page.getByTestId("quick-button-minus-one").click();

    await expect(page.getByTestId("quick-buffer-panel")).toBeVisible();
    await expect(page.getByTestId("quick-buffer-value")).toHaveText("+0");
    await expect(page.getByTestId("quick-buffer-progress")).toBeHidden();

    await page.waitForTimeout(5_300);
    expect(harness.postedBodies).toHaveLength(0);

    await page.getByTestId("quick-button-plus-one").click();
    await expect(page.getByTestId("quick-buffer-seconds")).toHaveText(/5/);
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

  test("does not submit when the buffer is corrected back to zero from an empty day", async ({ page }) => {
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
