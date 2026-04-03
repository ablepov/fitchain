"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  createExercise,
  deleteExercise,
  saveTimezone,
  updateExercise,
} from "@/lib/apiClient";
import {
  applyCreatedExerciseToProfile,
  applyDeletedExerciseToProfile,
  applyTimezoneToCaches,
  applyUpdatedExerciseToProfile,
  restoreTrainingOverviewCaches,
  snapshotTrainingOverviewCaches,
} from "@/lib/cacheUpdates";
import { queryKeys } from "@/lib/queryKeys";
import { profileSnapshotQueryOptions } from "@/lib/queryOptions";
import type { ProfilePageData } from "@/lib/trainingData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const timezones = ["Europe/Moscow", "UTC", "Europe/Berlin", "America/New_York", "Asia/Tokyo"];
const EXERCISE_NAME_PATTERN = /^[\p{L}\p{N}\s]+$/u;

type Exercise = {
  id: string;
  type: string;
  goal: number;
};

export function ProfilePageClient() {
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(profileSnapshotQueryOptions());
  const [timezone, setTimezone] = useState(data.timezone);
  const [message, setMessage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newExercise, setNewExercise] = useState({ type: "", goal: "" });
  const [formErrors, setFormErrors] = useState<{ type?: string; goal?: string }>({});

  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [editForm, setEditForm] = useState({ type: "", goal: "" });
  const [editErrors, setEditErrors] = useState<{ type?: string; goal?: string }>({});

  useEffect(() => {
    setTimezone(data.timezone);
  }, [data.timezone]);

  const timezoneMutation = useMutation({
    mutationFn: saveTimezone,
    onMutate: async (nextTimezone) => {
      setMessage(null);
      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.trainingOverviewRoot }),
        queryClient.cancelQueries({ queryKey: queryKeys.profileSnapshot }),
      ]);

      const previousProfile = queryClient.getQueryData<ProfilePageData>(queryKeys.profileSnapshot);
      const previousOverviews = snapshotTrainingOverviewCaches(queryClient);

      applyTimezoneToCaches(queryClient, nextTimezone);

      return {
        previousProfile,
        previousOverviews,
      };
    },
    onError: (error, _variables, context) => {
      if (context) {
        restoreTrainingOverviewCaches(queryClient, context.previousOverviews);
        queryClient.setQueryData(queryKeys.profileSnapshot, context.previousProfile);
      }

      setMessage(`Ошибка: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`);
    },
    onSuccess: ({ timezone: savedTimezone }) => {
      setTimezone(savedTimezone);
      applyTimezoneToCaches(queryClient, savedTimezone);
      setMessage("Таймзона сохранена");
    },
  });

  const createExerciseMutation = useMutation({
    mutationFn: createExercise,
    onSuccess: (exercise) => {
      applyCreatedExerciseToProfile(queryClient, exercise);
      queryClient.invalidateQueries({ queryKey: queryKeys.trainingOverviewRoot });
      setMessage(`Упражнение "${exercise.type}" создано`);
      setShowCreateForm(false);
      setNewExercise({ type: "", goal: "" });
      setFormErrors({});
    },
    onError: (error) => {
      setMessage(`Ошибка: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`);
    },
  });

  const updateExerciseMutation = useMutation({
    mutationFn: updateExercise,
    onSuccess: (exercise) => {
      applyUpdatedExerciseToProfile(queryClient, exercise);
      queryClient.invalidateQueries({ queryKey: queryKeys.trainingOverviewRoot });
      setMessage(`Упражнение "${exercise.type}" обновлено`);
      setEditingExercise(null);
      setEditForm({ type: "", goal: "" });
      setEditErrors({});
    },
    onError: (error) => {
      setMessage(`Ошибка: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`);
    },
  });

  const deleteExerciseMutation = useMutation({
    mutationFn: deleteExercise,
    onSuccess: (result) => {
      applyDeletedExerciseToProfile(queryClient, result.id);
      queryClient.invalidateQueries({ queryKey: queryKeys.trainingOverviewRoot });
      setMessage(`Упражнение "${result.type}" удалено`);
      setDeleteConfirm(null);
    },
    onError: (error) => {
      setMessage(`Ошибка: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`);
    },
  });

  function validateForm(): boolean {
    const errors: { type?: string; goal?: string } = {};

    if (!newExercise.type.trim()) {
      errors.type = "Название обязательно";
    } else if (newExercise.type.trim().length < 2) {
      errors.type = "Название должно содержать минимум 2 символа";
    } else if (newExercise.type.trim().length > 100) {
      errors.type = "Название не должно превышать 100 символов";
    } else if (!EXERCISE_NAME_PATTERN.test(newExercise.type.trim())) {
      errors.type = "Название может содержать только буквы, цифры и пробелы";
    }

    if (
      newExercise.type.trim() &&
      data.exercises.some((exercise) => exercise.type.toLowerCase() === newExercise.type.trim().toLowerCase())
    ) {
      errors.type = "Упражнение с таким названием уже существует";
    }

    const goalNum = parseInt(newExercise.goal, 10);
    if (!newExercise.goal.trim()) {
      errors.goal = "Цель обязательна";
    } else if (Number.isNaN(goalNum) || goalNum <= 0) {
      errors.goal = "Цель должна быть числом больше 0";
    } else if (goalNum > 10000) {
      errors.goal = "Цель не должна превышать 10000";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateEditForm(): boolean {
    const errors: { type?: string; goal?: string } = {};

    if (!editForm.type.trim()) {
      errors.type = "Название обязательно";
    } else if (editForm.type.trim().length < 2) {
      errors.type = "Название должно содержать минимум 2 символа";
    } else if (editForm.type.trim().length > 100) {
      errors.type = "Название не должно превышать 100 символов";
    } else if (!EXERCISE_NAME_PATTERN.test(editForm.type.trim())) {
      errors.type = "Название может содержать только буквы, цифры и пробелы";
    }

    if (editForm.type.trim() && editingExercise) {
      const currentType = editingExercise.type.toLowerCase();
      const updatedType = editForm.type.trim().toLowerCase();

      if (currentType !== updatedType && data.exercises.some((exercise) => exercise.type.toLowerCase() === updatedType)) {
        errors.type = "Упражнение с таким названием уже существует";
      }
    }

    const goalNum = parseInt(editForm.goal, 10);
    if (!editForm.goal.trim()) {
      errors.goal = "Цель обязательна";
    } else if (Number.isNaN(goalNum) || goalNum <= 0) {
      errors.goal = "Цель должна быть числом больше 0";
    } else if (goalNum > 10000) {
      errors.goal = "Цель не должна превышать 10000";
    }

    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  }

  return (
    <main className="app-screen">
      <div className="screen-stack">
        <Card>
          <CardHeader>
            <CardTitle>Профиль</CardTitle>
            <CardDescription>Настройки аккаунта и управление упражнениями в едином тёмном интерфейсе.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.email ? (
              <div className="rounded-2xl border border-zinc-900 bg-black/70 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Email</div>
                <div className="mt-2 text-sm text-zinc-200">{data.email}</div>
              </div>
            ) : null}

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300" htmlFor="profile-timezone">
                Часовой пояс
              </label>
              <Select id="profile-timezone" value={timezone} onChange={(event) => setTimezone(event.target.value)}>
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Button
                disabled={timezoneMutation.isPending}
                className="rounded-2xl"
                onClick={() => void timezoneMutation.mutateAsync(timezone)}
              >
                {timezoneMutation.isPending ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>

            {message ? (
              <div
                className={`rounded-2xl border px-3 py-2 text-sm ${
                  message.startsWith("Ошибка")
                    ? "border-red-950/80 bg-zinc-950 text-red-200"
                    : "border-zinc-900 bg-zinc-950 text-zinc-400"
                }`}
              >
                {message}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {editingExercise ? (
          <Card>
            <CardHeader>
              <CardTitle>Редактировать упражнение</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300" htmlFor="edit-type">
                  Название упражнения
                </label>
                <Input
                  id="edit-type"
                  type="text"
                  value={editForm.type}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, type: event.target.value }))}
                  placeholder="Например: Бег, Плавание, Жим гантелей"
                />
                {editErrors.type ? <p className="text-sm text-red-200">{editErrors.type}</p> : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300" htmlFor="edit-goal">
                  Цель
                </label>
                <Input
                  id="edit-goal"
                  type="number"
                  value={editForm.goal}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, goal: event.target.value }))}
                  placeholder="Например: 50"
                  min="1"
                  max="10000"
                />
                {editErrors.goal ? <p className="text-sm text-red-200">{editErrors.goal}</p> : null}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="rounded-2xl"
                  onClick={() => {
                    if (!editingExercise || !validateEditForm()) return;

                    void updateExerciseMutation.mutateAsync({
                      id: editingExercise.id,
                      type: editForm.type.trim(),
                      goal: parseInt(editForm.goal, 10),
                    });
                  }}
                  disabled={updateExerciseMutation.isPending}
                >
                  {updateExerciseMutation.isPending ? "Сохранение..." : "Сохранить"}
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-2xl"
                  onClick={() => {
                    setEditingExercise(null);
                    setEditForm({ type: "", goal: "" });
                    setEditErrors({});
                  }}
                >
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Управление упражнениями</CardTitle>
            <CardDescription>Создание, редактирование и удаление упражнений без смены контекста.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full rounded-2xl" onClick={() => setShowCreateForm(true)}>
              Создать новое упражнение
            </Button>

            {showCreateForm ? (
              <div className="space-y-4 rounded-2xl border border-zinc-900 bg-black/70 p-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300" htmlFor="new-type">
                    Название упражнения
                  </label>
                  <Input
                    id="new-type"
                    type="text"
                    value={newExercise.type}
                    onChange={(event) => setNewExercise((prev) => ({ ...prev, type: event.target.value }))}
                    placeholder="Например: Бег, Плавание, Жим гантелей"
                  />
                  {formErrors.type ? <p className="text-sm text-red-200">{formErrors.type}</p> : null}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300" htmlFor="new-goal">
                    Цель
                  </label>
                  <Input
                    id="new-goal"
                    type="number"
                    value={newExercise.goal}
                    onChange={(event) => setNewExercise((prev) => ({ ...prev, goal: event.target.value }))}
                    placeholder="Например: 50"
                    min="1"
                    max="10000"
                  />
                  {formErrors.goal ? <p className="text-sm text-red-200">{formErrors.goal}</p> : null}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="rounded-2xl"
                    disabled={createExerciseMutation.isPending}
                    onClick={() => {
                      if (!validateForm()) return;

                      void createExerciseMutation.mutateAsync({
                        type: newExercise.type.trim(),
                        goal: parseInt(newExercise.goal, 10),
                      });
                    }}
                  >
                    {createExerciseMutation.isPending ? "Создание..." : "Создать"}
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-2xl"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewExercise({ type: "", goal: "" });
                      setFormErrors({});
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            ) : null}

            {data.exercises.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-900 bg-black/60 px-4 py-6 text-center text-sm text-zinc-500">
                Пока нет упражнений
              </div>
            ) : (
              <div className="space-y-3">
                {data.exercises.map((exercise) => (
                  <div key={exercise.id} className="rounded-2xl border border-zinc-900 bg-black/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold capitalize text-zinc-100">{exercise.type}</div>
                        <div className="mt-1 text-sm text-zinc-400">Цель: {exercise.goal}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="rounded-full"
                          onClick={() => {
                            setEditingExercise(exercise);
                            setEditForm({ type: exercise.type, goal: exercise.goal.toString() });
                            setEditErrors({});
                          }}
                        >
                          Редактировать
                        </Button>
                        {deleteConfirm === exercise.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="rounded-full"
                              disabled={deleteExerciseMutation.isPending}
                              onClick={() => void deleteExerciseMutation.mutateAsync(exercise.id)}
                            >
                              Удалить
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="rounded-full"
                              onClick={() => setDeleteConfirm(null)}
                            >
                              Отмена
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full"
                            onClick={() => setDeleteConfirm(exercise.id)}
                          >
                            Удалить
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
