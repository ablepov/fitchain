"use server";

import { redirect } from "next/navigation";
import { requireAppSession } from "@/lib/appSession";
import { E2E_MOCK_TIMEZONE, isE2EMockMode } from "@/lib/e2eMock";

function createRedirectUrl(message: string, isError = false) {
  const params = new URLSearchParams({
    [isError ? "error" : "message"]: message,
  });

  return `/stats?${params.toString()}`;
}

export async function saveDashboardTimezoneAction(formData: FormData) {
  const timezone = String(formData.get("timezone") ?? "").trim() || E2E_MOCK_TIMEZONE;

  if (isE2EMockMode()) {
    redirect(createRedirectUrl("Таймзона сохранена"));
  }

  const session = await requireAppSession();
  if (session.isMock) {
    redirect(createRedirectUrl("Таймзона сохранена"));
  }

  const { error } = await session.supabase.from("profiles").upsert({
    user_id: session.user.id,
    timezone,
  });

  if (error) {
    redirect(createRedirectUrl(`Ошибка: ${error.message}`, true));
  }

  redirect(createRedirectUrl("Таймзона сохранена"));
}
