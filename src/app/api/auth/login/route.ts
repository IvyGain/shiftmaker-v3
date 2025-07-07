import { NextRequest, NextResponse } from 'next/server';
import { getTableRecords } from '@/lib/lark';
import { LARK_BASE_CONFIG } from '@/lib/lark';
import { comparePassword, generateToken } from '@/lib/auth';
import { LoginRequest, LoginResponse, ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { email, password }: LoginRequest = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      } as ApiResponse<never>, { status: 400 });
    }

    // Get all employees from Lark Base
    const employeesData = await getTableRecords(LARK_BASE_CONFIG.tables.employees);
    
    if (!employeesData?.items) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch employee data'
      } as ApiResponse<never>, { status: 500 });
    }

    // Find employee by email
    const employee = employeesData.items.find((item: any) => 
      item.fields['メールアドレス'] === email
    );

    if (!employee) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse<never>, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, employee.fields['パスワード']);
    
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse<never>, { status: 401 });
    }

    // Generate JWT token
    const token = generateToken({
      userId: employee.record_id,
      name: employee.fields['氏名'],
      role: employee.fields['権限'] === '管理者' ? 'manager' : 'employee'
    });

    const response: LoginResponse = {
      token,
      user: {
        id: employee.record_id,
        name: employee.fields['氏名'],
        email: employee.fields['メールアドレス'],
        role: employee.fields['権限'] === '管理者' ? 'manager' : 'employee'
      }
    };

    return NextResponse.json({
      success: true,
      data: response
    } as ApiResponse<LoginResponse>);

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<never>, { status: 500 });
  }
}