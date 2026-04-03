import { Suspense } from "react";
import { AnimationLabPageContent } from "@/app/animation-lab/AnimationLabPageContent";
import { AnimationLabPageSkeleton } from "@/components/PageSkeletons";

export default function AnimationLabPage() {
  return (
    <Suspense fallback={<AnimationLabPageSkeleton />}>
      <AnimationLabPageContent />
    </Suspense>
  );
}
