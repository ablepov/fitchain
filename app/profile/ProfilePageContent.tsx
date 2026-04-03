import { Header } from "@/components/Header";
import { getProfilePageData } from "@/lib/trainingData";
import { ProfileClient } from "@/app/profile/ProfileClient";

export async function ProfilePageContent() {
  const data = await getProfilePageData();

  return (
    <>
      <Header currentPath="/profile" title="Профиль" userEmail={data.email} />
      <ProfileClient
        initialEmail={data.email}
        initialTimezone={data.timezone}
        initialExercises={data.exercises}
      />
    </>
  );
}
