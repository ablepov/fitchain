import { NextRequest } from "next/server";
import { jsonError, jsonSuccess } from "@/lib/api";
import { logger } from "@/lib/logger";
import { getAuthenticatedRouteContext } from "@/lib/supabaseServer";

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS = new Set(["debug", "info", "warn", "error"] as const);

function ensureDevelopmentAccess() {
  return process.env.NODE_ENV === "development";
}

export async function GET(req: NextRequest) {
  if (!ensureDevelopmentAccess()) {
    return jsonError(404, "NOT_FOUND", "Not found");
  }

  const { userId } = await getAuthenticatedRouteContext(req);
  if (!userId) {
    return jsonError(401, "UNAUTHORIZED", "No session");
  }

  const url = new URL(req.url);
  const levelParam = url.searchParams.get("level");
  const limitParam = parseInt(url.searchParams.get("limit") || "50", 10);
  const limit = Number.isFinite(limitParam) ? Math.max(1, Math.min(limitParam, 100)) : 50;
  const level = levelParam && LOG_LEVELS.has(levelParam as LogLevel) ? (levelParam as LogLevel) : undefined;

  return jsonSuccess(logger.getLogs(level, limit));
}

export async function DELETE(req: NextRequest) {
  if (!ensureDevelopmentAccess()) {
    return jsonError(404, "NOT_FOUND", "Not found");
  }

  const { userId } = await getAuthenticatedRouteContext(req);
  if (!userId) {
    return jsonError(401, "UNAUTHORIZED", "No session");
  }

  logger.clearLogs();
  return jsonSuccess({ success: true });
}
