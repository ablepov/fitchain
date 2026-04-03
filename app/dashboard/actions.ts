"use server";

import { redirect } from "next/navigation";
import { requireAppSession } from "@/lib/appSession";
import { E2E_MOCK_TIMEZONE, isE2EMockMode } from "@/lib/e2eMock";

function createRedirectUrl(message: string, isError = false) {
  const params = new URLSearchParams({
    [isError ? "error" : "message"]: message,
  });

  return `/dashboard?${params.toString()}`;
}

export async function saveDashboardTimezoneAction(formData: FormData) {
  const timezone = String(formData.get("timezone") ?? "").trim() || E2E_MOCK_TIMEZONE;

  if (isE2EMockMode()) {
    redirect(createRedirectUrl("РўР°Р№РјР·РѕРЅР° СЃРѕС…СЂР°РЅРµРЅР°"));
  }

  const session = await requireAppSession();
  if (session.isMock) {
    redirect(createRedirectUrl("РўР°Р№РјР·РѕРЅР° СЃРѕС…СЂР°РЅРµРЅР°"));
  }

  const { error } = await session.supabase.from("profiles").upsert({
    user_id: session.user.id,
    timezone,
  });

  if (error) {
    redirect(createRedirectUrl(`РћС€РёР±РєР°: ${error.message}`, true));
  }

  redirect(createRedirectUrl("РўР°Р№РјР·РѕРЅР° СЃРѕС…СЂР°РЅРµРЅР°"));
}
