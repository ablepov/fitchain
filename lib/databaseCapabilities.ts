type DatabaseErrorLike = {
  code?: string;
  message?: string | null;
};

export const databaseCapabilityKeys = {
  exerciseScheduleTable: "table:exercise_schedule",
  getProfileSnapshotRpc: "rpc:get_profile_snapshot",
  getTrainingOverviewRpc: "rpc:get_training_overview",
  getTrainingStatsRpc: "rpc:get_training_stats",
  getWeeklyPlanRpc: "rpc:get_weekly_plan",
} as const;

const unavailableCapabilities = new Set<string>();

export const SCHEDULE_FEATURE_UNAVAILABLE_MESSAGE =
  "Weekly planner is unavailable until the schedule schema is applied.";

export function isCapabilityUnavailable(key: string) {
  return unavailableCapabilities.has(key);
}

export function markCapabilityUnavailable(key: string) {
  unavailableCapabilities.add(key);
}

export function markCapabilityAvailable(key: string) {
  unavailableCapabilities.delete(key);
}

export function resetCapabilityCache() {
  unavailableCapabilities.clear();
}

export function isMissingRpcFunctionError(error: DatabaseErrorLike | null) {
  if (!error) {
    return false;
  }

  return (
    error.code === "PGRST202" ||
    /function .* does not exist|Could not find the function/i.test(error.message ?? "")
  );
}

export function isMissingRelationError(error: DatabaseErrorLike | null) {
  if (!error) {
    return false;
  }

  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    /relation .* does not exist|Could not find the table .* in the schema cache/i.test(
      error.message ?? ""
    )
  );
}
