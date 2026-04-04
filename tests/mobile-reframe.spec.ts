import { expect, test, type Locator, type Page } from "@playwright/test";

const WEEKDAY_LABELS_RU = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] as const;
const WEEKDAY_NAME_TO_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});

async function swipeLeft(page: Page, viewport: Locator) {
  const box = await viewport.boundingBox();
  if (!box) {
    throw new Error("Carousel viewport is not visible");
  }

  const y = box.y + box.height * 0.5;

  await page.mouse.move(box.x + box.width * 0.82, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.18, y, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(250);
}

function getAlternateWeekdayLabel() {
  const weekdayName = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Moscow",
    weekday: "short",
  }).format(new Date());
  const currentIndex = WEEKDAY_NAME_TO_INDEX[weekdayName] ?? 0;
  const alternateIndex = (currentIndex + 1) % 7;

  return WEEKDAY_LABELS_RU[alternateIndex];
}

test("today carousel loops and keeps mobile navigation visible", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("navigation", { name: "Основная навигация" })).toBeVisible();
  await expect(page.getByTestId("carousel-exercise-card").first()).toBeVisible();

  const viewport = page.getByTestId("home-carousel-viewport");

  await swipeLeft(page, viewport);
  await expect(page.getByTestId("today-add-exercise")).toBeVisible();

  await swipeLeft(page, viewport);
  await expect(page.getByText("pushups").first()).toBeVisible();
});

test("terminal add card creates a new exercise slide", async ({ page }) => {
  await page.goto("/");

  const viewport = page.getByTestId("home-carousel-viewport");
  await swipeLeft(page, viewport);
  await page.getByTestId("today-add-exercise").click();

  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Название").fill("Burpees");
  await dialog.getByLabel("Цель на день").fill("60");
  await dialog.getByRole("button", { name: "Создать упражнение" }).click();

  await expect(page.getByText("Упражнение создано")).toBeVisible();

  await swipeLeft(page, viewport);
  await expect(page.getByText("Burpees")).toBeVisible();
});

test("exercise action sheet edits and deletes a card", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Открыть действия" }).first().click();

  let dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Редактировать" }).click();

  dialog = page.getByRole("dialog");
  await dialog.getByLabel("Название").fill("Rows");
  await dialog.getByLabel("Цель на день").fill("40");
  await dialog.getByRole("button", { name: "Сохранить изменения" }).click();

  await expect(page.getByText("Rows")).toBeVisible();

  await page.getByRole("button", { name: "Открыть действия" }).first().click();
  page.once("dialog", (popup) => popup.accept());
  await page.getByRole("dialog").getByRole("button", { name: "Удалить упражнение" }).click();

  await expect(page.getByText("Упражнение удалено")).toBeVisible();
  await expect(page.getByTestId("today-add-exercise")).toBeVisible();
});

test("week planner adds and removes an assignment on another weekday", async ({ page }) => {
  const alternateDayLabel = getAlternateWeekdayLabel();

  await page.goto("/?mode=week");

  await page.getByRole("button", { name: alternateDayLabel, exact: true }).click();
  await expect(page.getByText("День пока пустой")).toBeVisible();

  await page.getByRole("button", { name: "Добавить на день" }).click();
  await page.getByRole("dialog").getByRole("button", { name: /pushups/i }).click();

  await expect(page.getByRole("button", { name: "Открыть действия" }).first()).toBeVisible();

  await page.getByRole("button", { name: "Открыть действия" }).first().click();
  await page.getByRole("dialog").getByRole("button", { name: "Убрать из этого дня" }).click();

  await expect(page.getByText("День пока пустой")).toBeVisible();
});

test("stats hub, dashboard redirect, and profile timezone flow work end to end", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/stats$/);

  await expect(page.getByText("Сводка по вашему ритму")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Сегодня", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Неделя", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Месяц", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Все время", exact: true })).toBeVisible();

  await page.getByRole("link", { name: "Профиль" }).click();
  await expect(page).toHaveURL(/\/profile$/);

  await page.locator("#profile-timezone").selectOption("UTC");
  await page.getByRole("button", { name: "Сохранить таймзону" }).click();
  await expect(page.getByText(/сохран/i)).toBeVisible();
});
