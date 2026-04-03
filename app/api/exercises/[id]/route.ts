import { NextRequest } from "next/server";
import { z } from "zod";
import { jsonError, jsonSuccess, readJsonSafely } from "@/lib/api";
import { isE2EMockMode } from "@/lib/e2eMock";
import { getAuthenticatedRouteContext } from "@/lib/supabaseServer";

const putSchema = z.object({
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
    return jsonSuccess({ id: params.id, type: "mock exercise" });
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

  const { data: sets, error: setsError } = await supabase
    .from("sets")
    .select("id")
    .eq("exercise_id", params.id)
    .limit(1);

  if (setsError) {
    return jsonError(500, "INTERNAL_ERROR", setsError.message);
  }

  if ((sets ?? []).length > 0) {
    return jsonError(409, "CONFLICT", "Delete exercise sets before deleting the exercise");
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

  const parsed = putSchema.safeParse(body);
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
    return jsonSuccess({
      id: params.id,
      type: normalizedType,
      goal: parsed.data.goal,
      created_at: new Date().toISOString(),
    });
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
