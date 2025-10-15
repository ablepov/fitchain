import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const postSchema = z.object({
  exerciseId: z.string().uuid().optional(),
  exercise: z.enum(['pullups', 'pushups', 'squats']).optional(),
  reps: z.number().int().min(-1000).max(1000),
  note: z.string().max(500).optional(),
  source: z.enum(['manual', 'quickbutton']).default('quickbutton'),
});

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization') ?? req.headers.get('Authorization') ?? '';
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const url = new URL(req.url);
  const exerciseType = url.searchParams.get('exercise') as 'pullups' | 'pushups' | 'squats' | null;
  const exerciseId = url.searchParams.get('exerciseId');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10) || 50, 500);
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  try {
    // Определяем exercise_id, если задан тип
    let resolvedExerciseId = exerciseId ?? undefined;
    if (!resolvedExerciseId && exerciseType) {
      const { data: me } = await supabase.auth.getUser();
      const userId = me.user?.id;
      if (!userId) return NextResponse.json({ data: null, error: { code: 'UNAUTHORIZED', message: 'No session' } }, { status: 401 });
      const { data: ex, error: exErr } = await supabase
        .from('exercises')
        .select('id')
        .eq('type', exerciseType)
        .limit(1)
        .maybeSingle();
      if (exErr || !ex) return NextResponse.json({ data: null, error: { code: 'NOT_FOUND', message: 'Exercise not found' } }, { status: 404 });
      resolvedExerciseId = ex.id;
    }

    let query = supabase.from('sets').select('id,exercise_id,reps,created_at,note,source').order('created_at', { ascending: false }).limit(limit);

    if (resolvedExerciseId) query = query.eq('exercise_id', resolvedExerciseId);
    if (from) query = query.gte('created_at', from);
    if (to) query = query.lte('created_at', to);

    const { data, error } = await query;
    if (error) return NextResponse.json({ data: null, error: { code: 'INTERNAL_ERROR', message: error.message } }, { status: 500 });

    return NextResponse.json({ data, error: null }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ data: null, error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization') ?? req.headers.get('Authorization') ?? '';
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  try {
    const json = await req.json();
    const parsed = postSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: { code: 'VALIDATION_ERROR', message: 'Invalid body' } },
        { status: 400 }
      );
    }

    const { data: me } = await supabase.auth.getUser();
    const userId = me.user?.id;
    if (!userId) return NextResponse.json({ data: null, error: { code: 'UNAUTHORIZED', message: 'No session' } }, { status: 401 });

    // Разрешим указать либо exerciseId, либо exercise type
    let resolvedExerciseId = parsed.data.exerciseId;
    if (!resolvedExerciseId && parsed.data.exercise) {
      const { data: ex, error: exErr } = await supabase
        .from('exercises')
        .select('id')
        .eq('type', parsed.data.exercise)
        .limit(1)
        .maybeSingle();
      if (exErr || !ex) return NextResponse.json({ data: null, error: { code: 'NOT_FOUND', message: 'Exercise not found' } }, { status: 404 });
      resolvedExerciseId = ex.id;
    }
    if (!resolvedExerciseId) {
      return NextResponse.json({ data: null, error: { code: 'VALIDATION_ERROR', message: 'exerciseId or exercise is required' } }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('sets')
      .insert({
        exercise_id: resolvedExerciseId,
        reps: parsed.data.reps,
        note: parsed.data.note ?? null,
        source: parsed.data.source,
      })
      .select('id,exercise_id,reps,created_at,note,source')
      .single();

    if (error) {
      const status = error.code === '42501' ? 403 : 500;
      return NextResponse.json({ data: null, error: { code: 'INTERNAL_ERROR', message: error.message } }, { status });
    }

    return NextResponse.json({ data, error: null }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } },
      { status: 500 }
    );
  }
}
