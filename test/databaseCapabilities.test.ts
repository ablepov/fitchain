import assert from "node:assert/strict";
import test from "node:test";
import {
  databaseCapabilityKeys,
  isCapabilityUnavailable,
  isMissingRelationError,
  isMissingRpcFunctionError,
  markCapabilityAvailable,
  markCapabilityUnavailable,
  resetCapabilityCache,
} from "@/lib/databaseCapabilities";

test.beforeEach(() => {
  resetCapabilityCache();
});

test("capability cache tracks missing and restored capabilities", () => {
  assert.equal(isCapabilityUnavailable(databaseCapabilityKeys.exerciseScheduleTable), false);

  markCapabilityUnavailable(databaseCapabilityKeys.exerciseScheduleTable);
  assert.equal(isCapabilityUnavailable(databaseCapabilityKeys.exerciseScheduleTable), true);

  markCapabilityAvailable(databaseCapabilityKeys.exerciseScheduleTable);
  assert.equal(isCapabilityUnavailable(databaseCapabilityKeys.exerciseScheduleTable), false);
});

test("missing relation errors are detected from postgres and schema cache responses", () => {
  assert.equal(isMissingRelationError({ code: "42P01", message: "relation does not exist" }), true);
  assert.equal(
    isMissingRelationError({
      code: "PGRST205",
      message: "Could not find the table 'public.exercise_schedule' in the schema cache",
    }),
    true
  );
  assert.equal(isMissingRelationError({ code: "23505", message: "duplicate key" }), false);
});

test("missing rpc errors are detected from postgres-rest responses", () => {
  assert.equal(isMissingRpcFunctionError({ code: "PGRST202", message: "function does not exist" }), true);
  assert.equal(
    isMissingRpcFunctionError({
      message: "Could not find the function public.get_training_stats in the schema cache",
    }),
    true
  );
  assert.equal(isMissingRpcFunctionError({ code: "22023", message: "bad input" }), false);
});
