// Lark Base テーブル作成スクリプト
// Lark MCP経由でテーブルを自動作成

const { Client } = require('@larksuiteoapi/node-sdk');

// 環境変数から認証情報を取得
const LARK_APP_ID = process.env.LARK_APP_ID;
const LARK_APP_SECRET = process.env.LARK_APP_SECRET;
const LARK_BASE_TOKEN = process.env.LARK_BASE_TOKEN;

console.log('🔍 環境変数確認:');
console.log(`LARK_APP_ID: ${LARK_APP_ID ? '✅ 設定済み' : '❌ 未設定'}`);
console.log(`LARK_APP_SECRET: ${LARK_APP_SECRET ? '✅ 設定済み' : '❌ 未設定'}`);
console.log(`LARK_BASE_TOKEN: ${LARK_BASE_TOKEN ? '✅ 設定済み' : '❌ 未設定'}`);

if (!LARK_APP_ID || !LARK_APP_SECRET || !LARK_BASE_TOKEN) {
  console.error('❌ エラー: 環境変数が設定されていません');
  console.log('必要な環境変数:');
  console.log('- LARK_APP_ID');
  console.log('- LARK_APP_SECRET');
  console.log('- LARK_BASE_TOKEN');
  process.exit(1);
}

const client = new Client({
  appId: LARK_APP_ID,
  appSecret: LARK_APP_SECRET,
});

// テーブル定義
const TABLES_CONFIG = [
  {
    name: 'ShiftMaker_Skills_v2',
    displayName: 'スキルテーブル',
    fields: [
      {
        field_name: 'スキル名',
        type: 1, // 単行テキスト
        property: {
          formatter: 1
        }
      },
      {
        field_name: '説明',
        type: 3, // 複数行テキスト
        property: {}
      }
    ]
  },
  {
    name: 'ShiftMaker_Employees_v2',
    displayName: '従業員テーブル',
    fields: [
      {
        field_name: '氏名',
        type: 1, // 単行テキスト（主キー）
        property: {
          formatter: 1
        }
      },
      {
        field_name: 'メールアドレス',
        type: 1, // 単行テキスト
        property: {
          formatter: 1
        }
      },
      {
        field_name: 'パスワード',
        type: 1, // 単行テキスト
        property: {
          formatter: 1
        }
      },
      {
        field_name: '権限',
        type: 3, // 単一選択
        property: {
          options: [
            { name: '管理者' },
            { name: '従業員' }
          ]
        }
      },
      {
        field_name: '週の労働時間上限',
        type: 3, // 単一選択
        property: {
          options: [
            { name: '20時間' },
            { name: '30時間未満' }
          ]
        }
      },
      {
        field_name: 'LarkユーザーID',
        type: 1, // 単行テキスト
        property: {
          formatter: 1
        }
      }
    ]
  },
  {
    name: 'ShiftMaker_AdminSlots_v2',
    displayName: '管理者希望シフト枠テーブル',
    fields: [
      {
        field_name: '枠名',
        type: 1, // 単行テキスト（主キー）
        property: {
          formatter: 1
        }
      },
      {
        field_name: '対象日',
        type: 5, // 日付
        property: {}
      },
      {
        field_name: '開始時刻',
        type: 1, // 単行テキスト
        property: {
          formatter: 1
        }
      },
      {
        field_name: '終了時刻',
        type: 1, // 単行テキスト
        property: {
          formatter: 1
        }
      },
      {
        field_name: '必要人数',
        type: 2, // 数字
        property: {}
      },
      {
        field_name: '休憩時間(分)',
        type: 2, // 数字
        property: {}
      },
      {
        field_name: '備考',
        type: 3, // 複数行テキスト
        property: {}
      }
    ]
  },
  {
    name: 'ShiftMaker_StaffWishes_v2',
    displayName: 'スタッフ希望シフトテーブル',
    fields: [
      {
        field_name: '希望ID',
        type: 1, // 単行テキスト（主キー）
        property: {
          formatter: 1
        }
      },
      {
        field_name: '対象日',
        type: 5, // 日付
        property: {}
      },
      {
        field_name: '希望開始時刻',
        type: 1, // 単行テキスト
        property: {
          formatter: 1
        }
      },
      {
        field_name: '希望終了時刻',
        type: 1, // 単行テキスト
        property: {
          formatter: 1
        }
      },
      {
        field_name: '提出日時',
        type: 1, // 単行テキスト
        property: {
          formatter: 1
        }
      }
    ]
  },
  {
    name: 'ShiftMaker_FinalShifts_v2',
    displayName: '確定シフトテーブル',
    fields: [
      {
        field_name: '確定ID',
        type: 1, // 単行テキスト（主キー）
        property: {
          formatter: 1
        }
      },
      {
        field_name: '勤務日',
        type: 5, // 日付
        property: {}
      },
      {
        field_name: '開始時刻',
        type: 1, // 単行テキスト
        property: {
          formatter: 1
        }
      },
      {
        field_name: '終了時刻',
        type: 1, // 単行テキスト
        property: {
          formatter: 1
        }
      },
      {
        field_name: '備考',
        type: 3, // 複数行テキスト
        property: {}
      },
      {
        field_name: '作成日時',
        type: 1, // 単行テキスト
        property: {
          formatter: 1
        }
      }
    ]
  }
];

