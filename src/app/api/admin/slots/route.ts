import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getTableRecords, createTableRecord, LARK_BASE_CONFIG } from '@/lib/lark';
import { ApiResponse, AdminShiftSlot } from '@/types';

async function getAdminSlotsHandler(req: NextRequest) {
  try {
    const adminSlotsData = await getTableRecords(LARK_BASE_CONFIG.tables.adminSlots);
    
    const adminSlots: AdminShiftSlot[] = adminSlotsData?.items?.map((item: any) => ({
      id: item.record_id,
      targetDate: item.fields['対象日'],
      startTime: item.fields['開始時刻'],
      endTime: item.fields['終了時刻'],
      requiredPeople: item.fields['必要人数'],
      requiredSkills: item.fields['必要スキル'] || [],
      breakTime: item.fields['休憩時間(分)'],
      notes: item.fields['備考']
    })) || [];

    return NextResponse.json({
      success: true,
      data: adminSlots
    } as ApiResponse<AdminShiftSlot[]>);

  } catch (error) {
    console.error('Get admin slots error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>, { status: 500 });
  }
}

async function createAdminSlotHandler(req: NextRequest) {
  try {
    const slotData = await req.json();
    
    const fields = {
      '対象日': slotData.targetDate,
      '開始時刻': slotData.startTime,
      '終了時刻': slotData.endTime,
      '必要人数': slotData.requiredPeople,
      '必要スキル': slotData.requiredSkills,
      '休憩時間(分)': slotData.breakTime,
      '備考': slotData.notes
    };

    const result = await createTableRecord(LARK_BASE_CONFIG.tables.adminSlots, fields);
    
    return NextResponse.json({
      success: true,
      data: { id: result?.record?.record_id }
    } as ApiResponse<{ id: string }>);

  } catch (error) {
    console.error('Create admin slot error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>, { status: 500 });
  }
}

export const GET = requireAdmin(getAdminSlotsHandler);
export const POST = requireAdmin(createAdminSlotHandler);