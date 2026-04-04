import { jsonError, jsonSuccess } from "@/lib/api";
import { getSessionSnapshot } from "@/lib/sessionData";
import { getTrainingStats } from "@/lib/trainingData";

export async function GET() {
  const session = await getSessionSnapshot();

  if (!session.isAuthenticated) {
    return jsonError(401, "UNAUTHORIZED", "No session");
  }

  return jsonSuccess(await getTrainingStats());
}
