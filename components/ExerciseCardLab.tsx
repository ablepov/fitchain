"use client";

import { ExerciseProgressCard } from "@/components/ExerciseProgressCard";

const DEMO_LAST_SET_TIME = new Date(Date.now() - 17 * 60 * 1000).toISOString();

export function ExerciseCardLab() {
  return (
    <ExerciseProgressCard
      exercise="Отжимания"
      current={36}
      target={100}
      recentReps={[8, 10, 12, 10, 9, 11]}
      chart={[12, 16, 19, 22, 26, 30, 36]}
      lastSetTime={DEMO_LAST_SET_TIME}
    />
  );
}
