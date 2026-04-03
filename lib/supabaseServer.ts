import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { getAuthorizationHeader } from "@/lib/api";
import { getSupabasePublicEnv } from "@/lib/supabaseEnv";

export type AuthenticatedAppUser = {
  id: string;
  email?: string | null;
};

function getSupabaseServerConfig() {
  const { url, publishableKey } = getSupabasePublicEnv();

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase env vars are missing: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return {
    url,
    publishableKey,
  };
}

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = getSupabaseServerConfig();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components may not be able to persist refreshed cookies.
        }
      },
    },
  });
}

export function extractAuthenticatedAppUser(
  claims: Record<string, unknown> | null | undefined
): AuthenticatedAppUser | null {
  if (!claims) {
    return null;
  }

  const id = typeof claims.sub === "string" ? claims.sub : null;

  if (!id) {
    return null;
  }

  return {
    id,
    email: typeof claims.email === "string" ? claims.email : null,
  };
}

export function createRouteSupabaseClient(req: NextRequest) {
  const { url, publishableKey } = getSupabaseServerConfig();
  const authHeader = getAuthorizationHeader(req);

  if (authHeader) {
    return createClient(url, publishableKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });
  }

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll() {
        // Route handlers in this app don't rely on cookie refresh persistence.
      },
    },
  });
}

export async function getAuthenticatedRouteContext(req: NextRequest) {
  const supabase = createRouteSupabaseClient(req);
  const { data, error } = await supabase.auth.getClaims();
  const user = extractAuthenticatedAppUser((data?.claims as Record<string, unknown> | undefined) ?? null);

  return {
    supabase,
    user,
    userId: user?.id ?? null,
    authError: error,
  };
}
