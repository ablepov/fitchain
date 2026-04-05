"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { CalendarDays, MoreHorizontal, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import {
  type PlanApiRecord,
  createExercise,
  createPlanAssignment,
  createSet,
  deleteExercise,
  deletePlanAssignment,
  updateExercise,
} from "@/lib/apiClient";
import {
  applyCreatedExerciseToOverviewCaches,
  applyCreatedPlanAssignmentToCaches,
  applyCreatedSetToOverviewCaches,
  applyDeletedExerciseToCaches,
  applyDeletedPlanAssignmentToCaches,
  applyUpdatedExerciseToCaches,
  restoreTrainingOverviewCaches,
  snapshotTrainingOverviewCaches,
} from "@/lib/cacheUpdates";
import { WEEKDAY_LABELS_RU, WEEKDAY_ORDER_MONDAY_FIRST } from "@/lib/date";
import { DEFAULT_RECENT_LIMIT, queryKeys } from "@/lib/queryKeys";
import { trainingOverviewQueryOptions, weeklyPlanQueryOptions } from "@/lib/queryOptions";
import {
  getDefaultWeekdayForTimezone,
  type ExerciseOverview,
  type WeeklyPlanDay,
  type WeeklyPlanItem,
} from "@/lib/trainingTypes";
import { ExerciseProgressCard } from "@/components/ExerciseProgressCard";
import { normalizeHomeMode, type HomeMode } from "@/components/HomeModeHeaderControl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomSheet } from "@/components/ui/bottom-sheet";

type TodaySlide = { kind: "exercise"; exercise: ExerciseOverview } | { kind: "add" };

type WeekSlide =
  | { kind: "exercise"; exercise: ExerciseOverview; scheduleId: string }
  | { kind: "add"; isEmptyDay: boolean };

type AssignmentWithWeekday = WeeklyPlanItem & { weekday: number };

type ActionContext = {
  exercise: ExerciseOverview;
  source: HomeMode;
  scheduleId?: string;
};

type ExerciseFormState = {
  type: string;
  goal: string;
};

function WeekdayChips({
  weekday,
  onChange,
}: {
  weekday: number;
  onChange: (weekday: number) => void;
}) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {WEEKDAY_ORDER_MONDAY_FIRST.map((dayIndex) => {
        const active = dayIndex === weekday;

        return (
          <button
            key={dayIndex}
            type="button"
            className={`rounded-2xl border px-2 py-3 text-center text-xs font-semibold transition-colors ${
              active
                ? "border-zinc-100 bg-zinc-100 text-black"
                : "border-zinc-900 bg-zinc-950/70 text-zinc-400 hover:text-zinc-100"
            }`}
            onClick={() => onChange(dayIndex)}
          >
            {WEEKDAY_LABELS_RU[dayIndex]}
          </button>
        );
      })}
    </div>
  );
}

function SystemCard({
  title,
  description,
  cta,
  onClick,
  testId,
}: {
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
  testId: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className="block w-full rounded-[2rem] border border-dashed border-zinc-800 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_32%),linear-gradient(180deg,rgba(17,17,17,0.96),rgba(4,4,5,1))] p-6 text-left"
    >
      <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-zinc-100">
        <Plus className="size-5" />
      </div>
      <div className="mt-6 space-y-2">
        <div className="text-2xl font-semibold tracking-tight text-zinc-50">{title}</div>
        <p className="text-sm leading-6 text-zinc-400">{description}</p>
      </div>
      <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-100">
        <Sparkles className="size-4" />
        <span>{cta}</span>
      </div>
    </button>
  );
}

function EmptyPlannerCard({
  weekday,
  onAdd,
}: {
  weekday: number;
  onAdd: () => void;
}) {
  return (
    <div className="rounded-[2rem] border border-zinc-900 bg-zinc-950/80 p-6">
      <div className="flex items-center gap-3 text-zinc-100">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-white/[0.05]">
          <CalendarDays className="size-5" />
        </div>
        <div>
          <div className="text-lg font-semibold">День пока пустой</div>
          <div className="text-sm text-zinc-400">
            На {WEEKDAY_LABELS_RU[weekday]} еще нет назначенных упражнений.
          </div>
        </div>
      </div>
      <Button className="mt-6 w-full rounded-2xl" onClick={onAdd}>
        Добавить на день
      </Button>
    </div>
  );
}

