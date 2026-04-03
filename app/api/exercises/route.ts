import { NextRequest } from "next/server";
import { z } from "zod";
import { jsonError, jsonSuccess, readJsonSafely } from "@/lib/api";
import { getAuthenticatedRouteContext } from "@/lib/supabaseServer";

export const runtime = "edge";

const postSchema = z.object({
  type: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[\p{L}\p{N}\s]+$/u, "Exercise name can contain only letters, numbers, and spaces"),
  goal: z.number().int().min(1).max(10000),
});

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
    return jsonError(
      400,
      "VALIDATION_ERROR",
      parsed.error.issues.map((issue) => issue.message).join(", ")
    );
  }

  const normalizedType = parsed.data.type.trim();

  const { data: existingExercise, error: checkError } = await supabase
    .from("exercises")
    .select("id")
    .eq("user_id", userId)
    .ilike("type", normalizedType)
    .maybeSingle();

  if (checkError) {
    return jsonError(500, "INTERNAL_ERROR", checkError.message);
  }

  if (existingExercise) {
    return jsonError(409, "CONFLICT", "Exercise already exists");
  }

  const { data, error } = await supabase
    .from("exercises")
    .insert({
      user_id: userId,
      type: normalizedType,
      goal: parsed.data.goal,
    })
    .select("id, type, goal, created_at")
    .single();

  if (error?.code === "23505") {
    return jsonError(409, "CONFLICT", "Exercise already exists");
  }

  if (error) {
    return jsonError(500, "INTERNAL_ERROR", error.message);
  }

  return jsonSuccess(data, { status: 201 });
}
