"use server";

import { requireAppSession } from "@/lib/appSession";
import { E2E_MOCK_TIMEZONE, isE2EMockMode } from "@/lib/e2eMock";

const EXERCISE_NAME_PATTERN = /^[\p{L}\p{N}\s]+$/u;

type ActionResult<T> =
  | { ok: true; message: string; data: T }
  | { ok: false; message: string };

function validateExerciseInput(type: string, goal: number) {
  const normalizedType = type.trim();

  if (!normalizedType) return "Название обязательно";
  if (normalizedType.length < 2) return "Название должно содержать минимум 2 символа";
  if (normalizedType.length > 100) return "Название не должно превышать 100 символов";
  if (!EXERCISE_NAME_PATTERN.test(normalizedType)) {
    return "Название может содержать только буквы, цифры и пробелы";
  }
  if (!Number.isFinite(goal) || goal <= 0) return "Цель должна быть числом больше 0";
  if (goal > 10_000) return "Цель не должна превышать 10000";

  return null;
}

export async function saveProfileTimezoneAction(timezone: string): Promise<ActionResult<{ timezone: string }>> {
  const normalizedTimezone = timezone.trim() || E2E_MOCK_TIMEZONE;

  if (isE2EMockMode()) {
    return {
      ok: true,
      message: "Таймзона сохранена",
      data: { timezone: normalizedTimezone },
    };
  }

  const session = await requireAppSession();
  if (session.isMock) {
    return {
      ok: true,
      message: "Таймзона сохранена",
      data: { timezone: normalizedTimezone },
    };
  }

  const { error } = await session.supabase.from("profiles").upsert({
    user_id: session.user.id,
    timezone: normalizedTimezone,
  });

  if (error) {
    return {
      ok: false,
      message: `Ошибка: ${error.message}`,
    };
  }

  return {
    ok: true,
    message: "Таймзона сохранена",
    data: { timezone: normalizedTimezone },
  };
}

export async function createExerciseAction(input: {
  type: string;
  goal: number;
}): Promise<ActionResult<{ id: string; type: string; goal: number }>> {
  const normalizedType = input.type.trim();
  const validationError = validateExerciseInput(normalizedType, input.goal);

  if (validationError) {
    return {
      ok: false,
      message: validationError,
    };
  }

  if (isE2EMockMode()) {
    return {
      ok: true,
      message: `Упражнение "${normalizedType}" создано`,
      data: {
        id: crypto.randomUUID(),
        type: normalizedType,
        goal: input.goal,
      },
    };
  }

  const session = await requireAppSession();
  if (session.isMock) {
    return {
      ok: true,
      message: `Упражнение "${normalizedType}" создано`,
      data: {
        id: crypto.randomUUID(),
        type: normalizedType,
        goal: input.goal,
      },
    };
  }

  const { data: existingExercise, error: checkError } = await session.supabase
    .from("exercises")
    .select("id")
    .eq("user_id", session.user.id)
    .ilike("type", normalizedType)
    .maybeSingle();

  if (checkError) {
    return {
      ok: false,
      message: `Ошибка: ${checkError.message}`,
    };
  }

  if (existingExercise) {
    return {
      ok: false,
      message: "Упражнение с таким названием уже существует",
    };
  }

  const { data, error } = await session.supabase
    .from("exercises")
    .insert({
      user_id: session.user.id,
      type: normalizedType,
      goal: input.goal,
    })
    .select("id, type, goal")
    .single();

  if (error?.code === "23505") {
    return {
      ok: false,
      message: "Упражнение с таким названием уже существует",
    };
  }

  if (error || !data) {
    return {
      ok: false,
      message: `Ошибка: ${error?.message ?? "Неизвестная ошибка"}`,
    };
  }

  return {
    ok: true,
    message: `Упражнение "${normalizedType}" создано`,
    data: {
      id: data.id as string,
      type: data.type as string,
      goal: data.goal as number,
    },
  };
}

