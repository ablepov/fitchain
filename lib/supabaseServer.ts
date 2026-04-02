import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { getAuthorizationHeader } from "@/lib/api";
import { getSupabasePublicEnv } from "@/lib/supabaseEnv";

export function createRouteSupabaseClient(req: NextRequest) {
  const { url, publishableKey } = getSupabasePublicEnv();
  const authHeader = getAuthorizationHeader(req);

  return createClient(url, publishableKey, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });
}

export async function getAuthenticatedRouteContext(req: NextRequest) {
  const supabase = createRouteSupabaseClient(req);
  const { data, error } = await supabase.auth.getUser();

  return {
    supabase,
    user: data.user,
    userId: data.user?.id ?? null,
    authError: error,
  };
}
