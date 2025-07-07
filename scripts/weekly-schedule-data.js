// 毎週固定の基本シフト枠データ（画像から読み取ったスケジュール）

// 曜日ごとの基本シフト枠設定
const WEEKLY_BASE_SCHEDULE = {
  // 月曜日 (07/07 Mon)
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

  // 火曜日 (07/08 Tue)
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

  // 水曜日 (07/09 Wed)
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

  // 木曜日 (07/10 Thu)
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

  // 金曜日 (07/11 Fri)
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

  // 土曜日 (07/12 Sat)
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

  // 日曜日 (07/13 Sun)
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
};

// 指定された日付から何週間分かのシフト枠を生成
function generateWeeklyShifts(startDate, weeks = 4) {
  const shifts = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  for (let week = 0; week < weeks; week++) {
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (week * 7) + day);
      
      const dayName = dayNames[currentDate.getDay()];
      const dateString = currentDate.toISOString().split('T')[0];
      
      if (WEEKLY_BASE_SCHEDULE[dayName]) {
        WEEKLY_BASE_SCHEDULE[dayName].forEach((shift, index) => {
          shifts.push({
            id: `weekly-${week}-${day}-${index}`,
            targetDate: dateString,
            startTime: shift.startTime,
            endTime: shift.endTime,
            requiredPeople: shift.requiredPeople,
            requiredSkills: shift.requiredSkills,
            role: shift.role,
            notes: shift.notes,
            isWeeklyTemplate: true
          });
        });
      }
    }
  }
  
  return shifts;
}

// 祝日・休日の判定と表示（赤字表示用）
const HOLIDAYS_2025 = [
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

function isHoliday(dateString) {
  return HOLIDAYS_2025.includes(dateString);
}

function isWeekend(dateString) {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // 日曜日(0)または土曜日(6)
}

// 今日から4週間分のシフト枠を生成
const today = new Date();
const weeklyShifts = generateWeeklyShifts(today, 4);

console.log('=== 毎週固定シフト枠データ ===');
console.log(`生成期間: ${today.toISOString().split('T')[0]} から 4週間`);
console.log(`生成されたシフト枠数: ${weeklyShifts.length}個\n`);

// 日付順にソートして表示
weeklyShifts
  .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
  .forEach(shift => {
    const date = new Date(shift.targetDate);
    const dayName = date.toLocaleDateString('ja-JP', { weekday: 'short' });
    const isSpecialDay = isHoliday(shift.targetDate) || isWeekend(shift.targetDate);
    
    console.log(`対象日: ${shift.targetDate}(${dayName})${isSpecialDay ? ' [休日]' : ''}, 開始時刻: ${shift.startTime}, 終了時刻: ${shift.endTime}, 必要人数: ${shift.requiredPeople}, 必要スキル: ${shift.requiredSkills.join(',')}, 備考: ${shift.notes} [${shift.role}]`);
  });

module.exports = {
  WEEKLY_BASE_SCHEDULE,
  generateWeeklyShifts,
  isHoliday,
  isWeekend,
  HOLIDAYS_2025
};