function ActionSheetButton({
  label,
  icon,
  onClick,
  destructive = false,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left text-sm font-medium transition-colors ${
        destructive
          ? "border-red-950/70 bg-red-950/20 text-red-200 hover:bg-red-950/30"
          : "border-zinc-900 bg-zinc-950 text-zinc-100 hover:bg-zinc-900"
      }`}
      onClick={onClick}
    >
      <span>{label}</span>
      {icon}
    </button>
  );
}

function ExerciseForm({
  form,
  onChange,
  onSubmit,
  submitLabel,
  busy,
}: {
  form: ExerciseFormState;
  onChange: (next: ExerciseFormState) => void;
  onSubmit: () => void;
  submitLabel: string;
  busy: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="exercise-type">
          Название
        </label>
        <Input
          id="exercise-type"
          value={form.type}
          onChange={(event) => onChange({ ...form, type: event.target.value })}
          placeholder="Например: Подтягивания"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="exercise-goal">
          Цель на день
        </label>
        <Input
          id="exercise-goal"
          type="number"
          min="1"
          max="10000"
          value={form.goal}
          onChange={(event) => onChange({ ...form, goal: event.target.value })}
          placeholder="Например: 100"
        />
      </div>

      <Button className="w-full rounded-2xl" onClick={onSubmit} disabled={busy}>
        {busy ? "Сохраняем..." : submitLabel}
      </Button>
    </div>
  );
}

function flattenAssignments(days: WeeklyPlanDay[]) {
  return days.flatMap((day) =>
    day.items.map((item) => ({
      ...item,
      weekday: day.weekday,
    }))
  );
}

export function HomePageClient() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { data: overview } = useSuspenseQuery(
    trainingOverviewQueryOptions({
      includeRecentHistory: true,
      recentLimit: DEFAULT_RECENT_LIMIT,
    })
  );
  const { data: weeklyPlan } = useSuspenseQuery(weeklyPlanQueryOptions());

  const todayWeekday = useMemo(
    () => getDefaultWeekdayForTimezone(overview.timezone),
    [overview.timezone]
  );
  const mode = normalizeHomeMode(searchParams.get("mode"));

  const [selectedWeekday, setSelectedWeekday] = useState(todayWeekday);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [actionContext, setActionContext] = useState<ActionContext | null>(null);
  const [createSheet, setCreateSheet] = useState<{ open: boolean; weekday: number | null }>({
    open: false,
    weekday: null,
  });
  const [createForm, setCreateForm] = useState<ExerciseFormState>({ type: "", goal: "" });
  const [editContext, setEditContext] = useState<ExerciseOverview | null>(null);
  const [editForm, setEditForm] = useState<ExerciseFormState>({ type: "", goal: "" });
  const [planningContext, setPlanningContext] = useState<ExerciseOverview | null>(null);
  const [addToDayOpen, setAddToDayOpen] = useState(false);

  useEffect(() => {
    setSelectedWeekday(todayWeekday);
  }, [todayWeekday]);

  useEffect(() => {
    if (!editContext) {
      return;
    }

    setEditForm({
      type: editContext.type,
      goal: String(editContext.goal),
    });
  }, [editContext]);

  const allAssignments = useMemo(() => flattenAssignments(weeklyPlan.days), [weeklyPlan.days]);
  const overviewMap = useMemo(
    () => new Map(overview.exercises.map((exercise) => [exercise.id, exercise])),
    [overview.exercises]
  );

  const todayAssignments = useMemo(
    () => weeklyPlan.days.find((day) => day.weekday === todayWeekday)?.items ?? [],
    [todayWeekday, weeklyPlan.days]
  );

  const selectedDayAssignments = useMemo(
    () => weeklyPlan.days.find((day) => day.weekday === selectedWeekday)?.items ?? [],
    [selectedWeekday, weeklyPlan.days]
  );

  const todaySlides = useMemo<TodaySlide[]>(() => {
    if (overview.exercises.length === 0) {
      return [{ kind: "add" }];
    }

    const scheduledIds = new Set(todayAssignments.map((item) => item.exerciseId));
    const scheduledSlides = todayAssignments
      .map((item) => overviewMap.get(item.exerciseId))
      .filter((exercise): exercise is ExerciseOverview => Boolean(exercise))
      .map((exercise) => ({ kind: "exercise" as const, exercise }));
    const unscheduledSlides = overview.exercises
      .filter((exercise) => !scheduledIds.has(exercise.id))
      .map((exercise) => ({ kind: "exercise" as const, exercise }));

    return [...scheduledSlides, ...unscheduledSlides, { kind: "add" }];
  }, [overview.exercises, overviewMap, todayAssignments]);

  const weekSlides = useMemo<WeekSlide[]>(() => {
    const plannedSlides = selectedDayAssignments
      .map((item) => {
        const exercise = overviewMap.get(item.exerciseId);
        if (!exercise) {
          return null;
        }

        return {
          kind: "exercise" as const,
          exercise,
          scheduleId: item.scheduleId,
        };
      })
      .filter((item): item is Extract<WeekSlide, { kind: "exercise" }> => Boolean(item));

    if (plannedSlides.length === 0) {
      return [{ kind: "add", isEmptyDay: true }];
    }

    return [...plannedSlides, { kind: "add", isEmptyDay: false }];
  }, [overviewMap, selectedDayAssignments]);

  const slides = mode === "today" ? todaySlides : weekSlides;
  const emblaOptions = useMemo(
    () =>
      ({
        loop: slides.length > 1,
        align: "start" as const,
      }) as const,
    [slides.length]
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const updateSelectedIndex = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    updateSelectedIndex();
    emblaApi.on("select", updateSelectedIndex);

    return () => {
      emblaApi.off("select", updateSelectedIndex);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    emblaApi.reInit(emblaOptions);
    emblaApi.scrollTo(0, true);
    setSelectedIndex(0);
  }, [emblaApi, emblaOptions, mode, selectedWeekday]);

  const assignedExerciseIdsForSelectedDay = useMemo(
    () => new Set(selectedDayAssignments.map((item) => item.exerciseId)),
    [selectedDayAssignments]
  );

  const availableExercisesForSelectedDay = useMemo(
    () => overview.exercises.filter((exercise) => !assignedExerciseIdsForSelectedDay.has(exercise.id)),
    [assignedExerciseIdsForSelectedDay, overview.exercises]
  );

  function closeCreateSheet() {
    setCreateSheet({ open: false, weekday: null });
    setCreateForm({ type: "", goal: "" });
  }

  function openCreateSheet(weekday: number | null) {
    setCreateForm({ type: "", goal: "" });
    setCreateSheet({ open: true, weekday });
  }

  const createSetMutation = useMutation({
    mutationFn: (payload: { exerciseId: string; reps: number }) =>
      createSet({
        exerciseId: payload.exerciseId,
        reps: payload.reps,
        source: "quickbutton",
      }),
    onMutate: async (payload) => {
      setMessage(null);
      await queryClient.cancelQueries({ queryKey: queryKeys.trainingOverviewRoot });

      const previousOverviews = snapshotTrainingOverviewCaches(queryClient);

      applyCreatedSetToOverviewCaches(queryClient, {
        id: `optimistic-${crypto.randomUUID()}`,
        exercise_id: payload.exerciseId,
        reps: payload.reps,
        created_at: new Date().toISOString(),
        note: null,
        source: "quickbutton",
      });

      return { previousOverviews };
    },
    onError: (error, _payload, context) => {
      if (context) {
        restoreTrainingOverviewCaches(queryClient, context.previousOverviews);
      }

      setMessage(
        `Ошибка: ${error instanceof Error ? error.message : "Не удалось сохранить подход"}`
      );
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.trainingOverviewRoot,
          refetchType: "inactive",
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.trainingStats }),
      ]);
    },
  });

  const createExerciseMutation = useMutation({
    mutationFn: async (payload: { type: string; goal: number; weekday: number | null }) => {
      const exercise = await createExercise({
        type: payload.type,
        goal: payload.goal,
      });

      let assignment: PlanApiRecord | null = null;
      if (payload.weekday !== null) {
        assignment = await createPlanAssignment({
          exerciseId: exercise.id,
          weekday: payload.weekday,
        });
      }

      return { exercise, assignment };
    },
    onSuccess: ({ exercise, assignment }) => {
      closeCreateSheet();
      applyCreatedExerciseToOverviewCaches(queryClient, exercise);
      if (assignment) {
        applyCreatedPlanAssignmentToCaches(queryClient, assignment, exercise);
      }
      setMessage("Упражнение создано");
      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.trainingOverviewRoot,
          refetchType: "inactive",
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.trainingStats, refetchType: "inactive" }),
        queryClient.invalidateQueries({ queryKey: queryKeys.weeklyPlan, refetchType: "inactive" }),
        queryClient.invalidateQueries({ queryKey: queryKeys.profileSnapshot, refetchType: "inactive" }),
      ]);
    },
    onError: (error) => {
      setMessage(
        `Ошибка: ${error instanceof Error ? error.message : "Не удалось создать упражнение"}`
      );
    },
  });

  const updateExerciseMutation = useMutation({
    mutationFn: (payload: { id: string; type: string; goal: number }) => updateExercise(payload),
    onSuccess: (exercise) => {
      setEditContext(null);
      applyUpdatedExerciseToCaches(queryClient, exercise);
      setMessage("Упражнение обновлено");
      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.trainingOverviewRoot,
          refetchType: "inactive",
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.trainingStats, refetchType: "inactive" }),
        queryClient.invalidateQueries({ queryKey: queryKeys.weeklyPlan, refetchType: "inactive" }),
        queryClient.invalidateQueries({ queryKey: queryKeys.profileSnapshot, refetchType: "inactive" }),
      ]);
    },
    onError: (error) => {
      setMessage(
        `Ошибка: ${error instanceof Error ? error.message : "Не удалось обновить упражнение"}`
      );
    },
  });

  const deleteExerciseMutation = useMutation({
    mutationFn: (exerciseId: string) => deleteExercise(exerciseId),
    onSuccess: (_deleted, exerciseId) => {
      setActionContext(null);
      setPlanningContext(null);
      applyDeletedExerciseToCaches(queryClient, exerciseId);
      setMessage("Упражнение удалено");
      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.trainingOverviewRoot,
          refetchType: "inactive",
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.trainingStats, refetchType: "inactive" }),
        queryClient.invalidateQueries({ queryKey: queryKeys.weeklyPlan, refetchType: "inactive" }),
        queryClient.invalidateQueries({ queryKey: queryKeys.profileSnapshot, refetchType: "inactive" }),
      ]);
    },
    onError: (error) => {
      setMessage(
        `Ошибка: ${error instanceof Error ? error.message : "Не удалось удалить упражнение"}`
      );
    },
  });

  const createPlanMutation = useMutation({
    mutationFn: (payload: { exerciseId: string; weekday: number }) => createPlanAssignment(payload),
    onSuccess: (assignment, payload) => {
      const exercise = overview.exercises.find((item) => item.id === payload.exerciseId);
      if (exercise) {
        applyCreatedPlanAssignmentToCaches(queryClient, assignment, exercise);
      }

      void Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.weeklyPlan, refetchType: "inactive" }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.trainingOverviewRoot,
          refetchType: "inactive",
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.trainingStats, refetchType: "inactive" }),
      ]);
    },
    onError: (error) => {
      setMessage(
        `Ошибка: ${error instanceof Error ? error.message : "Не удалось назначить упражнение"}`
      );
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: (id: string) => deletePlanAssignment(id),
    onSuccess: (_deleted, assignmentId) => {
      applyDeletedPlanAssignmentToCaches(queryClient, assignmentId);

      void Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.weeklyPlan, refetchType: "inactive" }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.trainingOverviewRoot,
          refetchType: "inactive",
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.trainingStats, refetchType: "inactive" }),
      ]);
    },
    onError: (error) => {
      setMessage(
        `Ошибка: ${error instanceof Error ? error.message : "Не удалось убрать упражнение из плана"}`
      );
    },
  });

  async function handleCreateExerciseSubmit() {
    const goal = Number(createForm.goal);

    if (!createForm.type.trim() || !Number.isFinite(goal) || goal <= 0) {
      setMessage("Заполните название и положительную цель.");
      return;
    }

    await createExerciseMutation.mutateAsync({
      type: createForm.type.trim(),
      goal,
      weekday: createSheet.weekday,
    });
  }

  async function handleEditExerciseSubmit() {
    if (!editContext) {
      return;
    }

    const goal = Number(editForm.goal);

    if (!editForm.type.trim() || !Number.isFinite(goal) || goal <= 0) {
      setMessage("Заполните название и положительную цель.");
      return;
    }

    await updateExerciseMutation.mutateAsync({
      id: editContext.id,
      type: editForm.type.trim(),
      goal,
    });
  }

  async function handleToggleWeekday(exercise: ExerciseOverview, weekday: number) {
    const assignment = allAssignments.find(
      (item) => item.exerciseId === exercise.id && item.weekday === weekday
    );

    if (assignment) {
      await deletePlanMutation.mutateAsync(assignment.scheduleId);
      return;
    }

    await createPlanMutation.mutateAsync({
      exerciseId: exercise.id,
      weekday,
    });
  }

  async function handleDeleteExercise(exercise: ExerciseOverview) {
    const confirmed = window.confirm(`Удалить упражнение «${exercise.type}»?`);
    if (!confirmed) {
      return;
    }

    await deleteExerciseMutation.mutateAsync(exercise.id);
  }

  const busy =
    createSetMutation.isPending ||
    createExerciseMutation.isPending ||
    updateExerciseMutation.isPending ||
    deleteExerciseMutation.isPending ||
    createPlanMutation.isPending ||
    deletePlanMutation.isPending;

  return (
    <main className="app-screen">
      <div className="screen-stack screen-stack--spacious">
        <section className="space-y-4">
          {message ? (
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
              {message}
            </div>
          ) : null}

          {mode === "week" ? (
            <WeekdayChips weekday={selectedWeekday} onChange={setSelectedWeekday} />
          ) : null}

          <div className="overflow-hidden" ref={emblaRef} data-testid="home-carousel-viewport">
            <div className="flex touch-pan-y">
              {slides.map((slide, index) => (
                <div
                  key={`${mode}-${index}-${slide.kind === "exercise" ? slide.exercise.id : "system"}`}
                  className="min-w-0 flex-[0_0_100%]"
                  data-testid={slide.kind === "add" ? "carousel-add-card" : "carousel-exercise-card"}
                >
                  {slide.kind === "exercise" ? (
                    <ExerciseProgressCard
                      className="pb-0"
                      exercise={slide.exercise.type}
                      current={slide.exercise.todayTotal}
                      target={slide.exercise.goal}
                      recentReps={slide.exercise.recentReps}
                      chart={slide.exercise.chart}
                      lastSetTime={slide.exercise.lastSetTime}
                      variant={mode === "today" ? "active" : "planned"}
                      statusLabel={
                        mode === "week" ? `План на ${WEEKDAY_LABELS_RU[selectedWeekday]}` : undefined
                      }
                      onCommit={
                        mode === "today"
                          ? async (reps) => {
                              await createSetMutation.mutateAsync({
                                exerciseId: slide.exercise.id,
                                reps,
                              });
                            }
                          : undefined
                      }
                      actions={
                        <Button
                          variant="secondary"
                          size="icon-sm"
                          className="rounded-full border border-white/10 bg-black/30 text-white hover:bg-white/10"
                          aria-label="Открыть действия"
                          onClick={() =>
                            setActionContext({
                              exercise: slide.exercise,
                              source: mode,
                              scheduleId: ("scheduleId" in slide ? slide.scheduleId : undefined) as
                                | string
                                | undefined,
                            })
                          }
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      }
                    />
                  ) : mode === "today" ? (
                    <SystemCard
                      title="Добавить упражнение"
                      description="Создайте новую карточку и сразу начните логировать подходы в карусели."
                      cta="Создать упражнение"
                      onClick={() => openCreateSheet(null)}
                      testId="today-add-exercise"
                    />
                  ) : "isEmptyDay" in slide && slide.isEmptyDay ? (
                    <EmptyPlannerCard weekday={selectedWeekday} onAdd={() => setAddToDayOpen(true)} />
                  ) : (
                    <SystemCard
                      title="Добавить на день"
                      description="Выберите существующее упражнение или создайте новое и сразу поставьте его в план."
                      cta="Назначить упражнение"
                      onClick={() => setAddToDayOpen(true)}
                      testId="week-add-to-day"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {slides.length > 1 ? (
            <div className="flex items-center justify-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={`${slide.kind}-${index}`}
                  type="button"
                  className={`size-2 rounded-full transition-all ${
                    index === selectedIndex ? "bg-zinc-100" : "bg-zinc-700"
                  }`}
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Перейти к карточке ${index + 1}`}
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>

      <BottomSheet
        open={Boolean(actionContext)}
        onClose={() => setActionContext(null)}
        title={actionContext?.exercise.type ?? "Действия"}
        description={
          actionContext?.source === "week"
            ? "Управление упражнением в недельном плане."
            : "Управление карточкой упражнения."
        }
      >
        {actionContext ? (
          <div className="space-y-3">
            <ActionSheetButton
              label={actionContext.source === "week" ? "Переназначить по дням" : "План на неделю"}
              icon={<CalendarDays className="size-4" />}
              onClick={() => {
                setPlanningContext(actionContext.exercise);
                setActionContext(null);
              }}
            />

            {actionContext.source === "week" && actionContext.scheduleId ? (
              <ActionSheetButton
                label="Убрать из этого дня"
                icon={<CalendarDays className="size-4" />}
                onClick={async () => {
                  await deletePlanMutation.mutateAsync(actionContext.scheduleId!);
                  setActionContext(null);
                }}
              />
            ) : null}

            <ActionSheetButton
              label="Редактировать"
              icon={<Pencil className="size-4" />}
              onClick={() => {
                setEditContext(actionContext.exercise);
                setActionContext(null);
              }}
            />

            <ActionSheetButton
              label="Удалить упражнение"
              icon={<Trash2 className="size-4" />}
              destructive
              onClick={() => void handleDeleteExercise(actionContext.exercise)}
            />
          </div>
        ) : null}
      </BottomSheet>

      <BottomSheet
        open={createSheet.open}
        onClose={closeCreateSheet}
        title={createSheet.weekday === null ? "Новое упражнение" : "Создать и назначить"}
        description={
          createSheet.weekday === null
            ? "Новая карточка появится в сегодняшней карусели."
            : `Создайте упражнение и сразу поставьте его на ${WEEKDAY_LABELS_RU[createSheet.weekday]}.`
        }
      >
        <ExerciseForm
          form={createForm}
          onChange={setCreateForm}
          onSubmit={() => void handleCreateExerciseSubmit()}
          submitLabel={
            createSheet.weekday === null ? "Создать упражнение" : "Создать и назначить"
          }
          busy={createExerciseMutation.isPending}
        />
      </BottomSheet>

      <BottomSheet
        open={Boolean(editContext)}
        onClose={() => setEditContext(null)}
        title={editContext ? `Редактировать: ${editContext.type}` : "Редактировать упражнение"}
        description="Измените название и дневную цель. Карточка и статистика обновятся после сохранения."
      >
        <ExerciseForm
          form={editForm}
          onChange={setEditForm}
          onSubmit={() => void handleEditExerciseSubmit()}
          submitLabel="Сохранить изменения"
          busy={updateExerciseMutation.isPending}
        />
      </BottomSheet>

      <BottomSheet
        open={Boolean(planningContext)}
        onClose={() => setPlanningContext(null)}
        title={planningContext ? `План: ${planningContext.type}` : "План на неделю"}
        description="Включайте дни, на которые упражнение должно попадать в недельный сценарий."
      >
        {planningContext ? (
          <div className="grid grid-cols-2 gap-3">
            {WEEKDAY_ORDER_MONDAY_FIRST.map((weekday) => {
              const active = allAssignments.some(
                (item) => item.exerciseId === planningContext.id && item.weekday === weekday
              );

              return (
                <button
                  key={weekday}
                  type="button"
                  className={`rounded-2xl border px-4 py-4 text-sm font-medium transition-colors ${
                    active
                      ? "border-zinc-100 bg-zinc-100 text-black"
                      : "border-zinc-900 bg-zinc-950 text-zinc-200"
                  }`}
                  onClick={() => void handleToggleWeekday(planningContext, weekday)}
                  disabled={busy}
                >
                  {WEEKDAY_LABELS_RU[weekday]}
                </button>
              );
            })}
          </div>
        ) : null}
      </BottomSheet>

      <BottomSheet
        open={addToDayOpen}
        onClose={() => setAddToDayOpen(false)}
        title={`Добавить на ${WEEKDAY_LABELS_RU[selectedWeekday]}`}
        description="Сначала выберите существующее упражнение. Если нужного нет, создайте новое прямо из этого сценария."
      >
        <div className="space-y-3">
          {availableExercisesForSelectedDay.length > 0 ? (
            availableExercisesForSelectedDay.map((exercise) => (
              <button
                key={exercise.id}
                type="button"
                className="flex w-full items-center justify-between rounded-2xl border border-zinc-900 bg-zinc-950 px-4 py-4 text-left"
                onClick={async () => {
                  await createPlanMutation.mutateAsync({
                    exerciseId: exercise.id,
                    weekday: selectedWeekday,
                  });
                  setAddToDayOpen(false);
                }}
                disabled={busy}
              >
                <div>
                  <div className="font-medium text-zinc-100">{exercise.type}</div>
                  <div className="text-sm text-zinc-400">Цель {exercise.goal} в день</div>
                </div>
                <Plus className="size-4 text-zinc-400" />
              </button>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/70 px-4 py-5 text-sm text-zinc-400">
              Все упражнения уже назначены на этот день.
            </div>
          )}

          <Button
            variant="secondary"
            className="w-full rounded-2xl"
            onClick={() => {
              setAddToDayOpen(false);
              openCreateSheet(selectedWeekday);
            }}
          >
            Создать новое упражнение
          </Button>
        </div>
      </BottomSheet>
    </main>
  );
}
