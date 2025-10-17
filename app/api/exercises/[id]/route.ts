import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const putSchema = z.object({
  type: z.string().min(2).max(100).regex(/^[a-zA-Zа-яА-Я0-9\s]+$/, 'Название может содержать только буквы, цифры и пробелы'),
  goal: z.number().int().min(1).max(10000),
});

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  const authHeader = req.headers.get('authorization') ?? req.headers.get('Authorization') ?? '';
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  try {
    const { data: me } = await supabase.auth.getUser();
    const userId = me.user?.id;
    if (!userId) {
      return NextResponse.json(
        { data: null, error: { code: 'UNAUTHORIZED', message: 'No session' } },
        { status: 401 }
      );
    }

    // Get params id
    const params = 'then' in context.params ? await context.params : context.params;

    // Проверяем, что упражнение принадлежит пользователю
    const { data: exercise, error: getError } = await supabase
      .from('exercises')
      .select('id, type')
      .eq('id', params.id)
      .eq('user_id', userId)
      .single();

    if (getError || !exercise) {
      return NextResponse.json(
        { data: null, error: { code: 'NOT_FOUND', message: 'Exercise not found' } },
        { status: 404 }
      );
    }

    // Проверяем, есть ли подходы для этого упражнения
    const { data: sets, error: setsError } = await supabase
      .from('sets')
      .select('id')
      .eq('exercise_id', params.id)
      .limit(1);

    if (setsError) {
      return NextResponse.json(
        { data: null, error: { code: 'INTERNAL_ERROR', message: setsError.message } },
        { status: 500 }
      );
    }

    if (sets && sets.length > 0) {
      return NextResponse.json(
        { data: null, error: { code: 'CONFLICT', message: 'Cannot delete exercise with existing sets. Please delete all sets first.' } },
        { status: 409 }
      );
    }

    // Удаляем упражнение
    const { error: deleteError } = await supabase
      .from('exercises')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userId);

    if (deleteError) {
      return NextResponse.json(
        { data: null, error: { code: 'INTERNAL_ERROR', message: deleteError.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { id: params.id, type: exercise.type }, error: null }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  const authHeader = req.headers.get('authorization') ?? req.headers.get('Authorization') ?? '';
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  try {
    const json = await req.json();
    const parsed = putSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: { code: 'VALIDATION_ERROR', message: parsed.error.issues.map(i => i.message).join(', ') } },
        { status: 400 }
      );
    }

    const { data: me } = await supabase.auth.getUser();
    const userId = me.user?.id;
    if (!userId) {
      return NextResponse.json(
        { data: null, error: { code: 'UNAUTHORIZED', message: 'No session' } },
        { status: 401 }
      );
    }

    // Get params id
    const params = 'then' in context.params ? await context.params : context.params;

    // Проверяем, что упражнение принадлежит пользователю
    const { data: existingExercise, error: getError } = await supabase
      .from('exercises')
      .select('id, type, goal')
      .eq('id', params.id)
      .eq('user_id', userId)
      .single();

    if (getError || !existingExercise) {
      return NextResponse.json(
        { data: null, error: { code: 'NOT_FOUND', message: 'Exercise not found' } },
        { status: 404 }
      );
    }

    // Проверяем уникальность нового названия (если оно изменилось)
    if (existingExercise.type.toLowerCase() !== parsed.data.type.trim().toLowerCase()) {
      const { data: duplicateExercise, error: checkError } = await supabase
        .from('exercises')
        .select('id, type')
        .eq('user_id', userId)
        .ilike('type', parsed.data.type.trim())
        .neq('id', params.id)
        .maybeSingle();

      if (checkError) {
        return NextResponse.json(
          { data: null, error: { code: 'INTERNAL_ERROR', message: checkError.message } },
          { status: 500 }
        );
      }

      if (duplicateExercise) {
        return NextResponse.json(
          { data: null, error: { code: 'CONFLICT', message: 'Упражнение с таким названием уже существует' } },
          { status: 409 }
        );
      }
    }

    // Обновляем упражнение
    const { data, error } = await supabase
      .from('exercises')
      .update({
        type: parsed.data.type.trim(),
        goal: parsed.data.goal,
      })
      .eq('id', params.id)
      .eq('user_id', userId)
      .select('id, type, goal, created_at')
      .single();

    if (error) {
      return NextResponse.json(
        { data: null, error: { code: 'INTERNAL_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, error: null }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } },
      { status: 500 }
    );
  }
}