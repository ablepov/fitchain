"use client";

import { useState } from "react";
import {
  createExerciseAction,
  deleteExerciseAction,
  saveProfileTimezoneAction,
  updateExerciseAction,
} from "@/app/profile/actions";
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

interface ProfileClientProps {
  initialEmail: string | null;
  initialTimezone: string;
  initialExercises: Exercise[];
}

export function ProfileClient({ initialEmail, initialTimezone, initialExercises }: ProfileClientProps) {
  const [email] = useState(initialEmail);
  const [timezone, setTimezone] = useState(initialTimezone);
  const [savingTz, setSavingTz] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newExercise, setNewExercise] = useState({ type: "", goal: "" });
  const [formErrors, setFormErrors] = useState<{ type?: string; goal?: string }>({});
  const [creatingNew, setCreatingNew] = useState(false);

  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [editForm, setEditForm] = useState({ type: "", goal: "" });
  const [editErrors, setEditErrors] = useState<{ type?: string; goal?: string }>({});
  const [updating, setUpdating] = useState(false);

  async function onSaveTimezone() {
    setSavingTz(true);
    setMessage(null);

    const result = await saveProfileTimezoneAction(timezone);
    setSavingTz(false);
    setMessage(result.message);
  }

  async function deleteExercise(exerciseId: string, exerciseType: string) {
    setDeletingId(exerciseId);
    setMessage(null);

    const result = await deleteExerciseAction({ id: exerciseId });

    if (!result.ok) {
      setMessage(result.message);
      setDeletingId(null);
      return;
    }

    setExercises((prev) => prev.filter((item) => item.id !== exerciseId));
    setMessage(`Упражнение "${exerciseType}" удалено`);
    setDeletingId(null);
  }

  function confirmDelete(exercise: Exercise) {
    setDeleteConfirm(exercise.id);
  }

  function cancelDelete() {
    setDeleteConfirm(null);
  }

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
      exercises.some((exercise) => exercise.type.toLowerCase() === newExercise.type.trim().toLowerCase())
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

  async function createNewExercise() {
    if (!validateForm()) return;

    setCreatingNew(true);
    setMessage(null);

    const result = await createExerciseAction({
      type: newExercise.type.trim(),
      goal: parseInt(newExercise.goal, 10),
    });

    setCreatingNew(false);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setExercises((prev) => [...prev, result.data]);
    setMessage(result.message);
    setShowCreateForm(false);
    setNewExercise({ type: "", goal: "" });
    setFormErrors({});
  }

  function openCreateForm() {
    setShowCreateForm(true);
    setNewExercise({ type: "", goal: "" });
    setFormErrors({});
  }

  function closeCreateForm() {
    setShowCreateForm(false);
    setNewExercise({ type: "", goal: "" });
    setFormErrors({});
  }

  function startEdit(exercise: Exercise) {
    setEditingExercise(exercise);
    setEditForm({ type: exercise.type, goal: exercise.goal.toString() });
    setEditErrors({});
  }

  function cancelEdit() {
    setEditingExercise(null);
    setEditForm({ type: "", goal: "" });
    setEditErrors({});
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

      if (currentType !== updatedType && exercises.some((exercise) => exercise.type.toLowerCase() === updatedType)) {
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

  async function updateExercise() {
    if (!editingExercise || !validateEditForm()) return;

    setUpdating(true);
    setMessage(null);

    const result = await updateExerciseAction({
      id: editingExercise.id,
      type: editForm.type.trim(),
      goal: parseInt(editForm.goal, 10),
    });

    setUpdating(false);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setExercises((prev) => prev.map((item) => (item.id === editingExercise.id ? result.data : item)));
    setMessage(result.message);
    cancelEdit();
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
            {email ? (
              <div className="rounded-2xl border border-zinc-900 bg-black/70 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Email</div>
                <div className="mt-2 text-sm text-zinc-200">{email}</div>
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
              <Button disabled={savingTz} className="rounded-2xl" onClick={onSaveTimezone}>
                {savingTz ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>

            {message ? (
              <div className="rounded-2xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-sm text-zinc-400">
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
                <Button className="rounded-2xl" onClick={updateExercise} disabled={updating}>
                  {updating ? "Сохранение..." : "Сохранить"}
                </Button>
                <Button variant="secondary" className="rounded-2xl" onClick={cancelEdit}>
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
            <Button className="w-full rounded-2xl" onClick={openCreateForm}>
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
                    placeholder="Например: 100"
                    min="1"
                    max="10000"
                  />
                  {formErrors.goal ? <p className="text-sm text-red-200">{formErrors.goal}</p> : null}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button className="rounded-2xl" onClick={createNewExercise} disabled={creatingNew}>
                    {creatingNew ? "Создание..." : "Создать"}
                  </Button>
                  <Button variant="secondary" className="rounded-2xl" onClick={closeCreateForm}>
                    Отмена
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Текущие упражнения</CardTitle>
          </CardHeader>
          <CardContent>
            {exercises.length === 0 ? (
              <p className="text-sm text-zinc-500">Пока нет упражнений</p>
            ) : (
              <ul className="space-y-3">
                {exercises.map((exercise) => (
                  <li
                    key={exercise.id}
                    className="flex flex-col gap-3 rounded-2xl border border-zinc-900 bg-black/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="text-sm font-semibold capitalize text-zinc-100">{exercise.type}</div>
                      <div className="mt-1 text-sm text-zinc-500">Цель: {exercise.goal}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:flex">
                      <Button variant="secondary" size="sm" className="rounded-xl" onClick={() => startEdit(exercise)}>
                        Редактировать
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => confirmDelete(exercise)}
                        disabled={deletingId === exercise.id}
                      >
                        {deletingId === exercise.id ? "Удаление..." : "Удалить"}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {deleteConfirm ? (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-4 sm:items-center">
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>Подтвердите удаление</CardTitle>
                <CardDescription>
                  Вы действительно хотите удалить упражнение "
                  {exercises.find((exercise) => exercise.id === deleteConfirm)?.type}"?
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Button variant="secondary" className="rounded-2xl" onClick={cancelDelete}>
                  Отмена
                </Button>
                <Button
                  variant="destructive"
                  className="rounded-2xl"
                  onClick={() => {
                    const exercise = exercises.find((item) => item.id === deleteConfirm);
                    if (exercise) {
                      void deleteExercise(exercise.id, exercise.type);
                      setDeleteConfirm(null);
                    }
                  }}
                >
                  Удалить
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </main>
  );
}
