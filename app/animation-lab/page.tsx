import { AnimationLabPageContent } from "@/app/animation-lab/AnimationLabPageContent";
import { Header } from "@/components/Header";
import { getSessionSnapshot } from "@/lib/sessionData";

export default async function AnimationLabPage() {
  const session = await getSessionSnapshot();

  return (
    <>
      <Header
        currentPath="/animation-lab"
        title="Лаборатория анимаций"
        userEmail={session.email}
      />
      <AnimationLabPageContent />
    </>
  );
}
