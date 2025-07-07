import { Employee, AdminShiftSlot, StaffShiftWish, FinalShift, Skill } from '@/types';

// モックユーザーデータ
export const MOCK_USERS: Employee[] = [
  {
    id: 'admin-1',
    name: '管理者太郎',
    email: 'admin@example.com',
    role: 'manager',
    skills: ['カフェ業務', 'マネジメント'],
    workHoursLimit: '30hours_under',
    larkUserId: 'lark_admin_001'
  },
  {
    id: 'employee-1', 
    name: '従業員花子',
    email: 'employee@example.com',
    role: 'employee',
    skills: ['カフェ業務'],
    workHoursLimit: '20hours',
    larkUserId: 'lark_emp_001'
  },
  {
    id: 'employee-2', 
    name: '佐藤次郎',
    email: 'sato@example.com',
    role: 'employee',
    skills: ['カフェ業務', 'キッチン業務'],
    workHoursLimit: '30hours_under',
    larkUserId: 'lark_emp_002'
  },
  {
    id: 'employee-3', 
    name: '田中美咲',
    email: 'tanaka@example.com',
    role: 'employee',
    skills: ['カフェ業務', 'レジ業務'],
    workHoursLimit: '20hours',
    larkUserId: 'lark_emp_003'
  }
];

// スキルデータ
export const MOCK_SKILLS: Skill[] = [
  { name: 'カフェ業務', description: 'ドリンク作成、接客対応' },
  { name: 'キッチン業務', description: 'フード調理、盛り付け' },
  { name: 'レジ業務', description: '会計処理、POS操作' },
  { name: 'マネジメント', description: '店舗運営、スタッフ管理' }
];

// 管理者希望シフト枠データ
export const MOCK_ADMIN_SLOTS: AdminShiftSlot[] = [
  {
    id: 'slot-1',
    targetDate: '2025-07-08',
    startTime: '09:00',
    endTime: '13:00',
    requiredPeople: 2,
    requiredSkills: ['カフェ業務'],
    breakTime: 30,
    notes: '朝のピークタイム対応'
  },
  {
    id: 'slot-2',
    targetDate: '2025-07-08',
    startTime: '13:00',
    endTime: '17:00',
    requiredPeople: 3,
    requiredSkills: ['カフェ業務', 'キッチン業務'],
    breakTime: 45,
    notes: 'ランチタイム対応'
  },
  {
    id: 'slot-3',
    targetDate: '2025-07-09',
    startTime: '10:00',
    endTime: '15:00',
    requiredPeople: 2,
    requiredSkills: ['カフェ業務', 'レジ業務'],
    breakTime: 60,
    notes: '平日昼間シフト'
  },
  {
    id: 'slot-4',
    targetDate: '2025-07-10',
    startTime: '17:00',
    endTime: '21:00',
    requiredPeople: 2,
    requiredSkills: ['カフェ業務'],
    breakTime: 30,
    notes: '夕方〜夜シフト'
  }
];

// スタッフ希望シフトデータ
export const MOCK_STAFF_WISHES: StaffShiftWish[] = [
  {
    id: 'wish-1',
    employeeId: 'employee-1',
    employeeName: '従業員花子',
    targetDate: '2025-07-08',
    wishStartTime: '09:00',
    wishEndTime: '13:00',
    submittedAt: '2025-07-07T10:00:00Z'
  },
  {
    id: 'wish-2',
    employeeId: 'employee-2',
    employeeName: '佐藤次郎',
    targetDate: '2025-07-08',
    wishStartTime: '13:00',
    wishEndTime: '17:00',
    submittedAt: '2025-07-07T10:30:00Z'
  },
  {
    id: 'wish-3',
    employeeId: 'employee-3',
    employeeName: '田中美咲',
    targetDate: '2025-07-09',
    wishStartTime: '10:00',
    wishEndTime: '15:00',
    submittedAt: '2025-07-07T11:00:00Z'
  },
  {
    id: 'wish-4',
    employeeId: 'employee-1',
    employeeName: '従業員花子',
    targetDate: '2025-07-10',
    wishStartTime: '17:00',
    wishEndTime: '21:00',
    submittedAt: '2025-07-07T11:30:00Z'
  }
];

// 確定シフトデータ
export const MOCK_FINAL_SHIFTS: FinalShift[] = [
  {
    id: 'final-1',
    workDate: '2025-07-08',
    startTime: '09:00',
    endTime: '13:00',
    employeeId: 'employee-1',
    employeeName: '従業員花子',
    originalSlotId: 'slot-1',
    notes: '朝のピークタイム対応',
    createdAt: '2025-07-07T12:00:00Z'
  }
];

// パスワードマップ（実際のプロダクションでは使用しない）
export const MOCK_PASSWORDS: Record<string, string> = {
  'admin@example.com': 'admin123',
  'employee@example.com': 'employee123',
  'sato@example.com': 'sato123',
  'tanaka@example.com': 'tanaka123'
};

// 開発モードかどうかの判定
export const USE_MOCK_DATA = process.env.NODE_ENV === 'development' && 
  process.env.LARK_APP_ID === 'cli_a1b2c3d4e5f6g7h8'; // 仮の値の場合はモック使用

// In-memory storage for mock data (実際のアプリでは永続化されない)
export let mockAdminSlots = [...MOCK_ADMIN_SLOTS];
export let mockStaffWishes = [...MOCK_STAFF_WISHES];
export let mockFinalShifts = [...MOCK_FINAL_SHIFTS];

// Helper functions for mock data manipulation
export const addMockAdminSlot = (slot: AdminShiftSlot) => {
  mockAdminSlots.push(slot);
};

export const addMockStaffWish = (wish: StaffShiftWish) => {
  mockStaffWishes.push(wish);
};

export const addMockFinalShift = (shift: FinalShift) => {
  mockFinalShifts.push(shift);
};

export const updateMockAdminSlot = (id: string, updates: Partial<AdminShiftSlot>) => {
  const index = mockAdminSlots.findIndex(slot => slot.id === id);
  if (index !== -1) {
    mockAdminSlots[index] = { ...mockAdminSlots[index], ...updates };
  }
};

export const deleteMockAdminSlot = (id: string) => {
  mockAdminSlots = mockAdminSlots.filter(slot => slot.id !== id);
};