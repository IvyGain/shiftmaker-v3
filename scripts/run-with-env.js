// 環境変数を読み込んでスクリプトを実行するヘルパー
require('dotenv').config({ path: '.env.local' });

console.log('🔧 環境変数読み込み完了');

// テーブル作成スクリプトを実行
const { main } = require('./create-lark-tables.js');

console.log('🚀 テーブル作成開始...');
main().catch((error) => {
  console.error('❌ 実行エラー:', error);
  process.exit(1);
});