import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const level = url.searchParams.get('level') as any;
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);

    const logs = logger.getLogs(level, limit);

    return NextResponse.json({
      data: logs,
      error: null
    }, { status: 200 });
  } catch (e) {
    return NextResponse.json({
      data: null,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get logs' }
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    logger.clearLogs();

    return NextResponse.json({
      data: { success: true },
      error: null
    }, { status: 200 });
  } catch (e) {
    return NextResponse.json({
      data: null,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to clear logs' }
    }, { status: 500 });
  }
}