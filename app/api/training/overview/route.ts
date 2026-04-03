import { jsonError, jsonSuccess } from "@/lib/api";
import { getSessionSnapshot } from "@/lib/sessionData";
import { getTrainingOverview } from "@/lib/trainingData";

export async function GET(req: Request) {
  const session = await getSessionSnapshot();

  if (!session.isAuthenticated) {
    return jsonError(401, "UNAUTHORIZED", "No session");
  }

  const url = new URL(req.url);
  const historyParam = url.searchParams.get("history");
  const recentLimitParam = Number(url.searchParams.get("recentLimit") ?? "20");
  const includeRecentHistory = historyParam !== "0";
  const recentLimit = Number.isFinite(recentLimitParam) ? Math.max(1, Math.min(recentLimitParam, 100)) : 20;

  return jsonSuccess(
    await getTrainingOverview({
      includeRecentHistory,
      recentLimit,
    })
  );
}
