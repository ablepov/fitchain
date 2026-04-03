import { Suspense } from "react";
import { HomePageContent } from "@/app/_components/HomePageContent";
import { Header } from "@/components/Header";
import { HomePageBodySkeleton } from "@/components/PageSkeletons";
import { requireSessionSnapshot } from "@/lib/sessionData";

export default async function HomePage() {
  const session = await requireSessionSnapshot();

  return (
    <>
      <Header currentPath="/" title="Тренировка" userEmail={session.email} />
      <Suspense fallback={<HomePageBodySkeleton />}>
        <HomePageContent />
      </Suspense>
    </>
  );
}
