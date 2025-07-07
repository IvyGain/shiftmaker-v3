import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getTableRecords, LARK_BASE_CONFIG } from '@/lib/lark';
import { ApiResponse, StaffShiftWish } from '@/types';

async function getStaffWishesHandler(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const targetDate = url.searchParams.get('targetDate');

    const wishesData = await getTableRecords(LARK_BASE_CONFIG.tables.wishes);
    const employeesData = await getTableRecords(LARK_BASE_CONFIG.tables.employees);

    // Create employee lookup map
    const employeeMap = new Map();
    employeesData?.items?.forEach((item: any) => {
      employeeMap.set(item.record_id, item.fields['氏名']);
    });

    let wishes: StaffShiftWish[] = wishesData?.items?.map((item: any) => ({
      id: item.record_id,
      employeeId: item.fields['希望従業員']?.[0] || '',
      employeeName: employeeMap.get(item.fields['希望従業員']?.[0]) || '',
      targetDate: item.fields['対象日'],
      wishStartTime: item.fields['希望開始時刻'],
      wishEndTime: item.fields['希望終了時刻'],
      submittedAt: item.fields['提出日時']
    })) || [];

    // Filter by target date if specified
    if (targetDate) {
      wishes = wishes.filter(wish => wish.targetDate === targetDate);
    }

    return NextResponse.json({
      success: true,
      data: wishes
    } as ApiResponse<StaffShiftWish[]>);

  } catch (error) {
    console.error('Get staff wishes error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>, { status: 500 });
  }
}

export const GET = requireAdmin(getStaffWishesHandler);