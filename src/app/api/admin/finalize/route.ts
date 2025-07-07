import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createTableRecord, getTableRecords, LARK_BASE_CONFIG } from '@/lib/lark';
import { ApiResponse, ShiftFinalizationRequest } from '@/types';

async function finalizeShiftHandler(req: NextRequest) {
  try {
    const { slotId, employeeId, notes }: ShiftFinalizationRequest = await req.json();

    if (!slotId || !employeeId) {
      return NextResponse.json({
        success: false,
        error: 'Slot ID and Employee ID are required'
      } as ApiResponse<never>, { status: 400 });
    }

    // Get slot information
    const adminSlotsData = await getTableRecords(LARK_BASE_CONFIG.tables.adminSlots);
    const slot = adminSlotsData?.items?.find((item: any) => item.record_id === slotId);

    if (!slot) {
      return NextResponse.json({
        success: false,
        error: 'Slot not found'
      } as ApiResponse<never>, { status: 404 });
    }

    // Create final shift record
    const fields = {
      '勤務日': slot.fields['対象日'],
      '開始時刻': slot.fields['開始時刻'],
      '終了時刻': slot.fields['終了時刻'],
      '担当従業員': [employeeId],
      '元になった枠': [slotId],
      '備考': notes || '',
      '作成日時': new Date().toISOString()
    };

    const result = await createTableRecord(LARK_BASE_CONFIG.tables.finalShifts, fields);
    
    return NextResponse.json({
      success: true,
      data: { id: result?.record?.record_id }
    } as ApiResponse<{ id: string }>);

  } catch (error) {
    console.error('Finalize shift error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>, { status: 500 });
  }
}

export const POST = requireAdmin(finalizeShiftHandler);