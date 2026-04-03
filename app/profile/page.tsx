import { Header } from "@/components/Header";
import { getProfilePageData } from "@/lib/trainingData";
import { ProfileClient } from "@/app/profile/ProfileClient";

export default async function ProfilePage() {
  const data = await getProfilePageData();

  return (
    <>
      <Header currentPath="/profile" title="РџСЂРѕС„РёР»СЊ" userEmail={data.email} />
      <ProfileClient
        initialEmail={data.email}
        initialTimezone={data.timezone}
        initialExercises={data.exercises}
      />
    </>
  );
}
