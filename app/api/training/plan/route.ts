import { NextRequest } from "next/server";
import { z } from "zod";
import { jsonError, jsonSuccess, readJsonSafely } from "@/lib/api";
import {
  applyMockStateCookies,
  getMockExercises,
  getMockSchedule,
  isE2EMockMode,
} from "@/lib/e2eMock";
import { getSessionSnapshot } from "@/lib/sessionData";
import { getWeeklyPlan } from "@/lib/trainingData";
import { getAuthenticatedRouteContext } from "@/lib/supabaseServer";

const postSchema = z.object({
  exerciseId: z.string().uuid(),
  weekday: z.number().int().min(0).max(6),
  position: z.number().int().min(0).optional(),
});

function getNextPosition(scheduleRows: Array<{ weekday: number; position: number }>, weekday: number) {
  const sameDayRows = scheduleRows.filter((row) => row.weekday === weekday);
  if (sameDayRows.length === 0) {
    return 0;
  }

  return Math.max(...sameDayRows.map((row) => row.position)) + 1;
}

export async function GET() {
  const session = await getSessionSnapshot();

  if (!session.isAuthenticated) {
    return jsonError(401, "UNAUTHORIZED", "No session");
  }

  return jsonSuccess(await getWeeklyPlan());
}

export async function POST(req: NextRequest) {
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

  if (isE2EMockMode()) {
    const exercises = getMockExercises(req.cookies);
    const schedule = getMockSchedule(req.cookies);
    const exercise = exercises.find((item) => item.id === parsed.data.exerciseId);

    if (!exercise) {
      return jsonError(404, "NOT_FOUND", "Exercise not found");
    }

    const duplicate = schedule.find(
      (item) => item.exercise_id === parsed.data.exerciseId && item.weekday === parsed.data.weekday
    );
    if (duplicate) {
      return jsonError(409, "CONFLICT", "Exercise already scheduled for this day");
    }

    const createdRow = {
      id: crypto.randomUUID(),
      exercise_id: parsed.data.exerciseId,
      weekday: parsed.data.weekday,
      position: parsed.data.position ?? getNextPosition(schedule, parsed.data.weekday),
      created_at: new Date().toISOString(),
    };

    const response = jsonSuccess(createdRow, { status: 201 });
    applyMockStateCookies(response, {
      plan: [...schedule, createdRow],
    });
    return response;
  }

  const { supabase, userId } = await getAuthenticatedRouteContext(req);
  if (!userId) {
    return jsonError(401, "UNAUTHORIZED", "No session");
  }

  const { data: exercise, error: exerciseError } = await supabase
    .from("exercises")
    .select("id")
    .eq("id", parsed.data.exerciseId)
    .eq("user_id", userId)
    .maybeSingle();

  if (exerciseError) {
    return jsonError(500, "INTERNAL_ERROR", exerciseError.message);
  }

  if (!exercise) {
    return jsonError(404, "NOT_FOUND", "Exercise not found");
  }

  const { data: existingRows, error: existingError } = await supabase
    .from("exercise_schedule")
    .select("id, exercise_id, weekday, position")
    .eq("user_id", userId);

  if (existingError) {
    if (existingError.code === "42P01") {
      return jsonError(500, "INTERNAL_ERROR", "exercise_schedule table is missing");
    }

    return jsonError(500, "INTERNAL_ERROR", existingError.message);
  }

  const duplicate = (existingRows ?? []).some(
    (row) => row.weekday === parsed.data.weekday && row.exercise_id === parsed.data.exerciseId
  );

  if (duplicate) {
    return jsonError(409, "CONFLICT", "Exercise already scheduled for this day");
  }

  const position =
    parsed.data.position ??
    getNextPosition(
      (existingRows ?? []).map((row) => ({
        weekday: row.weekday,
        position: row.position,
      })),
      parsed.data.weekday
    );

  const { data, error } = await supabase
    .from("exercise_schedule")
    .insert({
      user_id: userId,
      exercise_id: parsed.data.exerciseId,
      weekday: parsed.data.weekday,
      position,
    })
    .select("id, exercise_id, weekday, position, created_at")
    .single();

  if (error?.code === "23505") {
    return jsonError(409, "CONFLICT", "Exercise already scheduled for this day");
  }

  if (error) {
    return jsonError(500, "INTERNAL_ERROR", error.message);
  }

  return jsonSuccess(data, { status: 201 });
}
