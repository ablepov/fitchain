import { NextRequest } from "next/server";
import { z } from "zod";
import { jsonError, jsonSuccess, readJsonSafely } from "@/lib/api";
import { applyMockStateCookies, E2E_MOCK_TIMEZONE, isE2EMockMode } from "@/lib/e2eMock";
import { getAuthenticatedRouteContext } from "@/lib/supabaseServer";

const patchSchema = z.object({
  timezone: z.string().trim().min(1).max(100),
});

export async function PATCH(req: NextRequest) {
  const body = await readJsonSafely<unknown>(req);
  if (!body) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid JSON body");
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      400,
      "VALIDATION_ERROR",
      parsed.error.issues.map((issue) => issue.message).join(", ")
    );
  }

  const timezone = parsed.data.timezone || E2E_MOCK_TIMEZONE;

  if (isE2EMockMode()) {
    const response = jsonSuccess({ timezone });
    applyMockStateCookies(response, { timezone });
    return response;
  }

  const { supabase, userId } = await getAuthenticatedRouteContext(req);
  if (!userId) {
    return jsonError(401, "UNAUTHORIZED", "No session");
  }

  const { error } = await supabase.from("profiles").upsert({
    user_id: userId,
    timezone,
  });

  if (error) {
    return jsonError(500, "INTERNAL_ERROR", error.message);
  }

  return jsonSuccess({ timezone });
}
