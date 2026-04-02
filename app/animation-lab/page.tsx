import { Header } from "@/components/Header";
import { SetAnimationLab } from "@/components/SetAnimationLab";

export default function AnimationLabPage() {
  return (
    <>
      <Header title="Лаборатория анимаций" />
      <main className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
        <SetAnimationLab />
      </main>
    </>
  );
}
