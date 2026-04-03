import { NextRequest } from "next/server";
import { z } from "zod";
import { jsonError, jsonSuccess, readJsonSafely } from "@/lib/api";
import { getAuthenticatedRouteContext } from "@/lib/supabaseServer";

export const runtime = "edge";

const exerciseNameSchema = z
  .string()
  .min(2)
  .max(100)
  .regex(/^[\p{L}\p{N}\s]+$/u, "Exercise name can contain only letters, numbers, and spaces");

const postSchema = z.object({
  exerciseId: z.string().uuid().optional(),
  exercise: exerciseNameSchema.optional(),
  reps: z.number().int().min(1).max(1000),
  note: z.string().max(500).optional(),
  source: z.enum(["manual", "quickbutton"]).default("quickbutton"),
});

async function resolveOwnedExerciseId(
  userId: string,
  supabase: Awaited<ReturnType<typeof getAuthenticatedRouteContext>>["supabase"],
  params: { exerciseId?: string; exercise?: string }
) {
  if (params.exerciseId) {
    const { data: exercise, error } = await supabase
      .from("exercises")
      .select("id")
      .eq("id", params.exerciseId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return { error };
    }

    if (!exercise) {
      return { error: new Error("Exercise not found") };
    }

    return { exerciseId: exercise.id };
  }

  if (!params.exercise) {
    return { exerciseId: undefined };
  }

  const { data: exercise, error } = await supabase
    .from("exercises")
    .select("id")
    .eq("user_id", userId)
    .ilike("type", params.exercise)
    .maybeSingle();

  if (error) {
    return { error };
  }

  if (!exercise) {
    return { error: new Error("Exercise not found") };
  }

  return { exerciseId: exercise.id };
}

export async function GET(req: NextRequest) {
  const { supabase, userId } = await getAuthenticatedRouteContext(req);
  if (!userId) {
    return jsonError(401, "UNAUTHORIZED", "No session");
  }

  const url = new URL(req.url);
  const exercise = url.searchParams.get("exercise")?.trim() || undefined;
  const exerciseIdParam = url.searchParams.get("exerciseId") || undefined;
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10) || 50, 500);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const resolvedExercise = await resolveOwnedExerciseId(userId, supabase, {
    exerciseId: exerciseIdParam,
    exercise,
  });

  if (resolvedExercise.error) {
    const message = resolvedExercise.error.message === "Exercise not found"
      ? "Exercise not found"
      : resolvedExercise.error.message;
    const status = message === "Exercise not found" ? 404 : 500;
    const code = status === 404 ? "NOT_FOUND" : "INTERNAL_ERROR";
    return jsonError(status, code, message);
  }

  let query = supabase
    .from("sets")
    .select("id, exercise_id, reps, created_at, note, source")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (resolvedExercise.exerciseId) {
    query = query.eq("exercise_id", resolvedExercise.exerciseId);
  }

  if (from) {
    query = query.gte("created_at", from);
  }

  if (to) {
    query = query.lte("created_at", to);
  }

  const { data, error } = await query;
  if (error) {
    return jsonError(500, "INTERNAL_ERROR", error.message);
  }

  return jsonSuccess(data ?? []);
}

export async function POST(req: NextRequest) {
  const { supabase, userId } = await getAuthenticatedRouteContext(req);
  if (!userId) {
    return jsonError(401, "UNAUTHORIZED", "No session");
  }

  const body = await readJsonSafely<unknown>(req);
  if (!body) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid JSON body");
  }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid body");
  }

  if (!parsed.data.exerciseId && !parsed.data.exercise) {
    return jsonError(400, "VALIDATION_ERROR", "exerciseId or exercise is required");
  }

  const resolvedExercise = await resolveOwnedExerciseId(userId, supabase, {
    exerciseId: parsed.data.exerciseId,
    exercise: parsed.data.exercise?.trim(),
  });

  if (resolvedExercise.error || !resolvedExercise.exerciseId) {
    const message = resolvedExercise.error?.message ?? "Exercise not found";
    const status = message === "Exercise not found" ? 404 : 500;
    const code = status === 404 ? "NOT_FOUND" : "INTERNAL_ERROR";
    return jsonError(status, code, message);
  }

  const note = parsed.data.note?.trim();

  const { data, error } = await supabase
    .from("sets")
    .insert({
      exercise_id: resolvedExercise.exerciseId,
      reps: parsed.data.reps,
      note: note ? note : null,
      source: parsed.data.source,
    })
    .select("id, exercise_id, reps, created_at, note, source")
    .single();

  if (error?.code === "42501") {
    return jsonError(403, "FORBIDDEN", error.message);
  }

  if (error) {
    return jsonError(500, "INTERNAL_ERROR", error.message);
  }

  return jsonSuccess(data, { status: 201 });
}
