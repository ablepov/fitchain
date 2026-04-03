import type { ProfilePageData, TrainingOverview } from "@/lib/trainingData";
import type { SessionSnapshot } from "@/lib/sessionData";

type ApiEnvelope<T> = {
  data: T | null;
  error: {
    code: string;
    message: string;
  } | null;
};

export type SetApiRecord = {
  id: string;
  exercise_id: string;
  reps: number;
  created_at: string;
  note: string | null;
  source: "manual" | "quickbutton";
};

export type ExerciseApiRecord = {
  id: string;
  type: string;
  goal: number;
  created_at?: string;
};

async function readApiEnvelope<T>(res: Response): Promise<T> {
  const payload = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!res.ok || payload?.error || payload?.data === null || !payload) {
    throw new Error(payload?.error?.message ?? `Request failed with status ${res.status}`);
  }

  return payload.data;
}

async function requestJson<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  return readApiEnvelope<T>(res);
}

export async function fetchSessionSnapshot() {
  return requestJson<SessionSnapshot>("/api/session", {
    method: "GET",
  });
}

export async function fetchTrainingOverview(options: {
  includeRecentHistory: boolean;
  recentLimit: number;
}) {
  const searchParams = new URLSearchParams({
    history: options.includeRecentHistory ? "1" : "0",
    recentLimit: String(options.recentLimit),
  });

  return requestJson<TrainingOverview>(`/api/training/overview?${searchParams.toString()}`, {
    method: "GET",
  });
}

export async function fetchProfileSnapshot() {
  return requestJson<ProfilePageData>("/api/profile/snapshot", {
    method: "GET",
  });
}

export async function createSet(input: {
  exerciseId: string;
  reps: number;
  note?: string;
  source: "manual" | "quickbutton";
}) {
  return requestJson<SetApiRecord>("/api/sets", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function saveTimezone(timezone: string) {
  return requestJson<{ timezone: string }>("/api/profile/timezone", {
    method: "PATCH",
    body: JSON.stringify({ timezone }),
  });
}

export async function createExercise(input: { type: string; goal: number }) {
  return requestJson<ExerciseApiRecord>("/api/exercises", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateExercise(input: { id: string; type: string; goal: number }) {
  return requestJson<ExerciseApiRecord>(`/api/exercises/${input.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      type: input.type,
      goal: input.goal,
    }),
  });
}

export async function deleteExercise(id: string) {
  return requestJson<{ id: string; type: string }>(`/api/exercises/${id}`, {
    method: "DELETE",
  });
}
