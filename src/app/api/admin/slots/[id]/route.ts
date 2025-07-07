import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { updateTableRecord, deleteTableRecord, LARK_BASE_CONFIG } from '@/lib/lark';
import { ApiResponse } from '@/types';

async function updateAdminSlotHandler(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const slotData = await req.json();
    const { id } = params;

    const fields = {
      '対象日': slotData.targetDate,
      '開始時刻': slotData.startTime,
      '終了時刻': slotData.endTime,
      '必要人数': slotData.requiredPeople,
      '必要スキル': slotData.requiredSkills,
      '休憩時間(分)': slotData.breakTime,
      '備考': slotData.notes
    };

    await updateTableRecord(LARK_BASE_CONFIG.tables.adminSlots, id, fields);
    
    return NextResponse.json({
      success: true,
      data: { id }
    } as ApiResponse<{ id: string }>);

  } catch (error) {
    console.error('Update admin slot error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>, { status: 500 });
  }
}

async function deleteAdminSlotHandler(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    await deleteTableRecord(LARK_BASE_CONFIG.tables.adminSlots, id);
    
    return NextResponse.json({
      success: true,
      data: { id }
    } as ApiResponse<{ id: string }>);

  } catch (error) {
    console.error('Delete admin slot error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>, { status: 500 });
  }
}

export const PUT = requireAdmin(updateAdminSlotHandler);
export const DELETE = requireAdmin(deleteAdminSlotHandler);