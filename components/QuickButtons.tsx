"use client";

import { startTransition, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/logger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface BufferState {
  value: number;
  isActive: boolean;
}

type BufferAction =
  | { type: "START"; payload: number }
  | { type: "ADD"; payload: number }
  | { type: "COMMIT" }
  | { type: "CANCEL" };

const BUFFER_SECONDS = 5;
const BUFFER_DURATION_MS = BUFFER_SECONDS * 1000;
const BUFFER_PAUSE_MS = 1000;
const TIMER_TICK_MS = 100;

const initialBufferState: BufferState = {
  value: 0,
  isActive: false,
};

function bufferReducer(state: BufferState, action: BufferAction): BufferState {
  switch (action.type) {
    case "START":
      return {
        value: action.payload,
        isActive: true,
      };
    case "ADD":
      return {
        ...state,
        value: state.value + action.payload,
      };
    case "COMMIT":
    case "CANCEL":
      return initialBufferState;
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
  initialLastReps = [],
  onAdded,
  todayTotal = 0,
}: {
  exerciseId: string;
  initialLastReps?: number[];
  onAdded?: () => void;
  todayTotal?: number;
}) {
  const router = useRouter();
  const [lastReps, setLastReps] = useState<number[]>(initialLastReps);
  const [msg, setMsg] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [bufferState, dispatch] = useReducer(bufferReducer, initialBufferState);
  const [currentTimeLeft, setCurrentTimeLeft] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const latestBufferValueRef = useRef(0);
  const remainingMsRef = useRef(BUFFER_DURATION_MS);
  const pauseUntilRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const commitInFlightRef = useRef(false);

  useEffect(() => {
    latestBufferValueRef.current = bufferState.value;
  }, [bufferState.value]);

  const stopCountdown = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    pauseUntilRef.current = null;
    lastTickRef.current = null;
    remainingMsRef.current = BUFFER_DURATION_MS;
    setCurrentTimeLeft(0);
  }, []);

  useEffect(() => {
    return () => {
      stopCountdown();
    };
  }, [stopCountdown]);

  const buttons = useMemo(() => {
    const middle = median(lastReps);

    if (!middle) {
      return [3, 5, 8];
    }

    return [middle - 2, middle, middle + 2].map((value) => Math.max(1, value));
  }, [lastReps]);

  const countdownProgress = useMemo(() => {
    if (!bufferState.isActive || bufferState.value <= 0) return 0;
    return Math.max(0, Math.min(100, (remainingMsRef.current / BUFFER_DURATION_MS) * 100));
  }, [bufferState.isActive, bufferState.value, currentTimeLeft]);

  const commitBuffer = useCallback(async () => {
    if (commitInFlightRef.current) return;

    const value = latestBufferValueRef.current;

    if (value === 0) {
      stopCountdown();
      dispatch({ type: "CANCEL" });
      return;
    }

    commitInFlightRef.current = true;
    setSending(true);
    setMsg(null);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };

      const res = await fetch("/api/sets", {
        method: "POST",
        headers,
        body: JSON.stringify({ exerciseId, reps: value, source: "quickbutton" }),
      });

      fetch("/api/telemetry", {
        method: "POST",
        headers,
        body: JSON.stringify({
          event: "buffer_commit",
          exerciseId,
          reps: value,
        }),
      }).catch(() => {});

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setMsg(`Ошибка: ${res.status} ${json.error?.message ?? ""}`);
        return;
      }

      setLastReps((prev) => [value, ...prev].slice(0, 20));
      onAdded?.();
      startTransition(() => {
        router.refresh();
      });
      setMsg(`Подход +${value} зафиксирован`);
    } catch (error) {
      logger.warn(
        "Ошибка фиксации буфера",
        "QuickButtons",
        error instanceof Error ? error : new Error(String(error))
      );
      setMsg("Ошибка сети");
    } finally {
      commitInFlightRef.current = false;
      setSending(false);
      stopCountdown();
      dispatch({ type: "COMMIT" });
    }
  }, [exerciseId, onAdded, router, stopCountdown]);

  const timedBufferActive = bufferState.isActive && bufferState.value > 0;

  useEffect(() => {
    if (!timedBufferActive) {
      stopCountdown();
      return;
    }

    remainingMsRef.current = BUFFER_DURATION_MS;
    pauseUntilRef.current = null;
    lastTickRef.current = Date.now();
    setCurrentTimeLeft(BUFFER_SECONDS);

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const pauseUntil = pauseUntilRef.current ?? 0;

      if (pauseUntil > now) {
        lastTickRef.current = now;
        return;
      }

      const lastTick = lastTickRef.current ?? now;
      const elapsed = now - lastTick;

      lastTickRef.current = now;
      remainingMsRef.current = Math.max(0, remainingMsRef.current - elapsed);

      setCurrentTimeLeft(Math.ceil(remainingMsRef.current / 1000));

      if (remainingMsRef.current <= 0) {
        void commitBuffer();
      }
    }, TIMER_TICK_MS);

    return () => {
      stopCountdown();
    };
  }, [timedBufferActive, commitBuffer, stopCountdown]);

  const pauseCountdown = useCallback(() => {
    if (!timedBufferActive) return;

    const now = Date.now();
    pauseUntilRef.current = now + BUFFER_PAUSE_MS;
    lastTickRef.current = now;
  }, [timedBufferActive]);

  const handleButtonClick = useCallback(
    (amount: number) => {
      setMsg(null);

      if (amount === -1) {
        if (!bufferState.isActive && todayTotal <= 0) return;
        if (bufferState.isActive && bufferState.value <= 0) return;
      }

      const nextValue = bufferState.isActive ? bufferState.value + amount : amount;

      if (nextValue < 0 || nextValue > 100) {
        setMsg("Значение должно быть от 0 до 100");
        return;
      }

      if (bufferState.isActive) {
        dispatch({ type: "ADD", payload: amount });
        pauseCountdown();
        return;
      }

      dispatch({ type: "START", payload: amount });
    },
    [bufferState.isActive, bufferState.value, pauseCountdown, todayTotal]
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
          data-testid="quick-button-minus-one"
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
            data-testid={`quick-button-plus-${value}`}
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
          data-testid="quick-button-plus-one"
          disabled={sending}
          aria-label="Добавить 1"
        >
          +1
        </Button>
      </div>

      {bufferState.isActive && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3" data-testid="quick-buffer-panel">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2" data-testid="quick-buffer-timer">
                <Badge className="border-zinc-700 bg-zinc-100 text-black">Буфер</Badge>
                <span className="text-base font-semibold text-zinc-50" data-testid="quick-buffer-value">
                  +{bufferState.value}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full border border-zinc-800"
                onClick={() => dispatch({ type: "CANCEL" })}
                data-testid="quick-buffer-cancel"
                aria-label="Отменить буфер"
                title="Отменить добавление подхода"
              >
                x
              </Button>
            </div>
            {timedBufferActive && (
              <div className="flex items-center gap-3" data-testid="quick-buffer-countdown">
                <Progress
                  value={countdownProgress}
                  className="h-2.5 flex-1 bg-zinc-900"
                  indicatorClassName="bg-zinc-100"
                  data-testid="quick-buffer-progress"
                />
                <span
                  className="min-w-8 text-right text-xs font-medium tabular-nums text-zinc-400"
                  data-testid="quick-buffer-seconds"
                >
                  {currentTimeLeft}с
                </span>
                <span className="sr-only">Автофиксация через {currentTimeLeft} секунд</span>
              </div>
            )}
          </div>
        </div>
      )}

      {msg ? (
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
      ) : null}
    </div>
  );
}
