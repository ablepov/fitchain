"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { logger } from "@/lib/logger";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const timezones = [
  "Europe/Moscow",
  "UTC",
  "Europe/Berlin",
  "America/New_York",
  "Asia/Tokyo",
];

type Exercise = {
  id: string;
  type: string;
  goal: number;
};

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string>("Europe/Moscow");
  const [savingTz, setSavingTz] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [exercises, setExercises] = useState<Exercise[]>([]);
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

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        router.replace("/auth");
        return;
      }
      setEmail(user.email ?? null);

      const { data: profile } = await supabase
        .from("profiles")
        .select("timezone")
        .eq("user_id", user.id)
        .maybeSingle();
      if (profile?.timezone) setTimezone(profile.timezone);

      const { data: ex } = await supabase
        .from("exercises")
        .select("id,type,goal")
        .order("created_at", { ascending: true });
      setExercises(ex ?? []);

      setLoading(false);
    })();
  }, [router]);

  async function onSignOut() {
    await supabase.auth.signOut();
    router.replace("/auth");
  }

  async function onSaveTimezone() {
    setSavingTz(true);
    setMessage(null);
    const { data: me } = await supabase.auth.getUser();
    const userId = me.user?.id;
    if (!userId) {
      setSavingTz(false);
      setMessage("РЎРµСЃСЃРёСЏ РЅРµ РЅР°Р№РґРµРЅР°");
      return;
    }
    const { error } = await supabase.from("profiles").upsert({ user_id: userId, timezone });
    setSavingTz(false);
    setMessage(error ? `Ошибка: ${error.message}` : "Таймзона сохранена");
  }

  async function deleteExercise(exerciseId: string, exerciseType: string) {
    setDeletingId(exerciseId);
    setMessage(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

      const res = await fetch(`/api/exercises/${exerciseId}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setMessage(`Ошибка удаления: ${j.error?.message ?? "Неизвестная ошибка"}`);
        return;
      }

      setExercises((prev) => prev.filter((item) => item.id !== exerciseId));
      setMessage(`Упражнение "${exerciseType}" удалено`);
    } catch (error) {
      logger.warn(
        "Ошибка удаления упражнения",
        "ProfilePage",
        error instanceof Error ? error : new Error(String(error))
      );
      setMessage("Ошибка сети при удалении");
    } finally {
      setDeletingId(null);
    }
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
    } else if (!/^[a-zA-Zа-яА-Я0-9\s]+$/.test(newExercise.type.trim())) {
      errors.type = "Название может содержать только буквы, цифры и пробелы";
    }

    if (
      newExercise.type.trim() &&
      exercises.some((exercise) => exercise.type.toLowerCase() === newExercise.type.trim().toLowerCase())
    ) {
      errors.type = "Упражнение с таким названием уже существует";
    }

    const goalNum = parseInt(newExercise.goal);
    if (!newExercise.goal.trim()) {
      errors.goal = "Цель обязательна";
    } else if (isNaN(goalNum) || goalNum <= 0) {
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

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

      const res = await fetch("/api/exercises", {
        method: "POST",
        headers,
        body: JSON.stringify({
          type: newExercise.type.trim(),
          goal: parseInt(newExercise.goal),
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setMessage(`Ошибка создания: ${j.error?.message ?? "Неизвестная ошибка"}`);
        return;
      }

      const createdExercise = await res.json();
      setExercises((prev) => [...prev, createdExercise.data]);
      setMessage(`Упражнение "${newExercise.type.trim()}" создано`);
      setShowCreateForm(false);
      setNewExercise({ type: "", goal: "" });
      setFormErrors({});
    } catch (error) {
      logger.warn(
        "Ошибка создания упражнения",
        "ProfilePage",
        error instanceof Error ? error : new Error(String(error))
      );
      setMessage("Ошибка сети при создании");
    } finally {
      setCreatingNew(false);
    }
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
    } else if (!/^[a-zA-Zа-яА-Я0-9\s]+$/.test(editForm.type.trim())) {
      errors.type = "Название может содержать только буквы, цифры и пробелы";
    }

    if (editForm.type.trim() && editingExercise) {
      const currentType = editingExercise.type.toLowerCase();
      const updatedType = editForm.type.trim().toLowerCase();
      if (currentType !== updatedType && exercises.some((exercise) => exercise.type.toLowerCase() === updatedType)) {
        errors.type = "Упражнение с таким названием уже существует";
      }
    }

    const goalNum = parseInt(editForm.goal);
    if (!editForm.goal.trim()) {
      errors.goal = "Цель обязательна";
    } else if (isNaN(goalNum) || goalNum <= 0) {
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

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

      const res = await fetch(`/api/exercises/${editingExercise.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          type: editForm.type.trim(),
          goal: parseInt(editForm.goal),
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setMessage(`Ошибка обновления: ${j.error?.message ?? "Неизвестная ошибка"}`);
        return;
      }

      const updatedExercise = await res.json();
      setExercises((prev) => prev.map((item) => (item.id === editingExercise.id ? updatedExercise.data : item)));
      setMessage(`Упражнение "${editForm.type.trim()}" обновлено`);
      cancelEdit();
    } catch (error) {
      logger.warn(
        "Ошибка обновления упражнения",
        "ProfilePage",
        error instanceof Error ? error : new Error(String(error))
      );
      setMessage("Ошибка сети при обновлении");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <main className="app-screen">
        <p className="text-sm text-zinc-500">Загрузка...</p>
      </main>
    );
  }

  return (
    <>
      <Header title="Профиль" />
      <main className="app-screen">
        <div className="screen-stack">
          <Card>
            <CardHeader>
              <CardTitle>Профиль</CardTitle>
              <CardDescription>Настройки аккаунта и управление упражнениями в едином тёмном интерфейсе.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {email && (
                <div className="rounded-2xl border border-zinc-900 bg-black/70 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Email</div>
                  <div className="mt-2 text-sm text-zinc-200">{email}</div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300" htmlFor="profile-timezone">
                  Часовой пояс
                </label>
                <Select id="profile-timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button disabled={savingTz} className="rounded-2xl" onClick={onSaveTimezone}>
                  {savingTz ? "Сохранение..." : "Сохранить"}
                </Button>
                <Button variant="secondary" className="rounded-2xl" onClick={onSignOut}>
                  Выйти
                </Button>
              </div>

              {message && (
                <div className="rounded-2xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-sm text-zinc-400">
                  {message}
                </div>
              )}
            </CardContent>
          </Card>

          {editingExercise && (
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
                    onChange={(e) => setEditForm((prev) => ({ ...prev, type: e.target.value }))}
                    placeholder="Например: Бег, Плавание, Жим гантелей"
                  />
                  {editErrors.type && <p className="text-sm text-red-200">{editErrors.type}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300" htmlFor="edit-goal">
                    Цель
                  </label>
                  <Input
                    id="edit-goal"
                    type="number"
                    value={editForm.goal}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, goal: e.target.value }))}
                    placeholder="Например: 50"
                    min="1"
                    max="10000"
                  />
                  {editErrors.goal && <p className="text-sm text-red-200">{editErrors.goal}</p>}
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
          )}

          <Card>
            <CardHeader>
              <CardTitle>Управление упражнениями</CardTitle>
              <CardDescription>Создание, редактирование и удаление упражнений без смены контекста.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full rounded-2xl" onClick={openCreateForm}>
                Создать новое упражнение
              </Button>

              {showCreateForm && (
                <div className="space-y-4 rounded-2xl border border-zinc-900 bg-black/70 p-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300" htmlFor="new-type">
                      Название упражнения
                    </label>
                    <Input
                      id="new-type"
                      type="text"
                      value={newExercise.type}
                      onChange={(e) => setNewExercise((prev) => ({ ...prev, type: e.target.value }))}
                      placeholder="Например: Бег, Плавание, Жим гантелей"
                    />
                    {formErrors.type && <p className="text-sm text-red-200">{formErrors.type}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300" htmlFor="new-goal">
                      Цель
                    </label>
                    <Input
                      id="new-goal"
                      type="number"
                      value={newExercise.goal}
                      onChange={(e) => setNewExercise((prev) => ({ ...prev, goal: e.target.value }))}
                      placeholder="Например: 100"
                      min="1"
                      max="10000"
                    />
                    {formErrors.goal && <p className="text-sm text-red-200">{formErrors.goal}</p>}
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
              )}
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

          {deleteConfirm && (
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
                        deleteExercise(exercise.id, exercise.type);
                        setDeleteConfirm(null);
                      }
                    }}
                  >
                    Удалить
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
