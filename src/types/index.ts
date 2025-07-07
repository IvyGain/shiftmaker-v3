// Employee types
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'employee';
  skills: string[];
  workHoursLimit?: '20hours' | '30hours_under';
  larkUserId?: string;
}

// Skill types
export interface Skill {
  name: string;
  description: string;
}

// Admin Shift Slot types
export interface AdminShiftSlot {
  id: string;
  targetDate: string;
  startTime: string;
  endTime: string;
  requiredPeople: number;
  requiredSkills: string[];
  breakTime?: number;
  notes?: string;
}

// Staff Shift Wish types
export interface StaffShiftWish {
  id: string;
  employeeId: string;
  employeeName: string;
  targetDate: string;
  wishStartTime: string;
  wishEndTime: string;
  submittedAt: string;
}

// Final Shift types
export interface FinalShift {
  id: string;
  workDate: string;
  startTime: string;
  endTime: string;
  employeeId: string;
  employeeName: string;
  originalSlotId: string;
  notes?: string;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// JWT Payload types
export interface JwtPayload {
  userId: string;
  name: string;
  role: 'manager' | 'employee';
  iat: number;
  exp: number;
}

// Login request/response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'manager' | 'employee';
  };
}

// Calendar view types
export interface CalendarViewRequest {
  startDate: string;
  endDate: string;
}

export interface CalendarViewResponse {
  adminSlots: AdminShiftSlot[];
  finalShifts: FinalShift[];
}

// Shift finalization types
export interface ShiftFinalizationRequest {
  slotId: string;
  employeeId: string;
  notes?: string;
}