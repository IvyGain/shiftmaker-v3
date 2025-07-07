// 週次固定シフトテンプレートのユーティリティ関数

import { AdminShiftSlot } from '@/types';

// 祝日リスト（2025年）
export const HOLIDAYS_2025 = [
  '2025-01-01', // 元日
  '2025-01-13', // 成人の日
  '2025-02-11', // 建国記念の日
  '2025-02-23', // 天皇誕生日
  '2025-03-20', // 春分の日
  '2025-04-29', // 昭和の日
  '2025-05-03', // 憲法記念日
  '2025-05-04', // みどりの日
  '2025-05-05', // こどもの日
  '2025-07-21', // 海の日
  '2025-08-11', // 山の日
  '2025-09-15', // 敬老の日
  '2025-09-23', // 秋分の日
  '2025-10-13', // 体育の日
  '2025-11-03', // 文化の日
  '2025-11-23', // 勤労感謝の日
];

// 曜日ごとの基本シフト枠設定
export const WEEKLY_BASE_SCHEDULE = {
  Monday: [
    {
      startTime: '09:00',
      endTime: '21:00',
      role: 'パートナー',
      requiredPeople: 1,
      requiredSkills: ['カフェ業務'],
      notes: '平日基本シフト'
    },
    {
      startTime: '09:00',
      endTime: '18:00',
      role: 'マネージャー',
      requiredPeople: 1,
      requiredSkills: ['マネジメント', 'カフェ業務'],
      notes: '管理業務'
    }
  ],
  Tuesday: [
    {
      startTime: '15:00',
      endTime: '19:00',
      role: 'パートナー',
      requiredPeople: 1,
      requiredSkills: ['カフェ業務'],
      notes: '夕方シフト'
    },
    {
      startTime: '10:00',
      endTime: '18:00',
      role: 'マネージャー',
      requiredPeople: 1,
      requiredSkills: ['マネジメント', 'カフェ業務'],
      notes: '管理業務'
    }
  ],
  Wednesday: [
    {
      startTime: '15:00',
      endTime: '21:00',
      role: 'パートナー',
      requiredPeople: 1,
      requiredSkills: ['カフェ業務'],
      notes: '夕方〜夜シフト'
    },
    {
      startTime: '10:00',
      endTime: '18:00',
      role: 'マネージャー',
      requiredPeople: 1,
      requiredSkills: ['マネジメント', 'カフェ業務'],
      notes: '管理業務'
    }
  ],
  Thursday: [
    {
      startTime: '08:30',
      endTime: '16:00',
      role: 'パートナー',
      requiredPeople: 1,
      requiredSkills: ['カフェ業務'],
      notes: '朝〜夕方シフト'
    },
    {
      startTime: '10:00',
      endTime: '18:00',
      role: 'マネージャー',
      requiredPeople: 1,
      requiredSkills: ['マネジメント', 'カフェ業務'],
      notes: '管理業務'
    }
  ],
  Friday: [
    {
      startTime: '08:30',
      endTime: '13:00',
      role: 'パートナー',
      requiredPeople: 1,
      requiredSkills: ['カフェ業務'],
      notes: '朝〜昼シフト'
    },
    {
      startTime: '11:00',
      endTime: '16:00',
      role: 'パートナー',
      requiredPeople: 2,
      requiredSkills: ['カフェ業務'],
      notes: 'ランチタイム強化'
    },
    {
      startTime: '16:00',
      endTime: '21:00',
      role: 'パートナー',
      requiredPeople: 2,
      requiredSkills: ['カフェ業務'],
      notes: '夕方〜夜シフト強化'
    },
    {
      startTime: '10:00',
      endTime: '18:00',
      role: 'マネージャー',
      requiredPeople: 1,
      requiredSkills: ['マネジメント', 'カフェ業務'],
      notes: '管理業務'
    }
  ],
  Saturday: [
    {
      startTime: '08:00',
      endTime: '13:00',
      role: 'パートナー',
      requiredPeople: 1,
      requiredSkills: ['カフェ業務'],
      notes: '土曜朝シフト'
    },
    {
      startTime: '10:00',
      endTime: '16:00',
      role: 'パートナー',
      requiredPeople: 2,
      requiredSkills: ['カフェ業務'],
      notes: '土曜昼間強化'
    },
    {
      startTime: '16:00',
      endTime: '21:00',
      role: 'パートナー',
      requiredPeople: 3,
      requiredSkills: ['カフェ業務'],
      notes: '土曜夕方ピーク'
    },
    {
      startTime: '10:00',
      endTime: '18:00',
      role: 'マネージャー',
      requiredPeople: 1,
      requiredSkills: ['マネジメント', 'カフェ業務'],
      notes: '土曜管理業務'
    }
  ],
  Sunday: [
    {
      startTime: '08:00',
      endTime: '14:00',
      role: 'パートナー',
      requiredPeople: 1,
      requiredSkills: ['カフェ業務'],
      notes: '日曜朝〜昼シフト'
    },
    {
      startTime: '10:00',
      endTime: '16:00',
      role: 'パートナー',
      requiredPeople: 2,
      requiredSkills: ['カフェ業務'],
      notes: '日曜昼間強化'
    },
    {
      startTime: '15:00',
      endTime: '19:00',
      role: 'パートナー',
      requiredPeople: 1,
      requiredSkills: ['カフェ業務'],
      notes: '日曜夕方シフト'
    },
    {
      startTime: '10:00',
      endTime: '18:00',
      role: 'マネージャー',
      requiredPeople: 1,
      requiredSkills: ['マネジメント', 'カフェ業務'],
      notes: '日曜管理業務'
    }
  ]
} as const;

