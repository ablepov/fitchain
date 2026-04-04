import { NextRequest } from "next/server";
import { z } from "zod";
import { jsonError, jsonSuccess, readJsonSafely } from "@/lib/api";
import {
  applyMockStateCookies,
  getMockExercises,
  getMockSchedule,
  getMockSets,
  isE2EMockMode,
} from "@/lib/e2eMock";
import { getAuthenticatedRouteContext } from "@/lib/supabaseServer";

const patchSchema = z.object({
  type: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[\p{L}\p{N}\s]+$/u, "Exercise name can contain only letters, numbers, and spaces"),
  goal: z.number().int().min(1).max(10000),
});

async function resolveParams(
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  return "then" in context.params ? await context.params : context.params;
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  const params = await resolveParams(context);

  if (isE2EMockMode()) {
    const currentExercises = getMockExercises(req.cookies);
    const exercise = currentExercises.find((item) => item.id === params.id);

    if (!exercise) {
      return jsonError(404, "NOT_FOUND", "Exercise not found");
    }

    const response = jsonSuccess({ id: params.id, type: exercise.type });
    applyMockStateCookies(response, {
      exercises: currentExercises.filter((item) => item.id !== params.id),
      sets: getMockSets(req.cookies).filter((item) => item.exercise_id !== params.id),
      plan: getMockSchedule(req.cookies).filter((item) => item.exercise_id !== params.id),
    });
    return response;
  }

  const { supabase, userId } = await getAuthenticatedRouteContext(req);
  if (!userId) {
    return jsonError(401, "UNAUTHORIZED", "No session");
  }

  const { data: exercise, error: getError } = await supabase
    .from("exercises")
    .select("id, type")
    .eq("id", params.id)
    .eq("user_id", userId)
    .single();

  if (getError || !exercise) {
    return jsonError(404, "NOT_FOUND", "Exercise not found");
  }

  const { error: deleteScheduleError } = await supabase
    .from("exercise_schedule")
    .delete()
    .eq("exercise_id", params.id)
    .eq("user_id", userId);

  if (deleteScheduleError && deleteScheduleError.code !== "42P01") {
    return jsonError(500, "INTERNAL_ERROR", deleteScheduleError.message);
  }

  const { error: deleteError } = await supabase
    .from("exercises")
    .delete()
    .eq("id", params.id)
    .eq("user_id", userId);

  if (deleteError) {
    return jsonError(500, "INTERNAL_ERROR", deleteError.message);
  }

  return jsonSuccess({ id: params.id, type: exercise.type });
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  return PATCH(req, context);
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
  const normalizedType = parsed.data.type.trim();

  if (isE2EMockMode()) {
    const currentExercises = getMockExercises(req.cookies);
    const currentExercise = currentExercises.find((item) => item.id === params.id);

    if (!currentExercise) {
      return jsonError(404, "NOT_FOUND", "Exercise not found");
    }

    const duplicate = currentExercises.some(
      (item) => item.id !== params.id && item.type.toLowerCase() === normalizedType.toLowerCase()
    );

    if (duplicate) {
      return jsonError(409, "CONFLICT", "Exercise already exists");
    }

    const updatedExercise = {
      ...currentExercise,
      type: normalizedType,
      goal: parsed.data.goal,
    };

    const response = jsonSuccess(updatedExercise);
    applyMockStateCookies(response, {
      exercises: currentExercises.map((item) => (item.id === params.id ? updatedExercise : item)),
    });
    return response;
  }

  const { supabase, userId } = await getAuthenticatedRouteContext(req);
  if (!userId) {
    return jsonError(401, "UNAUTHORIZED", "No session");
  }

  const { data, error } = await supabase
    .from("exercises")
    .update({
      type: normalizedType,
      goal: parsed.data.goal,
    })
    .eq("id", params.id)
    .eq("user_id", userId)
    .select("id, type, goal, created_at")
    .single();

  if (error?.code === "23505") {
    return jsonError(409, "CONFLICT", "Exercise already exists");
  }

  if (error) {
    return jsonError(500, "INTERNAL_ERROR", error.message);
  }

  if (!data) {
    return jsonError(404, "NOT_FOUND", "Exercise not found");
  }

  return jsonSuccess(data);
}
