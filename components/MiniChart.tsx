"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { logger } from "@/lib/logger";

interface SetData {
  reps: number;
  created_at: string;
}

export function MiniChart({
  exerciseId,
  limit = 20,
  refreshTrigger,
  onLastSetTime
}: {
  exerciseId: string;
  limit?: number;
  refreshTrigger?: number;
  onLastSetTime?: (time: string | null) => void;
}) {
  const [reps, setReps] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastSetTime, setLastSetTime] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setError(null);
        const { data, error: fetchError } = await supabase
          .from('sets')
          .select('reps, created_at')
          .eq('exercise_id', exerciseId)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        if (!isMounted) return;

        const setData: SetData[] = data || [];
        const arr: number[] = setData.map(r => r.reps).reverse();

        // Получаем время последнего подхода
        const lastSet = setData[0];
        const lastTime = lastSet ? lastSet.created_at : null;

        setReps(arr);
        setLastSetTime(lastTime);
        if (onLastSetTime) {
          onLastSetTime(lastTime);
        }
      } catch (e) {
        if (!isMounted) return;
        logger.error('Ошибка загрузки данных графика', 'MiniChart', e instanceof Error ? e : new Error(String(e)));
        setError('Не удалось загрузить данные графика');
        setReps([]);
        setLastSetTime(null);
        if (onLastSetTime) {
          onLastSetTime(null);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [exerciseId, limit, refreshTrigger, onLastSetTime]);

  // Адаптивная высота графика
  const h = 64, pad = 8;

  if (reps === null) {
    return <div className="animate-pulse h-16 bg-gray-100 rounded-lg w-full" aria-label="Загрузка графика" />;
  }

  if (error) {
    return (
      <div className="h-16 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center w-full">
        <span className="text-sm text-red-600">Ошибка загрузки</span>
      </div>
    );
  }

  if (reps.length === 0) {
    return (
      <div className="h-16 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center w-full">
        <span className="text-sm text-gray-500">Нет данных для графика</span>
      </div>
    );
  }

  // Подготавливаем данные для графика
  const max = Math.max(1, ...reps);
  const chartWidth = 100;
  const chartHeight = h - pad * 2;

  // Создаем точки для простой и понятной визуализации
  const points = reps.map((value, index) => {
    const x = pad + (index * (chartWidth - pad * 2)) / Math.max(1, reps.length - 1);
    const y = pad + chartHeight - (value / max) * chartHeight;
    return { x, y, value };
  });

  // Создаем path для линии графика
  const pathData = points.map((point, index) =>
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div className="w-full h-16 bg-gray-50 rounded-lg border border-gray-200 p-2">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${chartWidth} ${h}`}
        role="img"
        aria-label="График последних подходов"
        className="overflow-visible"
      >
        {/* Градиент для заливки под линией */}
        <defs>
          <linearGradient id={`areaGradient-${exerciseId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        {/* Заливка области под графиком */}
        <polygon
          points={`${pad},${pad + chartHeight} ${points.map(p => `${p.x},${p.y}`).join(' ')} ${points[points.length - 1]?.x || chartWidth - pad},${pad + chartHeight}`}
          fill={`url(#areaGradient-${exerciseId})`}
        />

        {/* Основная линия графика */}
        <path
          d={pathData}
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Точки данных */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={index === points.length - 1 ? "2" : "1.5"}
            fill="#2563eb"
            className={index === points.length - 1 ? "animate-pulse" : ""}
          />
        ))}

        {/* Простая горизонтальная линия сетки */}
        <line
          x1={pad}
          y1={pad + chartHeight / 2}
          x2={chartWidth - pad}
          y2={pad + chartHeight / 2}
          stroke="#e5e7eb"
          strokeWidth="0.5"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
