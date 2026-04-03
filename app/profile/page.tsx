import { Suspense } from "react";
import { ProfilePageContent } from "@/app/profile/ProfilePageContent";
import { Header } from "@/components/Header";
import { ProfilePageBodySkeleton } from "@/components/PageSkeletons";
import { requireSessionSnapshot } from "@/lib/sessionData";

export default async function ProfilePage() {
  const session = await requireSessionSnapshot();

  return (
    <>
      <Header currentPath="/profile" title="Профиль" userEmail={session.email} />
      <Suspense fallback={<ProfilePageBodySkeleton />}>
        <ProfilePageContent />
      </Suspense>
    </>
  );
}
