"use client";

import { useEffect, useMemo, useState, useReducer, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { logger } from "@/lib/logger";

// Буферная логика для первой итерации
interface BufferState {
  value: number;
  isActive: boolean;
  timeLeft: number;
  timerId: NodeJS.Timeout | null;
}

type BufferAction =
  | { type: 'START'; payload: number }
  | { type: 'ADD'; payload: number }
  | { type: 'COMMIT' }
  | { type: 'CANCEL' };

const initialBufferState: BufferState = {
  value: 0,
  isActive: false,
  timeLeft: 0,
  timerId: null
};

function bufferReducer(state: BufferState, action: BufferAction): BufferState {
  switch (action.type) {
    case 'START':
      if (state.timerId) clearTimeout(state.timerId);
      return {
        value: action.payload,
        isActive: true,
        timeLeft: 5,
        timerId: null // Таймер будет установлен снаружи через useEffect
      };

    case 'ADD':
      if (state.timerId) clearTimeout(state.timerId);
      return {
        ...state,
        value: state.value + action.payload,
        timeLeft: 5,
        timerId: null // Таймер будет установлен снаружи через useEffect
      };

    case 'COMMIT':
      if (state.timerId) clearTimeout(state.timerId);
      return {
        value: 0,
        isActive: false,
        timeLeft: 0,
        timerId: null
      };

    case 'CANCEL':
      if (state.timerId) clearTimeout(state.timerId);
      return {
        value: 0,
        isActive: false,
        timeLeft: 0,
        timerId: null
      };

    default:
      return state;
  }
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return sorted[mid];
}

export function QuickButtons({ exerciseId, onAdded, todayTotal = 0 }: { exerciseId: string; onAdded?: () => void; todayTotal?: number }) {
  const [lastReps, setLastReps] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // Буферное состояние для первой итерации
  const [bufferState, dispatch] = useReducer(bufferReducer, initialBufferState);

  // Состояние для реального времени таймера
  const [currentTimeLeft, setCurrentTimeLeft] = useState(0);

  // Используем useRef для хранения таймера (альтернатива прямой мутации состояния)
  const bufferTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setMsg(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 секунд таймаут

        const params = new URLSearchParams({ exerciseId, limit: "20" });
        const res = await fetch(`/api/sets?${params.toString()}`, {
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          if (!isCancelled) {
            setMsg(`Ошибка загрузки данных`);
            setLoading(false);
          }
          return;
        }

        const j = await res.json();
        const reps: number[] = (j.data as any[]).map((r) => r.reps);

        if (!isCancelled) {
          setLastReps(reps);
          setLoading(false);
        }
      } catch (error) {
        if (!isCancelled) {
          logger.warn('Ошибка загрузки истории подходов', 'QuickButtons', error instanceof Error ? error : new Error(String(error)));
          setMsg(`Ошибка загрузки данных`);
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [exerciseId]);

  // Очистка буферного таймера при размонтировании
  useEffect(() => {
    return () => {
      if (bufferTimerRef.current) {
        clearTimeout(bufferTimerRef.current);
      }
    };
  }, []);

  // Очистка интервала при размонтировании компонента
  useEffect(() => {
    return () => {
      setCurrentTimeLeft(0);
    };
  }, []);

  const buttons = useMemo(() => {
    const m = median(lastReps);
    if (!m) return [3, 5, 8];
    return [m - 2, m, m + 2].map((v) => Math.max(1, v));
  }, [lastReps]);

  // Функция фиксации буфера в API (первая итерация)
  const commitBuffer = useCallback(async () => {
    if (bufferState.value === 0) {
      // Очищаем таймер перед отменой
      if (bufferTimerRef.current) {
        clearTimeout(bufferTimerRef.current);
        bufferTimerRef.current = null;
      }
      dispatch({ type: 'CANCEL' });
      return; // Не отправляем пустые подходы
    }

    setSending(true);
    setMsg(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

      const res = await fetch(`/api/sets`, {
        method: "POST",
        headers,
        body: JSON.stringify({ exerciseId, reps: bufferState.value, source: "quickbutton" }),
      });

      // Телеметрия (best-effort)
      fetch('/api/telemetry', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          event: 'buffer_commit',
          exerciseId,
          reps: bufferState.value
        })
      }).catch(() => {});

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setMsg(`Ошибка: ${res.status} ${j.error?.message ?? ""}`);
        return;
      }

      // Обновляем локальную историю
      setLastReps(prev => [bufferState.value, ...prev].slice(0, 20));

      // Уведомляем родителя
      if (onAdded) onAdded();

      // Показываем подтверждение
      setMsg(`Подход +${bufferState.value} зафиксирован!`);

    } catch (error) {
      logger.warn('Ошибка фиксации буфера', 'QuickButtons', error instanceof Error ? error : new Error(String(error)));
      setMsg('Ошибка сети');
    } finally {
      setSending(false);
      dispatch({ type: 'COMMIT' });
    }
  }, [bufferState.value, exerciseId, onAdded]);

  // Управление таймерами буфера (фиксации и визуального отсчета)
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (bufferState.isActive && bufferState.value > 0) {
      // Очищаем старый таймер фиксации
      if (bufferTimerRef.current) clearTimeout(bufferTimerRef.current);

      // Устанавливаем таймер фиксации
      const timerId = setTimeout(() => {
        // Используем актуальную версию commitBuffer без зависимости
        if (bufferState.value > 0) {
          commitBuffer();
        }
      }, 5000);

      // Обновляем timerId в ref (правильный способ без мутации)
      bufferTimerRef.current = timerId;

      // Сбрасываем визуальный таймер к 5 секундам
      setCurrentTimeLeft(5);

      // Запускаем интервал обновления визуального таймера
      intervalId = setInterval(() => {
        setCurrentTimeLeft(prev => {
          if (prev <= 1) {
            if (intervalId) clearInterval(intervalId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCurrentTimeLeft(0);
      // Очищаем таймер если буфер не активен
      if (bufferTimerRef.current) {
        clearTimeout(bufferTimerRef.current);
        bufferTimerRef.current = null;
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (bufferTimerRef.current) clearTimeout(bufferTimerRef.current);
    };
  }, [bufferState.value, bufferState.isActive]);

  // Новая функция обработки кликов кнопок (буферная логика)
  const handleButtonClick = useCallback((amount: number) => {
    setMsg(null);

    // Специальная логика для кнопки -1
    if (amount === -1) {
      if (todayTotal <= 0) return; // Нельзя уменьшить, если за день 0
      if (bufferState.isActive && bufferState.value <= 0) return; // Нельзя уйти в минус в буфере
    }

    // Валидация граничных значений буфера
    const newValue = bufferState.isActive
      ? bufferState.value + amount
      : amount;

    if (newValue < 0 || newValue > 100) {
      setMsg(`Значение должно быть от 0 до 100`);
      return;
    }

    // Обрабатываем буферную логику
    if (bufferState.isActive) {
      // Добавляем к существующему буферу
      const newValue = bufferState.value + amount;
      if (newValue >= 0 && newValue <= 100) {
        dispatch({ type: 'ADD', payload: amount });
      } else {
        setMsg(`Значение должно быть от 0 до 100`);
      }
    } else {
      // Начинаем новый буфер
      if (amount >= 0 && amount <= 100) {
        dispatch({ type: 'START', payload: amount });
      } else {
        setMsg(`Значение должно быть от 0 до 100`);
      }
    }
  }, [bufferState.isActive, bufferState.value, todayTotal]);

  // Старая функция для обратной совместимости (если нужно)
  async function addReps(amount: number) {
    // Делегируем новой буферной логике
    handleButtonClick(amount);
  }

  return (
    <div className="flex flex-col gap-3 w-full" role="group" aria-label="Быстрые кнопки">
      <div className="grid grid-cols-5 gap-2 w-full">
        <button
          className={`px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 col-span-1 ${
            bufferState.isActive
              ? bufferState.value <= 0
                ? 'border-red-200 bg-red-50 text-red-700 opacity-50 cursor-not-allowed'
                : 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100'
              : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-300'
          }`}
          onClick={() => handleButtonClick(-1)}
          disabled={sending || (!bufferState.isActive && todayTotal <= 0) || (bufferState.isActive && bufferState.value <= 0)}
          aria-label="Убавить 1"
          title={(!bufferState.isActive && todayTotal <= 0) ? "Нечего убавлять" : (bufferState.isActive && bufferState.value <= 0) ? "Минимальное значение" : undefined}
        >
          -1
        </button>

        {buttons.map((v, index) => (
          <button
            key={`${v}-${index}`}
            className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 col-span-1 ${
              bufferState.isActive
                ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
            }`}
            onClick={() => handleButtonClick(v)}
            aria-label={`Добавить ${v}`}
            disabled={sending}
          >
            +{v}
          </button>
        ))}

        <button
          className={`px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 col-span-1 ${
            bufferState.isActive
              ? 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100'
              : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-300'
          }`}
          onClick={() => handleButtonClick(1)}
          disabled={sending}
          aria-label="Добавить 1"
        >
          +1
        </button>
      </div>

      {/* Буферный режим - первая итерация (простой индикатор) */}
      {bufferState.isActive && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-orange-600">
                Буфер: +{bufferState.value}
              </span>
              <button
                onClick={() => dispatch({ type: 'CANCEL' })}
                className="w-6 h-6 rounded-full bg-orange-200 text-orange-700 hover:bg-orange-300 flex items-center justify-center text-sm font-bold transition-colors"
                aria-label="Отменить буфер"
                title="Отменить добавление подхода"
              >
                ×
              </button>
            </div>
            <div className="text-sm text-orange-600">
              Фиксация через {currentTimeLeft}с
            </div>
          </div>
        </div>
      )}

      {/* Индикатор загрузки и сообщения */}
      <div className="flex flex-col gap-1 w-full">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Загрузка истории...
          </div>
        )}
        {msg && (
          <div className={`text-sm p-2 rounded-md w-full ${
            msg.includes('Ошибка')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {msg}
          </div>
        )}
        {bufferState.isActive && !msg && (
          <div className="text-sm text-orange-700 bg-orange-50 p-2 rounded border border-orange-200">
            Нажмите кнопки для корректировки значения. Подход зафиксируется через {currentTimeLeft}с
          </div>
        )}
      </div>
    </div>
  );
}