export async function updateExerciseAction(input: {
  id: string;
  type: string;
  goal: number;
}): Promise<ActionResult<{ id: string; type: string; goal: number }>> {
  const normalizedType = input.type.trim();
  const validationError = validateExerciseInput(normalizedType, input.goal);

  if (validationError) {
    return {
      ok: false,
      message: validationError,
    };
  }

  if (isE2EMockMode()) {
    return {
      ok: true,
      message: `Упражнение "${normalizedType}" обновлено`,
      data: {
        id: input.id,
        type: normalizedType,
        goal: input.goal,
      },
    };
  }

  const session = await requireAppSession();
  if (session.isMock) {
    return {
      ok: true,
      message: `Упражнение "${normalizedType}" обновлено`,
      data: {
        id: input.id,
        type: normalizedType,
        goal: input.goal,
      },
    };
  }

  const { data: existingExercise, error: getError } = await session.supabase
    .from("exercises")
    .select("id, type")
    .eq("id", input.id)
    .eq("user_id", session.user.id)
    .single();

  if (getError || !existingExercise) {
    return {
      ok: false,
      message: "Упражнение не найдено",
    };
  }

  if ((existingExercise.type as string).toLowerCase() !== normalizedType.toLowerCase()) {
    const { data: duplicateExercise, error: checkError } = await session.supabase
      .from("exercises")
      .select("id")
      .eq("user_id", session.user.id)
      .ilike("type", normalizedType)
      .neq("id", input.id)
      .maybeSingle();

    if (checkError) {
      return {
        ok: false,
        message: `Ошибка: ${checkError.message}`,
      };
    }

    if (duplicateExercise) {
      return {
        ok: false,
        message: "Упражнение с таким названием уже существует",
      };
    }
  }

  const { data, error } = await session.supabase
    .from("exercises")
    .update({
      type: normalizedType,
      goal: input.goal,
    })
    .eq("id", input.id)
    .eq("user_id", session.user.id)
    .select("id, type, goal")
    .single();

  if (error?.code === "23505") {
    return {
      ok: false,
      message: "Упражнение с таким названием уже существует",
    };
  }

  if (error || !data) {
    return {
      ok: false,
      message: `Ошибка: ${error?.message ?? "Неизвестная ошибка"}`,
    };
  }

  return {
    ok: true,
    message: `Упражнение "${normalizedType}" обновлено`,
    data: {
      id: data.id as string,
      type: data.type as string,
      goal: data.goal as number,
    },
  };
}

export async function deleteExerciseAction(input: {
  id: string;
}): Promise<ActionResult<{ id: string }>> {
  if (isE2EMockMode()) {
    return {
      ok: true,
      message: "Упражнение удалено",
      data: { id: input.id },
    };
  }

  const session = await requireAppSession();
  if (session.isMock) {
    return {
      ok: true,
      message: "Упражнение удалено",
      data: { id: input.id },
    };
  }

  const { data: exercise, error: getError } = await session.supabase
    .from("exercises")
    .select("id")
    .eq("id", input.id)
    .eq("user_id", session.user.id)
    .single();

  if (getError || !exercise) {
    return {
      ok: false,
      message: "Упражнение не найдено",
    };
  }

  const { data: sets, error: setsError } = await session.supabase
    .from("sets")
    .select("id")
    .eq("exercise_id", input.id)
    .limit(1);

  if (setsError) {
    return {
      ok: false,
      message: `Ошибка: ${setsError.message}`,
    };
  }

  if ((sets ?? []).length > 0) {
    return {
      ok: false,
      message: "Delete exercise sets before deleting the exercise",
    };
  }

  const { error } = await session.supabase
    .from("exercises")
    .delete()
    .eq("id", input.id)
    .eq("user_id", session.user.id);

  if (error) {
    return {
      ok: false,
      message: `Ошибка: ${error.message}`,
    };
  }

  return {
    ok: true,
    message: "Упражнение удалено",
    data: { id: input.id },
  };
}
