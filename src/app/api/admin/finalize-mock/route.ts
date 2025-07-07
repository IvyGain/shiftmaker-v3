import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { mockAdminSlots, addMockFinalShift, USE_MOCK_DATA, MOCK_USERS } from '@/lib/mock-data';
import { ApiResponse, ShiftFinalizationRequest, FinalShift } from '@/types';

async function finalizeShiftHandler(req: NextRequest) {
  if (!USE_MOCK_DATA) {
    return NextResponse.json({
      success: false,
      error: 'Mock data is disabled'
    } as ApiResponse<never>, { status: 403 });
  }

  try {
    const { slotId, employeeId, notes }: ShiftFinalizationRequest = await req.json();

    if (!slotId || !employeeId) {
      return NextResponse.json({
        success: false,
        error: 'Slot ID and Employee ID are required'
      } as ApiResponse<never>, { status: 400 });
    }

    // Get slot information
    const slot = mockAdminSlots.find(s => s.id === slotId);
    if (!slot) {
      return NextResponse.json({
        success: false,
        error: 'Slot not found'
      } as ApiResponse<never>, { status: 404 });
    }

    // Get employee information
    const employee = MOCK_USERS.find(u => u.id === employeeId);
    if (!employee) {
      return NextResponse.json({
        success: false,
        error: 'Employee not found'
      } as ApiResponse<never>, { status: 404 });
    }

    // Create final shift record
    const newFinalShift: FinalShift = {
      id: `final-${Date.now()}`,
      workDate: slot.targetDate,
      startTime: slot.startTime,
      endTime: slot.endTime,
      employeeId: employeeId,
      employeeName: employee.name,
      originalSlotId: slotId,
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    addMockFinalShift(newFinalShift);
    
    return NextResponse.json({
      success: true,
      data: { id: newFinalShift.id }
    } as ApiResponse<{ id: string }>);
  } catch (error) {
    console.error('Mock finalize shift error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>, { status: 500 });
  }
}

export const POST = requireAdmin(finalizeShiftHandler);