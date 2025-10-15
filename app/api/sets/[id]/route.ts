import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

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

    // Проверяем, что запись принадлежит пользователю
    const { data: set, error: getError } = await supabase
      .from('sets')
      .select('id')
      .eq('id', params.id)
      .single();

    if (getError || !set) {
      return NextResponse.json(
        { data: null, error: { code: 'NOT_FOUND', message: 'Set not found' } },
        { status: 404 }
      );
    }

    // Удаляем запись
    const { error: deleteError } = await supabase
      .from('sets')
      .delete()
      .eq('id', params.id);

    if (deleteError) {
      return NextResponse.json(
        { data: null, error: { code: 'INTERNAL_ERROR', message: deleteError.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: null, error: null }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } },
      { status: 500 }
    );
  }
}