// テーブル作成関数
async function createTable(config) {
  try {
    console.log(`📋 ${config.displayName} を作成中...`);
    
    const response = await client.bitable.appTable.create({
      path: {
        app_token: LARK_BASE_TOKEN,
      },
      data: {
        table: {
          name: config.name,
          default_view_name: 'Grid',
          fields: config.fields
        }
      }
    });

    if (response.code === 0) {
      console.log(`✅ ${config.displayName} 作成成功`);
      console.log(`   テーブルID: ${response.data.table_id}`);
      return {
        name: config.name,
        table_id: response.data.table_id,
        success: true
      };
    } else {
      console.error(`❌ ${config.displayName} 作成失敗:`, response.msg);
      return {
        name: config.name,
        success: false,
        error: response.msg
      };
    }
  } catch (error) {
    console.error(`❌ ${config.displayName} 作成エラー:`, error.message);
    return {
      name: config.name,
      success: false,
      error: error.message
    };
  }
}

// 初期データ投入関数
async function insertInitialData(tableId, tableName, data) {
  try {
    console.log(`📊 ${tableName} にデータを投入中...`);
    
    for (const record of data) {
      const response = await client.bitable.appTableRecord.create({
        path: {
          app_token: LARK_BASE_TOKEN,
          table_id: tableId,
        },
        data: {
          fields: record
        }
      });

      if (response.code !== 0) {
        console.error(`❌ データ投入失敗:`, response.msg);
        return false;
      }
    }
    
    console.log(`✅ ${tableName} データ投入完了 (${data.length}件)`);
    return true;
  } catch (error) {
    console.error(`❌ ${tableName} データ投入エラー:`, error.message);
    return false;
  }
}

// 初期データ定義
const INITIAL_DATA = {
  ShiftMaker_Skills_v2: [
    { 'スキル名': 'カフェ業務', '説明': 'ドリンク作成、接客対応' },
    { 'スキル名': 'キッチン業務', '説明': 'フード調理、盛り付け' },
    { 'スキル名': 'レジ業務', '説明': '会計処理、POS操作' },
    { 'スキル名': 'マネジメント', '説明': '店舗運営、スタッフ管理' },
    { 'スキル名': '清掃業務', '説明': '店内清掃、設備メンテナンス' }
  ],
  ShiftMaker_Employees_v2: [
    {
      '氏名': '管理者太郎',
      'メールアドレス': 'admin@example.com',
      'パスワード': '$2b$10$xO1NcGfgiab9K/9HEAWlbe21g4ioWa1xVo2ITTO94ixRpPI53dTHe',
      '権限': '管理者',
      '週の労働時間上限': '30時間未満',
      'LarkユーザーID': ''
    },
    {
      '氏名': '従業員花子',
      'メールアドレス': 'employee@example.com',
      'パスワード': '$2b$10$vxjzjPnnO9JcQWLopG.fzea3tbF1SUMNMBSclbBBEyQsuH/Ha4jYe',
      '権限': '従業員',
      '週の労働時間上限': '20時間',
      'LarkユーザーID': ''
    },
    {
      '氏名': '佐藤次郎',
      'メールアドレス': 'sato@example.com',
      'パスワード': '$2b$10$vxjzjPnnO9JcQWLopG.fzea3tbF1SUMNMBSclbBBEyQsuH/Ha4jYe',
      '権限': '従業員',
      '週の労働時間上限': '30時間未満',
      'LarkユーザーID': ''
    },
    {
      '氏名': '田中美咲',
      'メールアドレス': 'tanaka@example.com',
      'パスワード': '$2b$10$vxjzjPnnO9JcQWLopG.fzea3tbF1SUMNMBSclbBBEyQsuH/Ha4jYe',
      '権限': '従業員',
      '週の労働時間上限': '20時間',
      'LarkユーザーID': ''
    },
    {
      '氏名': '山田健太',
      'メールアドレス': 'yamada@example.com',
      'パスワード': '$2b$10$vxjzjPnnO9JcQWLopG.fzea3tbF1SUMNMBSclbBBEyQsuH/Ha4jYe',
      '権限': '従業員',
      '週の労働時間上限': '30時間未満',
      'LarkユーザーID': ''
    }
  ]
};

// メイン実行関数
async function main() {
  console.log('🚀 Lark Base テーブル自動作成を開始します...\n');
  
  const results = [];
  
  // テーブルを順番に作成
  for (const config of TABLES_CONFIG) {
    const result = await createTable(config);
    results.push(result);
    
    // 成功した場合は初期データを投入
    if (result.success && INITIAL_DATA[config.name]) {
      await insertInitialData(result.table_id, config.displayName, INITIAL_DATA[config.name]);
    }
    
    // API制限を考慮して少し待機
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 作成結果サマリー:');
  console.log('==================');
  
  const successCount = results.filter(r => r.success).length;
  console.log(`✅ 成功: ${successCount}/${results.length} テーブル\n`);
  
  // .env.local用の設定を出力
  console.log('📝 .env.local に追加する設定:');
  console.log('================================');
  
  results.forEach(result => {
    if (result.success) {
      const envName = `LARK_${result.name.toUpperCase()}_TABLE_ID`;
      console.log(`${envName}=${result.table_id}`);
    }
  });
  
  if (successCount === results.length) {
    console.log('\n🎉 すべてのテーブル作成が完了しました！');
    console.log('次のステップ: .env.localファイルを更新してください');
  } else {
    console.log('\n⚠️  一部のテーブル作成に失敗しました');
    results.forEach(result => {
      if (!result.success) {
        console.log(`❌ ${result.name}: ${result.error}`);
      }
    });
  }
}

// 実行
if (require.main === module) {
  console.log('🚀 メイン関数を開始...');
  main().catch((error) => {
    console.error('❌ 実行エラー:', error);
    process.exit(1);
  });
}

module.exports = { main, createTable, insertInitialData };