import assert from "node:assert/strict";
import test from "node:test";
import { QueryClient } from "@tanstack/react-query";
import {
  applyCreatedPlanAssignmentToCaches,
  applyDeletedPlanAssignmentToCaches,
} from "@/lib/cacheUpdates";
import { DEFAULT_RECENT_LIMIT, queryKeys } from "@/lib/queryKeys";
import type { TrainingOverview, WeeklyPlan } from "@/lib/trainingTypes";

function createOverview(): TrainingOverview {
  return {
    email: "tester@example.com",
    timezone: "Europe/Moscow",
    total: 0,
    summary: [{ type: "pushups", total: 0 }],
    exercises: [
      {
        id: "exercise-1",
        type: "pushups",
        goal: 100,
        todayTotal: 0,
        lastSetTime: null,
        recentReps: [],
        chart: [0, 0, 0, 0, 0, 0, 0],
        scheduledWeekdays: [],
      },
    ],
  };
}

function createWeeklyPlan(): WeeklyPlan {
  return {
    timezone: "Europe/Moscow",
    isAvailable: false,
    days: Array.from({ length: 7 }, (_, weekday) => ({
      weekday,
      items: [],
    })),
  };
}

test("planner cache updates preserve availability flag and exercise weekdays", () => {
  const queryClient = new QueryClient();
  queryClient.setQueryData(queryKeys.trainingOverview(true, DEFAULT_RECENT_LIMIT), createOverview());
  queryClient.setQueryData(queryKeys.weeklyPlan, createWeeklyPlan());

  applyCreatedPlanAssignmentToCaches(
    queryClient,
    {
      id: "schedule-1",
      exercise_id: "exercise-1",
      weekday: 2,
      position: 0,
    },
    {
      id: "exercise-1",
      type: "pushups",
      goal: 100,
    }
  );

  const overviewAfterCreate = queryClient.getQueryData<TrainingOverview>(
    queryKeys.trainingOverview(true, DEFAULT_RECENT_LIMIT)
  );
  const weeklyPlanAfterCreate = queryClient.getQueryData<WeeklyPlan>(queryKeys.weeklyPlan);

  assert.deepEqual(overviewAfterCreate?.exercises[0]?.scheduledWeekdays, [2]);
  assert.equal(weeklyPlanAfterCreate?.isAvailable, false);
  assert.equal(weeklyPlanAfterCreate?.days[2]?.items[0]?.scheduleId, "schedule-1");

  applyDeletedPlanAssignmentToCaches(queryClient, "schedule-1");

  const overviewAfterDelete = queryClient.getQueryData<TrainingOverview>(
    queryKeys.trainingOverview(true, DEFAULT_RECENT_LIMIT)
  );
  const weeklyPlanAfterDelete = queryClient.getQueryData<WeeklyPlan>(queryKeys.weeklyPlan);

  assert.deepEqual(overviewAfterDelete?.exercises[0]?.scheduledWeekdays, []);
  assert.equal(weeklyPlanAfterDelete?.isAvailable, false);
  assert.equal(weeklyPlanAfterDelete?.days[2]?.items.length, 0);
});
