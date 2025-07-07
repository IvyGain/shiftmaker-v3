import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { mockAdminSlots, mockFinalShifts, USE_MOCK_DATA } from '@/lib/mock-data';
import { ApiResponse, CalendarViewResponse, AdminShiftSlot, FinalShift } from '@/types';

async function getCalendarViewHandler(req: NextRequest) {
  if (!USE_MOCK_DATA) {
    return NextResponse.json({
      success: false,
      error: 'Mock data is disabled'
    } as ApiResponse<never>, { status: 403 });
  }

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

    // Filter by date range
    const filteredAdminSlots = mockAdminSlots.filter(slot => 
      slot.targetDate >= startDate && slot.targetDate <= endDate
    );

    const filteredFinalShifts = mockFinalShifts.filter(shift => 
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
    console.error('Mock calendar view error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>, { status: 500 });
  }
}

export const GET = requireAuth(getCalendarViewHandler);