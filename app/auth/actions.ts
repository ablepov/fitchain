"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { isE2EMockMode } from "@/lib/e2eMock";

function getAuthRedirect(path: string, key: "error" | "message", value: string) {
  const params = new URLSearchParams({
    [key]: value,
  });

  return `${path}?${params.toString()}`;
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(getAuthRedirect("/auth", "error", "Email and password are required"));
  }

  if (isE2EMockMode()) {
    redirect("/dashboard");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(getAuthRedirect("/auth", "error", error.message));
  }

  redirect("/dashboard");
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(getAuthRedirect("/auth", "error", "Email and password are required"));
  }

  if (isE2EMockMode()) {
    redirect("/dashboard");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect(getAuthRedirect("/auth", "error", error.message));
  }

  redirect(getAuthRedirect("/dashboard", "message", "Account created"));
}

export async function signOutAction() {
  if (!isE2EMockMode()) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  }

  redirect("/auth");
}
