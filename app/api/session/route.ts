import { jsonSuccess } from "@/lib/api";
import { getSessionSnapshot } from "@/lib/sessionData";

export async function GET() {
  return jsonSuccess(await getSessionSnapshot());
}
