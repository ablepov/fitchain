import { NextRequest } from "next/server";
import { jsonError, noStoreHeaders } from "@/lib/api";
import { getAuthenticatedRouteContext } from "@/lib/supabaseServer";

export const runtime = "edge";

async function resolveParams(
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  return "then" in context.params ? await context.params : context.params;
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  const { supabase, userId } = await getAuthenticatedRouteContext(req);
  if (!userId) {
    return jsonError(401, "UNAUTHORIZED", "No session");
  }

  const params = await resolveParams(context);

  const { data: existingSet, error: getError } = await supabase
    .from("sets")
    .select("id")
    .eq("id", params.id)
    .maybeSingle();

  if (getError) {
    return jsonError(500, "INTERNAL_ERROR", getError.message);
  }

  if (!existingSet) {
    return jsonError(404, "NOT_FOUND", "Set not found");
  }

  const { data: deletedSet, error: deleteError } = await supabase
    .from("sets")
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (deleteError) {
    return jsonError(500, "INTERNAL_ERROR", deleteError.message);
  }

  if (!deletedSet) {
    return jsonError(404, "NOT_FOUND", "Set not found");
  }

  return new Response(null, {
    status: 204,
    headers: noStoreHeaders(),
  });
}