// 祝日判定
export const isHoliday = (dateString: string): boolean => {
  return HOLIDAYS_2025.includes(dateString);
};

// 週末判定
export const isWeekend = (dateString: string): boolean => {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // 日曜日(0)または土曜日(6)
};

// 週の月曜日の日付を取得
export const getMonday = (date: Date): Date => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

// 指定された日付から週次シフトを生成
export const generateWeeklyShifts = (startDate: Date): Partial<AdminShiftSlot>[] => {
  const slots: Partial<AdminShiftSlot>[] = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
  
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);
    const dayName = dayNames[currentDate.getDay()];
    const dateString = currentDate.toISOString().split('T')[0];
    
    if (WEEKLY_BASE_SCHEDULE[dayName]) {
      WEEKLY_BASE_SCHEDULE[dayName].forEach((shift, index) => {
        slots.push({
          id: `template-${day}-${index}-${Date.now()}`,
          targetDate: dateString,
          startTime: shift.startTime,
          endTime: shift.endTime,
          requiredPeople: shift.requiredPeople,
          requiredSkills: shift.requiredSkills,
          notes: `${shift.notes} (${shift.role})`,
          breakTime: 30 // デフォルト休憩時間
        });
      });
    }
  }
  
  return slots;
};

// 複数週にわたるシフト生成
export const generateMultipleWeeksShifts = (startDate: Date, weeks: number = 1): Partial<AdminShiftSlot>[] => {
  const allSlots: Partial<AdminShiftSlot>[] = [];
  
  for (let week = 0; week < weeks; week++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + (week * 7));
    const weekSlots = generateWeeklyShifts(weekStart);
    allSlots.push(...weekSlots);
  }
  
  return allSlots;
};

// 日付範囲内の祝日を取得
export const getHolidaysInRange = (startDate: string, endDate: string): string[] => {
  return HOLIDAYS_2025.filter(holiday => holiday >= startDate && holiday <= endDate);
};

// シフト統計情報を取得
export const getShiftStatistics = (slots: Partial<AdminShiftSlot>[]) => {
  const totalSlots = slots.length;
  const totalPeople = slots.reduce((sum, slot) => sum + (slot.requiredPeople || 0), 0);
  const weekendSlots = slots.filter(slot => slot.targetDate && isWeekend(slot.targetDate)).length;
  const holidaySlots = slots.filter(slot => slot.targetDate && isHoliday(slot.targetDate)).length;
  
  const skillCounts = slots.reduce((counts, slot) => {
    slot.requiredSkills?.forEach(skill => {
      counts[skill] = (counts[skill] || 0) + (slot.requiredPeople || 0);
    });
    return counts;
  }, {} as Record<string, number>);
  
  return {
    totalSlots,
    totalPeople,
    weekendSlots,
    holidaySlots,
    skillCounts,
    averagePeoplePerSlot: totalSlots > 0 ? Math.round(totalPeople / totalSlots * 10) / 10 : 0
  };
};