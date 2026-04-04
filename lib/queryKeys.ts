export const DEFAULT_RECENT_LIMIT = 20;

export const queryKeys = {
  session: ["session"] as const,
  trainingOverview: (includeRecentHistory: boolean, recentLimit = DEFAULT_RECENT_LIMIT) =>
    ["training-overview", includeRecentHistory ? "history" : "summary", recentLimit] as const,
  trainingOverviewRoot: ["training-overview"] as const,
  trainingStats: ["training-stats"] as const,
  weeklyPlan: ["weekly-plan"] as const,
  profileSnapshot: ["profile-snapshot"] as const,
};
