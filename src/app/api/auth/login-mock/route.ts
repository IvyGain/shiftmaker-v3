import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { MOCK_USERS, MOCK_PASSWORDS, USE_MOCK_DATA } from '@/lib/mock-data';
import { LoginRequest, LoginResponse, ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  if (!USE_MOCK_DATA) {
    return NextResponse.json({
      success: false,
      error: 'Mock authentication is disabled'
    } as ApiResponse<never>, { status: 403 });
  }

  try {
    const { email, password }: LoginRequest = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      } as ApiResponse<never>, { status: 400 });
    }

    // Find user in mock data
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse<never>, { status: 401 });
    }

    // Check password
    if (MOCK_PASSWORDS[email] !== password) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse<never>, { status: 401 });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      name: user.name,
      role: user.role
    });

    const response: LoginResponse = {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };

    return NextResponse.json({
      success: true,
      data: response
    } as ApiResponse<LoginResponse>);

  } catch (error) {
    console.error('Mock login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>, { status: 500 });
  }
}