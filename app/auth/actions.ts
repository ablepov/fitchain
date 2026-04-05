"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { isE2EMockMode } from "@/lib/e2eMock";

function getAuthRedirect(path: string, key: "error" | "message", value: string) {
  const params = new URLSearchParams({
    [key]: value,
  });

  return `${path}?${params.toString()}`;
}

async function getRequestOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin) {
    return origin;
  }

  const forwardedHost = headerStore.get("x-forwarded-host");
  const forwardedProto = headerStore.get("x-forwarded-proto");

  if (forwardedHost && forwardedProto) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  const host = headerStore.get("host");
  if (!host) {
    return null;
  }

  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(getAuthRedirect("/auth", "error", "Email and password are required"));
  }

  if (isE2EMockMode()) {
    redirect("/");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(getAuthRedirect("/auth", "error", error.message));
  }

  redirect("/");
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(getAuthRedirect("/auth", "error", "Email and password are required"));
  }

  if (isE2EMockMode()) {
    redirect("/");
  }

  const supabase = await createServerSupabaseClient();
  const requestOrigin = await getRequestOrigin();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: requestOrigin
      ? {
          emailRedirectTo: `${requestOrigin}/auth`,
        }
      : undefined,
  });

  if (error) {
    redirect(getAuthRedirect("/auth", "error", error.message));
  }

  redirect(getAuthRedirect("/", "message", "Account created"));
}

export async function signOutAction() {
  if (!isE2EMockMode()) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  }

  redirect("/auth");
}
