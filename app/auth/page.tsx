import { Suspense } from "react";
import { AuthPageContent } from "@/app/auth/AuthPageContent";
import { Header } from "@/components/Header";
import { AuthPageBodySkeleton } from "@/components/PageSkeletons";
import { getSessionSnapshot } from "@/lib/sessionData";

type SearchParamsInput =
  | Promise<Record<string, string | string[] | undefined>>
  | Record<string, string | string[] | undefined>
  | undefined;

export default async function AuthPage({
  searchParams,
}: {
  searchParams?: SearchParamsInput;
}) {
  const session = await getSessionSnapshot();

  return (
    <>
      <Header currentPath="/auth" title="Авторизация" userEmail={session.email} />
      <Suspense fallback={<AuthPageBodySkeleton />}>
        <AuthPageContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
