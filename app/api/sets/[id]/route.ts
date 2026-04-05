import { NextRequest } from "next/server";
import { jsonError, noStoreHeaders } from "@/lib/api";
import { isE2EMockMode } from "@/lib/e2eMock";
import { getAuthenticatedRouteContext } from "@/lib/supabaseServer";

async function resolveParams(
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  return "then" in context.params ? await context.params : context.params;
}

function isMissingRpcFunction(error: { code?: string; message?: string } | null) {
  if (!error) {
    return false;
  }

  return error.code === "PGRST202" || /function .* does not exist|Could not find the function/i.test(error.message ?? "");
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  if (isE2EMockMode()) {
    await resolveParams(context);

    return new Response(null, {
      status: 204,
      headers: noStoreHeaders(),
    });
  }

  const { supabase, userId } = await getAuthenticatedRouteContext(req);
  if (!userId) {
    return jsonError(401, "UNAUTHORIZED", "No session");
  }

  const params = await resolveParams(context);

  const { data: rpcData, error: rpcError } = await supabase.rpc("soft_delete_set", {
    set_id: params.id,
  });

  if (!rpcError) {
    if (!rpcData) {
      return jsonError(404, "NOT_FOUND", "Set not found");
    }

    return new Response(null, {
      status: 204,
      headers: noStoreHeaders(),
    });
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
