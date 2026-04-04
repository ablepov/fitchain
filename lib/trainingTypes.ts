import { getWeekdayIndex } from "@/lib/date";

export type SummaryItem = {
  type: string;
  total: number;
};

export type ExerciseOverview = {
  id: string;
  type: string;
  goal: number;
  todayTotal: number;
  lastSetTime: string | null;
  recentReps: number[];
  chart: number[];
  scheduledWeekdays: number[];
};

export type TrainingOverview = {
  email: string | null;
  timezone: string;
  total: number;
  summary: SummaryItem[];
  exercises: ExerciseOverview[];
};

export type ProfilePageData = {
  email: string | null;
  timezone: string;
};

export type WeeklyPlanItem = {
  scheduleId: string;
  exerciseId: string;
  type: string;
  goal: number;
  position: number;
};

export type WeeklyPlanDay = {
  weekday: number;
  items: WeeklyPlanItem[];
};

export type WeeklyPlan = {
  timezone: string;
  days: WeeklyPlanDay[];
};

export type StatsTopExercise = {
  type: string;
  total: number;
} | null;

export type TrainingStatsPeriod = {
  totalReps: number;
  totalSets: number;
  activeDays: number;
  exerciseCount: number;
  topExercise: StatsTopExercise;
};

export type TrainingStats = {
  timezone: string;
  periods: {
    today: TrainingStatsPeriod;
    week: TrainingStatsPeriod;
    month: TrainingStatsPeriod;
    all: TrainingStatsPeriod;
  };
  highlights: {
    currentStreakDays: number;
    bestDay: {
      date: string;
      total: number;
    } | null;
    totalExercises: number;
    scheduledThisWeek: number;
  };
};

export function getDefaultWeekdayForTimezone(timezone: string) {
  return getWeekdayIndex(timezone);
}
