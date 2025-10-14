"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function MiniChart({ exerciseId, limit = 20, refreshTrigger }: { exerciseId: string; limit?: number; refreshTrigger?: number }) {
  const [reps, setReps] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const { data, error: fetchError } = await supabase
          .from('sets')
          .select('reps')
          .eq('exercise_id', exerciseId)
          .order('created_at', { ascending: false })
          .limit(limit);
        
        if (fetchError) {
          throw new Error(fetchError.message);
        }
        
        const arr: number[] = (data || []).map(r => r.reps).reverse();
        console.log('MiniChart data:', arr);
        setReps(arr);
      } catch (e) {
        console.error('MiniChart error:', e);
        setError(e instanceof Error ? e.message : 'Unknown error');
        setReps([]);
      }
    })();
  }, [exerciseId, limit, refreshTrigger]);

  const w = 160, h = 48, pad = 4;
  if (reps === null) {
    return <div className="animate-pulse h-12 bg-gray-200 rounded" aria-label="Загрузка графика" />;
  }
  
  if (error) {
    return <div className="h-12 bg-red-50 border border-red-200 rounded flex items-center justify-center text-xs text-red-600" aria-label="Ошибка графика">Ошибка</div>;
  }

  if (reps.length === 0) {
    return <div className="h-12 bg-gray-50 border border-gray-200 rounded flex items-center justify-center text-xs text-gray-500" aria-label="Нет данных">Нет данных</div>;
  }

  const max = Math.max(1, ...reps);
  const step = reps.length > 1 ? (w - pad * 2) / (reps.length - 1) : 0;
  const points = reps.map((v, i) => {
    const x = pad + i * step;
    const y = h - pad - (v / max) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} role="img" aria-label="Мини‑график последних подходов">
      <rect x={0} y={0} width={w} height={h} fill="none" stroke="#e5e7eb" />
      <polyline points={points} fill="none" stroke="#111827" strokeWidth={2} />
    </svg>
  );
}
