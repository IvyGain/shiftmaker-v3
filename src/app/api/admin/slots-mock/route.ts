import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { mockAdminSlots, addMockAdminSlot, USE_MOCK_DATA } from '@/lib/mock-data';
import { ApiResponse, AdminShiftSlot } from '@/types';

async function getAdminSlotsHandler(req: NextRequest) {
  if (!USE_MOCK_DATA) {
    return NextResponse.json({
      success: false,
      error: 'Mock data is disabled'
    } as ApiResponse<never>, { status: 403 });
  }

  try {
    return NextResponse.json({
      success: true,
      data: mockAdminSlots
    } as ApiResponse<AdminShiftSlot[]>);
  } catch (error) {
    console.error('Get mock admin slots error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>, { status: 500 });
  }
}

async function createAdminSlotHandler(req: NextRequest) {
  if (!USE_MOCK_DATA) {
    return NextResponse.json({
      success: false,
      error: 'Mock data is disabled'
    } as ApiResponse<never>, { status: 403 });
  }

  try {
    const slotData = await req.json();
    
    const newSlot: AdminShiftSlot = {
      id: `slot-${Date.now()}`,
      targetDate: slotData.targetDate,
      startTime: slotData.startTime,
      endTime: slotData.endTime,
      requiredPeople: slotData.requiredPeople,
      requiredSkills: slotData.requiredSkills || [],
      breakTime: slotData.breakTime,
      notes: slotData.notes
    };

    addMockAdminSlot(newSlot);
    
    return NextResponse.json({
      success: true,
      data: { id: newSlot.id }
    } as ApiResponse<{ id: string }>);
  } catch (error) {
    console.error('Create mock admin slot error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>, { status: 500 });
  }
}

export const GET = requireAdmin(getAdminSlotsHandler);
export const POST = requireAdmin(createAdminSlotHandler);