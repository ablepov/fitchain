import { Suspense } from "react";
import { AuthPageContent } from "@/app/auth/AuthPageContent";
import { Header } from "@/components/Header";
import { AuthPageBodySkeleton } from "@/components/PageSkeletons";

type SearchParamsInput =
  | Promise<Record<string, string | string[] | undefined>>
  | Record<string, string | string[] | undefined>
  | undefined;

export default async function AuthPage({
  searchParams,
}: {
  searchParams?: SearchParamsInput;
}) {
  return (
    <>
      <Header title="Авторизация" />
      <Suspense fallback={<AuthPageBodySkeleton />}>
        <AuthPageContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
