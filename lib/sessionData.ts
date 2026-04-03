import { redirect } from "next/navigation";
import { getOptionalAppSession } from "@/lib/appSession";

export type SessionSnapshot = {
  userId: string | null;
  email: string | null;
  isAuthenticated: boolean;
};

export async function getSessionSnapshot(): Promise<SessionSnapshot> {
  const session = await getOptionalAppSession();

  return {
    userId: session.user?.id ?? null,
    email: session.user?.email ?? null,
    isAuthenticated: Boolean(session.user),
  };
}

export async function requireSessionSnapshot(redirectPath = "/auth"): Promise<SessionSnapshot> {
  const snapshot = await getSessionSnapshot();

  if (!snapshot.isAuthenticated || !snapshot.userId) {
    redirect(redirectPath);
  }

  return snapshot;
}
