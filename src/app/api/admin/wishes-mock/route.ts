import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { mockStaffWishes, USE_MOCK_DATA } from '@/lib/mock-data';
import { ApiResponse, StaffShiftWish } from '@/types';

async function getStaffWishesHandler(req: NextRequest) {
  if (!USE_MOCK_DATA) {
    return NextResponse.json({
      success: false,
      error: 'Mock data is disabled'
    } as ApiResponse<never>, { status: 403 });
  }

  try {
    const url = new URL(req.url);
    const targetDate = url.searchParams.get('targetDate');

    let wishes = [...mockStaffWishes];

    // Filter by target date if specified
    if (targetDate) {
      wishes = wishes.filter(wish => wish.targetDate === targetDate);
    }

    return NextResponse.json({
      success: true,
      data: wishes
    } as ApiResponse<StaffShiftWish[]>);
  } catch (error) {
    console.error('Get mock staff wishes error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>, { status: 500 });
  }
}

export const GET = requireAdmin(getStaffWishesHandler);