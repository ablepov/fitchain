"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BufferState {
  value: number;
  isActive: boolean;
  timeLeft: number;
  timerId: NodeJS.Timeout | null;
}

type BufferAction =
  | { type: "START"; payload: number }
  | { type: "ADD"; payload: number }
  | { type: "COMMIT" }
  | { type: "CANCEL" };

const initialBufferState: BufferState = {
  value: 0,
  isActive: false,
  timeLeft: 0,
  timerId: null,
};

function bufferReducer(state: BufferState, action: BufferAction): BufferState {
  switch (action.type) {
    case "START":
      if (state.timerId) clearTimeout(state.timerId);
      return {
        value: action.payload,
        isActive: true,
        timeLeft: 5,
        timerId: null,
      };

    case "ADD":
      if (state.timerId) clearTimeout(state.timerId);
      return {
        ...state,
        value: state.value + action.payload,
        timeLeft: 5,
        timerId: null,
      };

    case "COMMIT":
    case "CANCEL":
      if (state.timerId) clearTimeout(state.timerId);
      return {
        value: 0,
        isActive: false,
        timeLeft: 0,
        timerId: null,
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

export function QuickButtons({
  exerciseId,
  onAdded,
  todayTotal = 0,
}: {
  exerciseId: string;
  onAdded?: () => void;
  todayTotal?: number;
}) {
  const [lastReps, setLastReps] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [bufferState, dispatch] = useReducer(bufferReducer, initialBufferState);
  const [currentTimeLeft, setCurrentTimeLeft] = useState(0);
  const bufferTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setMsg(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const params = new URLSearchParams({ exerciseId, limit: "20" });
        const res = await fetch(`/api/sets?${params.toString()}`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          if (!isCancelled) {
            setMsg("Ошибка загрузки данных");
            setLoading(false);
          }
          return;
        }

        const json = await res.json();
        const reps: number[] = (json.data as Array<{ reps: number }>).map((record) => record.reps);

        if (!isCancelled) {
          setLastReps(reps);
          setLoading(false);
        }
      } catch (error) {
        if (!isCancelled) {
          logger.warn(
            "Ошибка загрузки истории подходов",
            "QuickButtons",
            error instanceof Error ? error : new Error(String(error))
          );
          setMsg("Ошибка загрузки данных");
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [exerciseId]);

  useEffect(() => {
    return () => {
      if (bufferTimerRef.current) clearTimeout(bufferTimerRef.current);
    };
  }, []);

  const buttons = useMemo(() => {
    const middle = median(lastReps);
    if (!middle) return [3, 5, 8];
    return [middle - 2, middle, middle + 2].map((value) => Math.max(1, value));
  }, [lastReps]);

  const commitBuffer = useCallback(async () => {
    if (bufferState.value === 0) {
      if (bufferTimerRef.current) {
        clearTimeout(bufferTimerRef.current);
        bufferTimerRef.current = null;
      }
      dispatch({ type: "CANCEL" });
      return;
    }

    setSending(true);
    setMsg(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

      const res = await fetch("/api/sets", {
        method: "POST",
        headers,
        body: JSON.stringify({ exerciseId, reps: bufferState.value, source: "quickbutton" }),
      });

      fetch("/api/telemetry", {
        method: "POST",
        headers,
        body: JSON.stringify({
          event: "buffer_commit",
          exerciseId,
          reps: bufferState.value,
        }),
      }).catch(() => {});

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setMsg(`Ошибка: ${res.status} ${json.error?.message ?? ""}`);
        return;
      }

      setLastReps((prev) => [bufferState.value, ...prev].slice(0, 20));
      onAdded?.();
      setMsg(`Подход +${bufferState.value} зафиксирован`);
    } catch (error) {
      logger.warn(
        "Ошибка фиксации буфера",
        "QuickButtons",
        error instanceof Error ? error : new Error(String(error))
      );
      setMsg("Ошибка сети");
    } finally {
      setSending(false);
      dispatch({ type: "COMMIT" });
    }
  }, [bufferState.value, exerciseId, onAdded]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (bufferState.isActive && bufferState.value > 0) {
      if (bufferTimerRef.current) clearTimeout(bufferTimerRef.current);

      const timerId = setTimeout(() => {
        if (bufferState.value > 0) commitBuffer();
      }, 5000);

      bufferTimerRef.current = timerId;
      setCurrentTimeLeft(5);

      intervalId = setInterval(() => {
        setCurrentTimeLeft((prev) => {
          if (prev <= 1) {
            if (intervalId) clearInterval(intervalId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCurrentTimeLeft(0);
      if (bufferTimerRef.current) {
        clearTimeout(bufferTimerRef.current);
        bufferTimerRef.current = null;
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (bufferTimerRef.current) clearTimeout(bufferTimerRef.current);
    };
  }, [bufferState.value, bufferState.isActive, commitBuffer]);

  const handleButtonClick = useCallback(
    (amount: number) => {
      setMsg(null);

      if (amount === -1) {
        if (todayTotal <= 0) return;
        if (bufferState.isActive && bufferState.value <= 0) return;
      }

      const nextValue = bufferState.isActive ? bufferState.value + amount : amount;

      if (nextValue < 0 || nextValue > 100) {
        setMsg("Значение должно быть от 0 до 100");
        return;
      }

      if (bufferState.isActive) {
        dispatch({ type: "ADD", payload: amount });
        return;
      }

      dispatch({ type: "START", payload: amount });
    },
    [bufferState.isActive, bufferState.value, todayTotal]
  );

  return (
    <div className="flex w-full flex-col gap-3" role="group" aria-label="Быстрые кнопки">
      <div className="grid grid-cols-5 gap-2">
        <Button
          variant="outline"
          className={cn(
            "h-12 rounded-2xl px-0 text-sm",
            bufferState.isActive
              ? "border-zinc-700 bg-zinc-900 text-zinc-300"
              : "border-zinc-900 bg-zinc-950 text-zinc-400"
          )}
          onClick={() => handleButtonClick(-1)}
          disabled={
            sending ||
            (!bufferState.isActive && todayTotal <= 0) ||
            (bufferState.isActive && bufferState.value <= 0)
          }
          aria-label="Убавить 1"
          title={
            !bufferState.isActive && todayTotal <= 0
              ? "Нечего убавлять"
              : bufferState.isActive && bufferState.value <= 0
                ? "Минимальное значение"
                : undefined
          }
        >
          -1
        </Button>

        {buttons.map((value, index) => (
          <Button
            key={`${value}-${index}`}
            className={cn(
              "h-12 rounded-2xl px-0 text-sm font-semibold",
              bufferState.isActive
                ? "border-zinc-700 bg-zinc-100 text-black hover:bg-zinc-200"
                : "border-zinc-800 bg-black text-zinc-50 hover:bg-zinc-900"
            )}
            onClick={() => handleButtonClick(value)}
            aria-label={`Добавить ${value}`}
            disabled={sending}
          >
            +{value}
          </Button>
        ))}

        <Button
          variant="secondary"
          className="h-12 rounded-2xl px-0 text-sm"
          onClick={() => handleButtonClick(1)}
          disabled={sending}
          aria-label="Добавить 1"
        >
          +1
        </Button>
      </div>

      {bufferState.isActive && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge className="border-zinc-700 bg-zinc-100 text-black">Буфер</Badge>
              <span className="text-base font-semibold text-zinc-50">+{bufferState.value}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Фиксация через {currentTimeLeft}с</span>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full border border-zinc-800"
                onClick={() => dispatch({ type: "CANCEL" })}
                aria-label="Отменить буфер"
                title="Отменить добавление подхода"
              >
                ×
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {loading && (
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-sm text-zinc-500">
            Загрузка истории...
          </div>
        )}

        {msg && (
          <div
            className={cn(
              "rounded-2xl border px-3 py-2 text-sm",
              msg.includes("Ошибка")
                ? "border-red-950/80 bg-zinc-950 text-red-200"
                : "border-zinc-800 bg-zinc-950 text-zinc-300"
            )}
          >
            {msg}
          </div>
        )}

        {bufferState.isActive && !msg && (
          <div className="rounded-2xl border border-zinc-900 bg-black/70 px-3 py-2 text-sm text-zinc-500">
            Можно скорректировать значение до автосохранения через {currentTimeLeft}с
          </div>
        )}
      </div>
    </div>
  );
}
