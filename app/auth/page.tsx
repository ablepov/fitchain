import { Suspense } from "react";
import { AuthPageContent } from "@/app/auth/AuthPageContent";
import { AuthPageSkeleton } from "@/components/PageSkeletons";

type SearchParamsInput =
  | Promise<Record<string, string | string[] | undefined>>
  | Record<string, string | string[] | undefined>
  | undefined;

export default function AuthPage({
  searchParams,
}: {
  searchParams?: SearchParamsInput;
}) {
  return (
    <Suspense fallback={<AuthPageSkeleton />}>
      <AuthPageContent searchParams={searchParams} />
    </Suspense>
  );
}
