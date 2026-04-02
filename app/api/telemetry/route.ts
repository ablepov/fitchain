import { NextRequest } from "next/server";
import { z } from "zod";
import { jsonError, noStoreHeaders } from "@/lib/api";
import { takeFixedWindowLimit } from "@/lib/rateLimit";
import { getAuthenticatedRouteContext } from "@/lib/supabaseServer";

const MAX_CONTENT_LENGTH = 2_048;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;

const telemetrySchema = z.object({
  event: z.enum(["buffer_commit"]),
  exerciseId: z.string().uuid(),
  reps: z.number().int().min(1).max(1000),
});

async function readTelemetryPayload(req: NextRequest) {
  const rawBody = await req.text();
  const bodySize = new TextEncoder().encode(rawBody).byteLength;

  if (bodySize > MAX_CONTENT_LENGTH) {
    return {
      error: "too_large" as const,
      body: null,
    };
  }

  if (!rawBody.trim()) {
    return {
      error: "invalid_json" as const,
      body: null,
    };
  }

  try {
    return {
      error: null,
      body: JSON.parse(rawBody) as unknown,
    };
  } catch {
    return {
      error: "invalid_json" as const,
      body: null,
    };
  }
}

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_CONTENT_LENGTH) {
    return jsonError(413, "VALIDATION_ERROR", "Telemetry payload is too large");
  }

  const { userId } = await getAuthenticatedRouteContext(req);
  if (!userId) {
    return jsonError(401, "UNAUTHORIZED", "No session");
  }

  const limitResult = takeFixedWindowLimit(
    `telemetry:${userId}`,
    RATE_LIMIT_MAX_REQUESTS,
    RATE_LIMIT_WINDOW_MS
  );

  if (!limitResult.allowed) {
    return jsonError(429, "RATE_LIMITED", "Too many telemetry requests", {
      headers: {
        "Retry-After": Math.max(1, Math.ceil((limitResult.resetAt - Date.now()) / 1_000)).toString(),
      },
    });
  }

  const payload = await readTelemetryPayload(req);
  if (payload.error === "too_large") {
    return jsonError(413, "VALIDATION_ERROR", "Telemetry payload is too large");
  }

  if (payload.error || !payload.body) {
    return jsonError(400, "VALIDATION_ERROR", "Invalid telemetry payload");
  }

  const parsed = telemetrySchema.safeParse(payload.body);
  if (!parsed.success) {
    return jsonError(
      400,
      "VALIDATION_ERROR",
      parsed.error.issues.map((issue) => issue.message).join(", ")
    );
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[telemetry]", {
      userId,
      ...parsed.data,
    });
  }

  return new Response(null, {
    status: 204,
    headers: noStoreHeaders(),
  });
}
