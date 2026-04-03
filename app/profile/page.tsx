import { Suspense } from "react";
import { ProfilePageContent } from "@/app/profile/ProfilePageContent";
import { ProfilePageSkeleton } from "@/components/PageSkeletons";

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <ProfilePageContent />
    </Suspense>
  );
}
