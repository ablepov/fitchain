import { Suspense } from "react";
import { ProfilePageContent } from "@/app/profile/ProfilePageContent";
import { AppShell } from "@/components/AppShell";
import { ProfilePageBodySkeleton } from "@/components/PageSkeletons";

export default async function ProfilePage() {
  return (
    <AppShell title="Профиль">
      <Suspense fallback={<ProfilePageBodySkeleton />}>
        <ProfilePageContent />
      </Suspense>
    </AppShell>
  );
}
