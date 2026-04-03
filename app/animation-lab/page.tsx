import { getOptionalAppSession } from "@/lib/appSession";
import { Header } from "@/components/Header";
import { SetAnimationLab } from "@/components/SetAnimationLab";

export default async function AnimationLabPage() {
  const session = await getOptionalAppSession();

  return (
    <>
      <Header
        currentPath="/animation-lab"
        title="Р›Р°Р±РѕСЂР°С‚РѕСЂРёСЏ Р°РЅРёРјР°С†РёР№"
        userEmail={session.user?.email ?? null}
      />
      <main className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
        <SetAnimationLab />
      </main>
    </>
  );
}
