"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { logger } from "@/lib/logger";
import { Header } from "@/components/Header";

const timezones = [
  "Europe/Moscow",
  "UTC",
  "Europe/Berlin",
  "America/New_York",
  "Asia/Tokyo",
];

type Exercise = {
  id: string;
  type: 'pullups' | 'pushups' | 'squats';
  goal: number;
};

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string>("Europe/Moscow");
  const [savingTz, setSavingTz] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Состояние для упражнений
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Состояние для формы создания упражнения
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newExercise, setNewExercise] = useState({ type: '', goal: '' });
  const [formErrors, setFormErrors] = useState<{ type?: string; goal?: string }>({});
  const [creatingNew, setCreatingNew] = useState(false);

  // Состояние для формы редактирования упражнения
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [editForm, setEditForm] = useState({ type: '', goal: '' });
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

      // Загружаем профиль
      const { data: profile } = await supabase
        .from("profiles")
        .select("timezone")
        .eq("user_id", user.id)
        .maybeSingle();
      if (profile?.timezone) setTimezone(profile.timezone);

      // Загружаем упражнения для механизма создания базовых
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
    if (!userId) return;
    const { error } = await supabase
      .from("profiles")
      .upsert({ user_id: userId, timezone });
    setSavingTz(false);
    setMessage(error ? `Ошибка: ${error.message}` : "Таймзона сохранена");
  }

  async function createBaseExercises() {
    setCreating(true);
    setMessage(null);
    const base = [
      { type: 'pullups' as const, goal: 100 },
      { type: 'pushups' as const, goal: 100 },
      { type: 'squats' as const, goal: 100 },
    ];
    // Фильтруем те, которых ещё нет
    const existingTypes = new Set(exercises.map((e) => e.type));
    const toInsertBase = base.filter((b) => !existingTypes.has(b.type));
    if (toInsertBase.length === 0) {
      setMessage("Базовые упражнения уже созданы");
      setCreating(false);
      return;
    }
    const { data: me } = await supabase.auth.getUser();
    const userId = me.user?.id;
    if (!userId) {
      setMessage("Нет сессии пользователя");
      setCreating(false);
      return;
    }
    const toInsert = toInsertBase.map((b) => ({ ...b, user_id: userId }));
    const { error } = await supabase.from("exercises").insert(toInsert);
    if (error) {
      setMessage(`Ошибка: ${error.message}`);
    } else {
      // Перезагружаем список упражнений
      const { data: ex } = await supabase
        .from("exercises")
        .select("id,type,goal")
        .order("created_at", { ascending: true });
      setExercises(ex ?? []);
      setMessage("Созданы базовые упражнения");
    }
    setCreating(false);
  }

  async function deleteExercise(exerciseId: string, exerciseType: string) {
    setDeletingId(exerciseId);
    setMessage(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

      const res = await fetch(`/api/exercises/${exerciseId}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setMessage(`Ошибка удаления: ${j.error?.message ?? "Неизвестная ошибка"}`);
        return;
      }

      // Обновляем локальный список упражнений
      setExercises(prev => prev.filter(e => e.id !== exerciseId));
      setMessage(`Упражнение "${exerciseType}" удалено`);
    } catch (error) {
      logger.warn('Ошибка удаления упражнения', 'ProfilePage', error instanceof Error ? error : new Error(String(error)));
      setMessage('Ошибка сети при удалении');
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

    // Валидация названия
    if (!newExercise.type.trim()) {
      errors.type = 'Название обязательно';
    } else if (newExercise.type.trim().length < 2) {
      errors.type = 'Название должно содержать минимум 2 символа';
    } else if (newExercise.type.trim().length > 100) {
      errors.type = 'Название не должно превышать 100 символов';
    } else if (!/^[a-zA-Zа-яА-Я0-9\s]+$/.test(newExercise.type.trim())) {
      errors.type = 'Название может содержать только буквы, цифры и пробелы';
    }

    // Проверка уникальности названия
    if (newExercise.type.trim() && exercises.some(e => e.type.toLowerCase() === newExercise.type.trim().toLowerCase())) {
      errors.type = 'Упражнение с таким названием уже существует';
    }

    // Валидация цели
    const goalNum = parseInt(newExercise.goal);
    if (!newExercise.goal.trim()) {
      errors.goal = 'Цель обязательна';
    } else if (isNaN(goalNum) || goalNum <= 0) {
      errors.goal = 'Цель должна быть числом больше 0';
    } else if (goalNum > 10000) {
      errors.goal = 'Цель не должна превышать 10000';
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
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

      const res = await fetch(`/api/exercises`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          type: newExercise.type.trim(),
          goal: parseInt(newExercise.goal)
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setMessage(`Ошибка создания: ${j.error?.message ?? "Неизвестная ошибка"}`);
        return;
      }

      const createdExercise = await res.json();

      // Обновляем локальный список упражнений
      setExercises(prev => [...prev, createdExercise.data]);
      setMessage(`Упражнение "${newExercise.type.trim()}" создано`);
      setShowCreateForm(false);
      setNewExercise({ type: '', goal: '' });
      setFormErrors({});
    } catch (error) {
      logger.warn('Ошибка создания упражнения', 'ProfilePage', error instanceof Error ? error : new Error(String(error)));
      setMessage('Ошибка сети при создании');
    } finally {
      setCreatingNew(false);
    }
  }

  function openCreateForm() {
    setShowCreateForm(true);
    setNewExercise({ type: '', goal: '' });
    setFormErrors({});
  }

  function closeCreateForm() {
    setShowCreateForm(false);
    setNewExercise({ type: '', goal: '' });
    setFormErrors({});
  }

  function startEdit(exercise: Exercise) {
    setEditingExercise(exercise);
    setEditForm({ type: exercise.type, goal: exercise.goal.toString() });
    setEditErrors({});
  }

  function cancelEdit() {
    setEditingExercise(null);
    setEditForm({ type: '', goal: '' });
    setEditErrors({});
  }

  function validateEditForm(): boolean {
    const errors: { type?: string; goal?: string } = {};

    // Валидация названия
    if (!editForm.type.trim()) {
      errors.type = 'Название обязательно';
    } else if (editForm.type.trim().length < 2) {
      errors.type = 'Название должно содержать минимум 2 символа';
    } else if (editForm.type.trim().length > 100) {
      errors.type = 'Название не должно превышать 100 символов';
    } else if (!/^[a-zA-Zа-яА-Я0-9\s]+$/.test(editForm.type.trim())) {
      errors.type = 'Название может содержать только буквы, цифры и пробелы';
    }

    // Проверка уникальности названия (только если оно изменилось)
    if (editForm.type.trim() && editingExercise) {
      const currentType = editingExercise.type.toLowerCase();
      const newType = editForm.type.trim().toLowerCase();
      if (currentType !== newType && exercises.some(e => e.type.toLowerCase() === newType)) {
        errors.type = 'Упражнение с таким названием уже существует';
      }
    }

    // Валидация цели
    const goalNum = parseInt(editForm.goal);
    if (!editForm.goal.trim()) {
      errors.goal = 'Цель обязательна';
    } else if (isNaN(goalNum) || goalNum <= 0) {
      errors.goal = 'Цель должна быть числом больше 0';
    } else if (goalNum > 10000) {
      errors.goal = 'Цель не должна превышать 10000';
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
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

      const res = await fetch(`/api/exercises/${editingExercise.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          type: editForm.type.trim(),
          goal: parseInt(editForm.goal)
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setMessage(`Ошибка обновления: ${j.error?.message ?? "Неизвестная ошибка"}`);
        return;
      }

      const updatedExercise = await res.json();

      // Обновляем локальный список упражнений
      setExercises(prev => prev.map(e =>
        e.id === editingExercise.id ? updatedExercise.data : e
      ));
      setMessage(`Упражнение "${editForm.type.trim()}" обновлено`);
      cancelEdit();
    } catch (error) {
      logger.warn('Ошибка обновления упражнения', 'ProfilePage', error instanceof Error ? error : new Error(String(error)));
      setMessage('Ошибка сети при обновлении');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <main className="p-6">
        <p className="text-sm text-gray-500">Загрузка...</p>
      </main>
    );
  }

  return (
    <>
      <Header title="Профиль" />
      <main className="p-6 space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {email && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600" aria-label="Email пользователя">{email}</span>
              <button className="px-3 py-2 rounded border" onClick={onSignOut}>Выйти</button>
            </div>
          )}
        </div>

        <section>
          <h2 className="font-medium">Часовой пояс</h2>
          <div className="mt-2 flex gap-2 items-center">
            <select
              className="border rounded px-3 py-2"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
            <button
              disabled={savingTz}
              className="px-3 py-2 rounded bg-black text-white disabled:opacity-60"
              onClick={onSaveTimezone}
            >
              {savingTz ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
          {message && <p className="text-sm mt-2 text-gray-600">{message}</p>}
        </section>

        {/* Форма редактирования упражнения */}
        {editingExercise && (
          <section className="mt-6 p-4 border rounded-lg bg-blue-50">
            <h3 className="font-medium mb-3">Редактировать упражнение</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название упражнения
                </label>
                <input
                  type="text"
                  value={editForm.type}
                  onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md ${
                    editErrors.type ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Например: Бег, Плавание, Жим гантелей"
                />
                {editErrors.type && (
                  <p className="text-sm text-red-600 mt-1">{editErrors.type}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Цель (количество повторений)
                </label>
                <input
                  type="number"
                  value={editForm.goal}
                  onChange={(e) => setEditForm(prev => ({ ...prev, goal: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md ${
                    editErrors.goal ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Например: 50, 100, 200"
                  min="1"
                  max="10000"
                />
                {editErrors.goal && (
                  <p className="text-sm text-red-600 mt-1">{editErrors.goal}</p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={updateExercise}
                  disabled={updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {updating ? "Сохранение..." : "Сохранить изменения"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </section>
        )}

        <section>
          <h2 className="font-medium">Управление упражнениями</h2>
          <div className="mt-2 space-y-3">
            <div className="flex gap-2">
              <button
                disabled={creating}
                onClick={createBaseExercises}
                className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-60 hover:bg-blue-700 transition-colors"
              >
                {creating ? "Создание..." : "Создать базовые упражнения (3)"}
              </button>
              <button
                onClick={openCreateForm}
                className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                Создать новое упражнение
              </button>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Базовые упражнения:</strong> Создаст три упражнения: подтягивания, отжимания, приседания (по 100 повторений каждое).
              </p>
              <p>
                <strong>Новое упражнение:</strong> Создайте собственное упражнение с указанием названия и цели.
              </p>
            </div>
          </div>

          {/* Форма создания нового упражнения */}
          {showCreateForm && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-3">Создать новое упражнение</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название упражнения
                  </label>
                  <input
                    type="text"
                    value={newExercise.type}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, type: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md ${
                      formErrors.type ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Например: Бег, Плавание, Жим гантелей"
                  />
                  {formErrors.type && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.type}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Цель (количество повторений)
                  </label>
                  <input
                    type="number"
                    value={newExercise.goal}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, goal: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md ${
                      formErrors.goal ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Например: 50, 100, 200"
                    min="1"
                    max="10000"
                  />
                  {formErrors.goal && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.goal}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={createNewExercise}
                    disabled={creatingNew}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {creatingNew ? "Создание..." : "Создать упражнение"}
                  </button>
                  <button
                    onClick={closeCreateForm}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <section>
          <h2 className="font-medium">Текущие упражнения</h2>
          {exercises.length === 0 ? (
            <p className="text-sm text-gray-500 mt-2">Пока нет упражнений</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {exercises.map((exercise) => (
                <li key={exercise.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <span className="font-medium capitalize">{exercise.type}</span>
                    <span className="text-sm text-gray-600 ml-2">Цель: {exercise.goal}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(exercise)}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      title="Редактировать упражнение"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => confirmDelete(exercise)}
                      disabled={deletingId === exercise.id}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                      title="Удалить упражнение"
                    >
                      {deletingId === exercise.id ? "Удаление..." : "Удалить"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Модальное окно подтверждения удаления */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-sm mx-4">
                <h3 className="text-lg font-semibold mb-4">Подтвердите удаление</h3>
                <p className="text-gray-600 mb-6">
                  Вы действительно хотите удалить упражнение "{exercises.find(e => e.id === deleteConfirm)?.type}"?
                  Это действие нельзя отменить.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={() => {
                      const exercise = exercises.find(e => e.id === deleteConfirm);
                      if (exercise) {
                        deleteExercise(exercise.id, exercise.type);
                        setDeleteConfirm(null);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}