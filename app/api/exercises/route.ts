import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const postSchema = z.object({
  type: z.string().min(2).max(100).regex(/^[a-zA-Zа-яА-Я0-9\s]+$/, 'Название может содержать только буквы, цифры и пробелы'),
  goal: z.number().int().min(1).max(10000),
});

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

    // Проверяем уникальность названия упражнения для пользователя
    const { data: existingExercise, error: checkError } = await supabase
      .from('exercises')
      .select('id, type')
      .eq('user_id', userId)
      .ilike('type', parsed.data.type.trim())
      .maybeSingle();

    if (checkError) {
      return NextResponse.json(
        { data: null, error: { code: 'INTERNAL_ERROR', message: checkError.message } },
        { status: 500 }
      );
    }

    if (existingExercise) {
      return NextResponse.json(
        { data: null, error: { code: 'CONFLICT', message: 'Упражнение с таким названием уже существует' } },
        { status: 409 }
      );
    }

    // Создаем новое упражнение
    const { data, error } = await supabase
      .from('exercises')
      .insert({
        user_id: userId,
        type: parsed.data.type.trim(),
        goal: parsed.data.goal,
      })
      .select('id, type, goal, created_at')
      .single();

    if (error) {
      return NextResponse.json(
        { data: null, error: { code: 'INTERNAL_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, error: null }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } },
      { status: 500 }
    );
  }
}