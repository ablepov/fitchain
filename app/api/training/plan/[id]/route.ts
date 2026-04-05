import { NextRequest } from "next/server";
import { z } from "zod";
import { jsonError, jsonSuccess, readJsonSafely } from "@/lib/api";
import {
  databaseCapabilityKeys,
  isCapabilityUnavailable,
  isMissingRelationError,
  markCapabilityAvailable,
  markCapabilityUnavailable,
  SCHEDULE_FEATURE_UNAVAILABLE_MESSAGE,
} from "@/lib/databaseCapabilities";
import {
  applyMockStateCookies,
  getMockSchedule,
  isE2EMockMode,
  isMockPlannerDisabled,
} from "@/lib/e2eMock";
import { getAuthenticatedRouteContext } from "@/lib/supabaseServer";

const patchSchema = z
  .object({
    weekday: z.number().int().min(0).max(6).optional(),
    position: z.number().int().min(0).optional(),
  })
  .refine((value) => value.weekday !== undefined || value.position !== undefined, {
    message: "weekday or position is required",
  });

async function resolveParams(
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  return "then" in context.params ? await context.params : context.params;
}

function getNextPosition(scheduleRows: Array<{ id: string; weekday: number; position: number }>, weekday: number) {
  const sameDayRows = scheduleRows.filter((row) => row.weekday === weekday);
  if (sameDayRows.length === 0) {
    return 0;
  }

  return Math.max(...sameDayRows.map((row) => row.position)) + 1;
}

function jsonPlannerUnavailable() {
  return jsonError(503, "FEATURE_UNAVAILABLE", SCHEDULE_FEATURE_UNAVAILABLE_MESSAGE);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
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

  const params = await resolveParams(context);

  if (isE2EMockMode()) {
    if (isMockPlannerDisabled(req.cookies)) {
      return jsonPlannerUnavailable();
    }

    const schedule = getMockSchedule(req.cookies);
    const currentRow = schedule.find((row) => row.id === params.id);

    if (!currentRow) {
      return jsonError(404, "NOT_FOUND", "Plan item not found");
    }

    const nextWeekday = parsed.data.weekday ?? currentRow.weekday;
    const nextPosition =
      parsed.data.position ??
      (nextWeekday === currentRow.weekday
        ? currentRow.position
        : getNextPosition(
            schedule.filter((row) => row.id !== params.id),
            nextWeekday
          ));

    const updatedRow = {
      ...currentRow,
      weekday: nextWeekday,
      position: nextPosition,
    };

    const response = jsonSuccess(updatedRow);
    applyMockStateCookies(response, {
      plan: schedule.map((row) => (row.id === params.id ? updatedRow : row)),
    });
    return response;
  }

  const { supabase, userId } = await getAuthenticatedRouteContext(req);
  if (!userId) {
    return jsonError(401, "UNAUTHORIZED", "No session");
  }

  if (isCapabilityUnavailable(databaseCapabilityKeys.exerciseScheduleTable)) {
    return jsonPlannerUnavailable();
  }

  const { data: currentRow, error: currentError } = await supabase
    .from("exercise_schedule")
    .select("id, exercise_id, weekday, position")
    .eq("id", params.id)
    .eq("user_id", userId)
    .maybeSingle();

  if (currentError) {
    if (isMissingRelationError(currentError)) {
      markCapabilityUnavailable(databaseCapabilityKeys.exerciseScheduleTable);
      return jsonPlannerUnavailable();
    }

    return jsonError(500, "INTERNAL_ERROR", currentError.message);
  }

  if (!currentRow) {
    return jsonError(404, "NOT_FOUND", "Plan item not found");
  }

  const { data: allRows, error: allRowsError } = await supabase
    .from("exercise_schedule")
    .select("id, exercise_id, weekday, position")
    .eq("user_id", userId);

  if (allRowsError) {
    if (isMissingRelationError(allRowsError)) {
      markCapabilityUnavailable(databaseCapabilityKeys.exerciseScheduleTable);
      return jsonPlannerUnavailable();
    }

    return jsonError(500, "INTERNAL_ERROR", allRowsError.message);
  }

  markCapabilityAvailable(databaseCapabilityKeys.exerciseScheduleTable);

  const nextWeekday = parsed.data.weekday ?? currentRow.weekday;
  const nextPosition =
    parsed.data.position ??
    (nextWeekday === currentRow.weekday
      ? currentRow.position
      : getNextPosition((allRows ?? []).filter((row) => row.id !== params.id), nextWeekday));

  const duplicateRow = (allRows ?? []).find(
    (row) =>
      row.id !== params.id &&
      row.weekday === nextWeekday &&
      row.exercise_id === currentRow.exercise_id
  );

  if (duplicateRow) {
    return jsonError(409, "CONFLICT", "Exercise already scheduled for this day");
  }

  const { data, error } = await supabase
    .from("exercise_schedule")
    .update({
      weekday: nextWeekday,
      position: nextPosition,
    })
    .eq("id", params.id)
    .eq("user_id", userId)
    .select("id, exercise_id, weekday, position, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return jsonError(409, "CONFLICT", "Exercise already scheduled for this day");
    }

    if (isMissingRelationError(error)) {
      markCapabilityUnavailable(databaseCapabilityKeys.exerciseScheduleTable);
      return jsonPlannerUnavailable();
    }

    return jsonError(500, "INTERNAL_ERROR", error.message);
  }

  return jsonSuccess(data);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  const params = await resolveParams(context);

  if (isE2EMockMode()) {
    if (isMockPlannerDisabled(req.cookies)) {
      return jsonPlannerUnavailable();
    }

    const schedule = getMockSchedule(req.cookies);
    const currentRow = schedule.find((row) => row.id === params.id);

    if (!currentRow) {
      return jsonError(404, "NOT_FOUND", "Plan item not found");
    }

    const response = jsonSuccess({ id: params.id });
    applyMockStateCookies(response, {
      plan: schedule.filter((row) => row.id !== params.id),
    });
    return response;
  }

  const { supabase, userId } = await getAuthenticatedRouteContext(req);
  if (!userId) {
    return jsonError(401, "UNAUTHORIZED", "No session");
  }

  if (isCapabilityUnavailable(databaseCapabilityKeys.exerciseScheduleTable)) {
    return jsonPlannerUnavailable();
  }

  const { data, error } = await supabase
    .from("exercise_schedule")
    .delete()
    .eq("id", params.id)
    .eq("user_id", userId)
    .select("id")
    .single();

  if (error) {
    if (isMissingRelationError(error)) {
      markCapabilityUnavailable(databaseCapabilityKeys.exerciseScheduleTable);
      return jsonPlannerUnavailable();
    }

    return jsonError(500, "INTERNAL_ERROR", error.message);
  }

  markCapabilityAvailable(databaseCapabilityKeys.exerciseScheduleTable);

  if (!data) {
    return jsonError(404, "NOT_FOUND", "Plan item not found");
  }

  return jsonSuccess({ id: params.id });
}
