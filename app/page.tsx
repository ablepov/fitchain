import { Suspense } from "react";
import { HomePageContent } from "@/app/_components/HomePageContent";
import { HomePageSkeleton } from "@/components/PageSkeletons";

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageContent />
    </Suspense>
  );
}
