import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getTableRecords, LARK_BASE_CONFIG } from '@/lib/lark';
import { ApiResponse, CalendarViewResponse, AdminShiftSlot, FinalShift } from '@/types';

async function getCalendarViewHandler(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json({
        success: false,
        error: 'Start date and end date are required'
      } as ApiResponse<never>, { status: 400 });
    }

    // Get admin shift slots
    const adminSlotsData = await getTableRecords(LARK_BASE_CONFIG.tables.adminSlots);
    const finalShiftsData = await getTableRecords(LARK_BASE_CONFIG.tables.finalShifts);

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

    const finalShifts: FinalShift[] = finalShiftsData?.items?.map((item: any) => ({
      id: item.record_id,
      workDate: item.fields['勤務日'],
      startTime: item.fields['開始時刻'],
      endTime: item.fields['終了時刻'],
      employeeId: item.fields['担当従業員']?.[0] || '',
      employeeName: '', // This would need to be populated via lookup
      originalSlotId: item.fields['元になった枠']?.[0] || '',
      notes: item.fields['備考'],
      createdAt: item.fields['作成日時']
    })) || [];

    // Filter by date range
    const filteredAdminSlots = adminSlots.filter(slot => 
      slot.targetDate >= startDate && slot.targetDate <= endDate
    );

    const filteredFinalShifts = finalShifts.filter(shift => 
      shift.workDate >= startDate && shift.workDate <= endDate
    );

    const response: CalendarViewResponse = {
      adminSlots: filteredAdminSlots,
      finalShifts: filteredFinalShifts
    };

    return NextResponse.json({
      success: true,
      data: response
    } as ApiResponse<CalendarViewResponse>);

  } catch (error) {
    console.error('Calendar view error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>, { status: 500 });
  }
}

export const GET = requireAuth(getCalendarViewHandler);