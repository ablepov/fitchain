import { expect, test, type Locator, type Page } from "@playwright/test";

const TODAY_EXERCISE_ID = "11111111-1111-4111-8111-111111111111";

test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});

function encodeCookie(value: unknown) {
  return encodeURIComponent(JSON.stringify(value));
}

function isoMinutesAgo(minutesAgo: number) {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

function isoDaysAgo(daysAgo: number, minuteOffset = 0) {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60_000 - minuteOffset * 60_000).toISOString();
}

function exerciseCard(page: Page, exerciseName: string) {
  return page.locator(
    `[data-testid="exercise-progress-card"][data-exercise-name="${exerciseName}"]`
  );
}

async function readCurrentTotal(card: Locator) {
  await expect(card.getByTestId("exercise-progress-current")).toBeVisible();
  return Number((await card.getByTestId("exercise-progress-current").innerText()).trim());
}

function installClientErrorTracker(page: Page) {
  const clientErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      if (/^Failed to load resource: the server responded with a status of \d+/.test(message.text())) {
        return;
      }

      clientErrors.push(`console: ${message.text()}`);
    }
  });

  page.on("pageerror", (error) => {
    clientErrors.push(`pageerror: ${error.message}`);
  });

  return async () => {
    expect(clientErrors, clientErrors.join("\n")).toEqual([]);
  };
}

test("single +6 commit on 34 total does not double after animation", async ({ page }) => {
  const assertNoClientErrors = installClientErrorTracker(page);

  await page.context().addCookies([
    {
      name: "e2e-exercises",
      value: encodeCookie([
        {
          id: TODAY_EXERCISE_ID,
          type: "Подтягивания",
          goal: 100,
          created_at: isoMinutesAgo(120),
        },
      ]),
      url: "http://127.0.0.1:3100",
    },
    {
      name: "e2e-sets",
      value: encodeCookie([
        {
          id: "set-1",
          exercise_id: TODAY_EXERCISE_ID,
          reps: 8,
          created_at: isoMinutesAgo(1),
          note: null,
          source: "quickbutton",
        },
        {
          id: "set-2",
          exercise_id: TODAY_EXERCISE_ID,
          reps: 8,
          created_at: isoMinutesAgo(2),
          note: null,
          source: "quickbutton",
        },
        {
          id: "set-3",
          exercise_id: TODAY_EXERCISE_ID,
          reps: 6,
          created_at: isoMinutesAgo(3),
          note: null,
          source: "quickbutton",
        },
        {
          id: "set-4",
          exercise_id: TODAY_EXERCISE_ID,
          reps: 6,
          created_at: isoMinutesAgo(4),
          note: null,
          source: "quickbutton",
        },
        {
          id: "set-5",
          exercise_id: TODAY_EXERCISE_ID,
          reps: 6,
          created_at: isoMinutesAgo(5),
          note: null,
          source: "quickbutton",
        },
      ]),
      url: "http://127.0.0.1:3100",
    },
  ]);

  await page.goto("/");

  const card = exerciseCard(page, "Подтягивания");
  await expect(card).toBeVisible();
  await expect.poll(() => readCurrentTotal(card)).toBe(34);

  await card.getByRole("button", { name: "+6", exact: true }).click();

  await expect.poll(() => readCurrentTotal(card), { timeout: 8_000 }).toBe(40);
  await assertNoClientErrors();
});

test("single quick add with zero current does not double after animation", async ({ page }) => {
  const assertNoClientErrors = installClientErrorTracker(page);

  await page.context().addCookies([
    {
      name: "e2e-exercises",
      value: encodeCookie([
        {
          id: TODAY_EXERCISE_ID,
          type: "Отжимания",
          goal: 100,
          created_at: isoMinutesAgo(120),
        },
      ]),
      url: "http://127.0.0.1:3100",
    },
    {
      name: "e2e-sets",
      value: encodeCookie([
        {
          id: "historic-1",
          exercise_id: TODAY_EXERCISE_ID,
          reps: 10,
          created_at: isoDaysAgo(1, 1),
          note: null,
          source: "quickbutton",
        },
        {
          id: "historic-2",
          exercise_id: TODAY_EXERCISE_ID,
          reps: 12,
          created_at: isoDaysAgo(1, 2),
          note: null,
          source: "quickbutton",
        },
        {
          id: "historic-3",
          exercise_id: TODAY_EXERCISE_ID,
          reps: 12,
          created_at: isoDaysAgo(1, 3),
          note: null,
          source: "quickbutton",
        },
      ]),
      url: "http://127.0.0.1:3100",
    },
  ]);

  await page.goto("/");

  const card = exerciseCard(page, "Отжимания");
  await expect(card).toBeVisible();
  await expect.poll(() => readCurrentTotal(card)).toBe(0);

  await card.getByRole("button", { name: "+12", exact: true }).click();

  await expect.poll(() => readCurrentTotal(card), { timeout: 8_000 }).toBe(12);
  await assertNoClientErrors();
});
