import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { getMockUser, isE2EMockMode } from "@/lib/e2eMock";

type OptionalSessionResult = {
  isMock: boolean;
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>> | null;
  user: {
    id: string;
    email?: string | null;
  } | null;
};

type RequiredSessionResult = {
  isMock: false;
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
  user: {
    id: string;
    email?: string | null;
  };
};

type MockSessionResult = {
  isMock: true;
  supabase: null;
  user: {
    id: string;
    email?: string | null;
  };
};

export async function getOptionalAppSession(): Promise<OptionalSessionResult> {
  if (isE2EMockMode()) {
    return {
      isMock: true,
      supabase: null,
      user: getMockUser(),
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    isMock: false,
    supabase,
    user,
  };
}

export async function requireAppSession(redirectPath = "/auth") {
  const session = await getOptionalAppSession();

  if (!session.user) {
    redirect(redirectPath);
  }

  return session as RequiredSessionResult | MockSessionResult;
}
