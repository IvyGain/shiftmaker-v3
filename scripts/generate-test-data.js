// テストデータ生成スクリプト

const bcrypt = require('bcryptjs');

// 今日から指定日数後の日付を取得
function getDateAfterDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

// パスワードをハッシュ化
async function generatePasswordHashes() {
  const passwords = ['admin123', 'employee123', 'sato123', 'tanaka123', 'yamada123'];
  const saltRounds = 10;
  
  console.log('=== パスワードハッシュ ===');
  for (const password of passwords) {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(`${password}: ${hash}`);
  }
  console.log('\n');
}

// テストデータ生成
function generateTestData() {
  console.log('=== Lark Base テストデータ ===\n');

  // 1. スキルテーブルデータ
  console.log('【1. スキルテーブル】');
  const skills = [
    { name: 'カフェ業務', description: 'ドリンク作成、接客対応' },
    { name: 'キッチン業務', description: 'フード調理、盛り付け' },
    { name: 'レジ業務', description: '会計処理、POS操作' },
    { name: 'マネジメント', description: '店舗運営、スタッフ管理' },
    { name: '清掃業務', description: '店内清掃、設備メンテナンス' }
  ];
  
  skills.forEach(skill => {
    console.log(`スキル名: ${skill.name}, 説明: ${skill.description}`);
  });
  console.log('\n');

  // 2. 従業員テーブルデータ
  console.log('【2. 従業員テーブル】');
  const employees = [
    {
      name: '管理者太郎',
      email: 'admin@example.com',
      password: '$2b$10$xO1NcGfgiab9K/9HEAWlbe21g4ioWa1xVo2ITTO94ixRpPI53dTHe',
      role: '管理者',
      skills: 'カフェ業務, マネジメント',
      workHoursLimit: '30時間未満'
    },
    {
      name: '従業員花子',
      email: 'employee@example.com',
      password: '$2b$10$vxjzjPnnO9JcQWLopG.fzea3tbF1SUMNMBSclbBBEyQsuH/Ha4jYe',
      role: '従業員',
      skills: 'カフェ業務',
      workHoursLimit: '20時間'
    },
    {
      name: '佐藤次郎',
      email: 'sato@example.com',
      password: '$2b$10$vxjzjPnnO9JcQWLopG.fzea3tbF1SUMNMBSclbBBEyQsuH/Ha4jYe',
      role: '従業員',
      skills: 'カフェ業務, キッチン業務',
      workHoursLimit: '30時間未満'
    },
    {
      name: '田中美咲',
      email: 'tanaka@example.com',
      password: '$2b$10$vxjzjPnnO9JcQWLopG.fzea3tbF1SUMNMBSclbBBEyQsuH/Ha4jYe',
      role: '従業員',
      skills: 'カフェ業務, レジ業務',
      workHoursLimit: '20時間'
    },
    {
      name: '山田健太',
      email: 'yamada@example.com',
      password: '$2b$10$vxjzjPnnO9JcQWLopG.fzea3tbF1SUMNMBSclbBBEyQsuH/Ha4jYe',
      role: '従業員',
      skills: 'キッチン業務, 清掃業務',
      workHoursLimit: '30時間未満'
    }
  ];

  employees.forEach(emp => {
    console.log(`氏名: ${emp.name}`);
    console.log(`メールアドレス: ${emp.email}`);
    console.log(`パスワード: ${emp.password}`);
    console.log(`権限: ${emp.role}`);
    console.log(`所持スキル: ${emp.skills}`);
    console.log(`週の労働時間上限: ${emp.workHoursLimit}`);
    console.log(`LarkユーザーID: (空白)`);
    console.log('---');
  });
  console.log('\n');

  // 3. 管理者希望シフト枠テーブルデータ
  console.log('【3. 管理者希望シフト枠テーブル】');
  const adminSlots = [
    {
      targetDate: getDateAfterDays(1),
      startTime: '09:00',
      endTime: '13:00',
      requiredPeople: 2,
      requiredSkills: 'カフェ業務',
      breakTime: 30,
      notes: '朝のピークタイム対応'
    },
    {
      targetDate: getDateAfterDays(1),
      startTime: '13:00',
      endTime: '17:00',
      requiredPeople: 3,
      requiredSkills: 'カフェ業務, キッチン業務',
      breakTime: 45,
      notes: 'ランチタイム対応'
    },
    {
      targetDate: getDateAfterDays(2),
      startTime: '10:00',
      endTime: '15:00',
      requiredPeople: 2,
      requiredSkills: 'カフェ業務, レジ業務',
      breakTime: 60,
      notes: '平日昼間シフト'
    },
    {
      targetDate: getDateAfterDays(3),
      startTime: '17:00',
      endTime: '21:00',
      requiredPeople: 2,
      requiredSkills: 'カフェ業務',
      breakTime: 30,
      notes: '夕方〜夜シフト'
    },
    {
      targetDate: getDateAfterDays(5),
      startTime: '08:00',
      endTime: '12:00',
      requiredPeople: 3,
      requiredSkills: 'カフェ業務, キッチン業務',
      breakTime: 30,
      notes: '土曜日朝シフト'
    },
    {
      targetDate: getDateAfterDays(6),
      startTime: '14:00',
      endTime: '18:00',
      requiredPeople: 4,
      requiredSkills: 'カフェ業務, キッチン業務, レジ業務',
      breakTime: 45,
      notes: '日曜日午後シフト'
    }
  ];

  adminSlots.forEach(slot => {
    console.log(`対象日: ${slot.targetDate}, 開始時刻: ${slot.startTime}, 終了時刻: ${slot.endTime}, 必要人数: ${slot.requiredPeople}, 必要スキル: ${slot.requiredSkills}, 休憩時間(分): ${slot.breakTime}, 備考: ${slot.notes}`);
  });
  console.log('\n');

  // 4. スタッフ希望シフトテーブルデータ
  console.log('【4. スタッフ希望シフトテーブル】');
  const staffWishes = [
    {
      employee: '従業員花子',
      targetDate: getDateAfterDays(1),
      startTime: '09:00',
      endTime: '13:00'
    },
    {
      employee: '佐藤次郎',
      targetDate: getDateAfterDays(1),
      startTime: '13:00',
      endTime: '17:00'
    },
    {
      employee: '田中美咲',
      targetDate: getDateAfterDays(2),
      startTime: '10:00',
      endTime: '15:00'
    },
    {
      employee: '従業員花子',
      targetDate: getDateAfterDays(3),
      startTime: '17:00',
      endTime: '21:00'
    },
    {
      employee: '山田健太',
      targetDate: getDateAfterDays(5),
      startTime: '08:00',
      endTime: '12:00'
    },
    {
      employee: '佐藤次郎',
      targetDate: getDateAfterDays(6),
      startTime: '14:00',
      endTime: '18:00'
    }
  ];

  staffWishes.forEach(wish => {
    console.log(`希望従業員: ${wish.employee}, 対象日: ${wish.targetDate}, 希望開始時刻: ${wish.startTime}, 希望終了時刻: ${wish.endTime}`);
  });
  console.log('\n');

  // 5. 確定シフトテーブルデータ
  console.log('【5. 確定シフトテーブル】');
  const finalShifts = [
    {
      workDate: getDateAfterDays(1),
      startTime: '09:00',
      endTime: '13:00',
      employee: '従業員花子',
      notes: '朝のピークタイム対応'
    },
    {
      workDate: getDateAfterDays(2),
      startTime: '10:00',
      endTime: '15:00',
      employee: '田中美咲',
      notes: '平日昼間シフト'
    }
  ];

  finalShifts.forEach(shift => {
    console.log(`勤務日: ${shift.workDate}, 開始時刻: ${shift.startTime}, 終了時刻: ${shift.endTime}, 担当従業員: ${shift.employee}, 備考: ${shift.notes}`);
  });
  console.log('\n');

  // 環境変数テンプレート
  console.log('【6. .env.local テンプレート】');
  console.log(`# Lark API Authentication
LARK_APP_ID=cli_実際のAppID
LARK_APP_SECRET=実際のAppSecret

# Lark Base (Bitable) App  
LARK_BASE_TOKEN=basc実際のBaseToken

# Table IDs (実際のテーブルID)
LARK_EMPLOYEES_TABLE_ID=tbl_実際のEmployeesテーブルID
LARK_SKILLS_TABLE_ID=tbl_実際のSkillsテーブルID
LARK_ADMIN_SLOTS_TABLE_ID=tbl_実際のAdminSlotsテーブルID
LARK_WISHES_TABLE_ID=tbl_実際のWishesテーブルID
LARK_FINAL_SHIFTS_TABLE_ID=tbl_実際のFinalShiftsテーブルID

# JWT Authentication
JWT_SECRET=supersecretjwtkeyforprojectshiftmaker2024

# Development
NODE_ENV=development`);
}

// 実行
async function main() {
  await generatePasswordHashes();
  generateTestData();
  
  console.log('\n=== セットアップ完了後の確認手順 ===');
  console.log('1. Lark Baseでテーブル作成とデータ投入');
  console.log('2. .env.localファイルの更新');
  console.log('3. アプリケーション再起動: npm run dev');
  console.log('4. 管理者アカウントでログインテスト');
  console.log('5. シフト機能の動作確認');
}

main().catch(console.error);