import type { RequestCookies, ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";

export const E2E_MOCK_EXERCISE_ID = "11111111-1111-1111-1111-111111111111";
export const E2E_MOCK_USER_ID = "22222222-2222-4222-8222-222222222222";
export const E2E_MOCK_USER_EMAIL = "tester@example.com";
export const E2E_MOCK_TIMEZONE = "Europe/Moscow";

type CookieStoreLike =
  | Pick<RequestCookies, "get">
  | Pick<ResponseCookies, "get">
  | { get(name: string): { value: string } | undefined };

export function isE2EMockMode() {
  return process.env.E2E_MOCK_MODE === "1";
}

export function getMockUser() {
  return {
    id: E2E_MOCK_USER_ID,
    email: E2E_MOCK_USER_EMAIL,
  };
}

export function getMockExercise() {
  return {
    id: E2E_MOCK_EXERCISE_ID,
    type: "pushups",
    goal: 100,
  };
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
