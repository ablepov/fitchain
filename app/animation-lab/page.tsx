import { AnimationLabPageContent } from "@/app/animation-lab/AnimationLabPageContent";
import { Header } from "@/components/Header";

export default async function AnimationLabPage() {
  return (
    <>
      <Header title="Лаборатория анимаций" />
      <AnimationLabPageContent />
    </>
  );
}
