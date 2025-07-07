import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createTableRecord, LARK_BASE_CONFIG } from '@/lib/lark';
import { ApiResponse } from '@/types';

async function createWishHandler(req: NextRequest) {
  try {
    const user = (req as any).user;
    const wishData = await req.json();

    if (!wishData.targetDate || !wishData.wishStartTime || !wishData.wishEndTime) {
      return NextResponse.json({
        success: false,
        error: 'Target date, start time, and end time are required'
      } as ApiResponse<never>, { status: 400 });
    }

    const fields = {
      '希望従業員': [user.userId],
      '対象日': wishData.targetDate,
      '希望開始時刻': wishData.wishStartTime,
      '希望終了時刻': wishData.wishEndTime,
      '提出日時': new Date().toISOString()
    };

    const result = await createTableRecord(LARK_BASE_CONFIG.tables.wishes, fields);
    
    return NextResponse.json({
      success: true,
      data: { id: result?.record?.record_id }
    } as ApiResponse<{ id: string }>);

  } catch (error) {
    console.error('Create wish error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>, { status: 500 });
  }
}

export const POST = requireAuth(createWishHandler);