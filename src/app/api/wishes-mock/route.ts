import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { addMockStaffWish, USE_MOCK_DATA, MOCK_USERS } from '@/lib/mock-data';
import { ApiResponse, StaffShiftWish } from '@/types';

async function createWishHandler(req: NextRequest & { user?: { userId: string; name: string; role: string; } }) {
  if (!USE_MOCK_DATA) {
    return NextResponse.json({
      success: false,
      error: 'Mock data is disabled'
    } as ApiResponse<never>, { status: 403 });
  }

  try {
    const user = req.user;
    const wishData = await req.json();

    if (!wishData.targetDate || !wishData.wishStartTime || !wishData.wishEndTime) {
      return NextResponse.json({
        success: false,
        error: 'Target date, start time, and end time are required'
      } as ApiResponse<never>, { status: 400 });
    }

    // Get employee name
    const employee = MOCK_USERS.find(u => u.id === user?.userId);
    const employeeName = employee?.name || 'Unknown Employee';

    const newWish: StaffShiftWish = {
      id: `wish-${Date.now()}`,
      employeeId: user?.userId || '',
      employeeName: employeeName,
      targetDate: wishData.targetDate,
      wishStartTime: wishData.wishStartTime,
      wishEndTime: wishData.wishEndTime,
      submittedAt: new Date().toISOString()
    };

    addMockStaffWish(newWish);
    
    return NextResponse.json({
      success: true,
      data: { id: newWish.id }
    } as ApiResponse<{ id: string }>);
  } catch (error) {
    console.error('Create mock wish error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>, { status: 500 });
  }
}

export const POST = requireAuth(createWishHandler);