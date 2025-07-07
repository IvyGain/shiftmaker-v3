import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { ApiResponse } from '@/types';

async function getMeHandler(req: NextRequest) {
  const user = (req as any).user;
  
  return NextResponse.json({
    success: true,
    data: {
      id: user.userId,
      name: user.name,
      role: user.role
    }
  } as ApiResponse<{ id: string; name: string; role: string; }>);
}

export const GET = requireAuth(getMeHandler);