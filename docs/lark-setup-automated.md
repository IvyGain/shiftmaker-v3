# Lark Base 自動セットアップガイド

## 🚀 自動テーブル作成スクリプト

手動でのテーブル作成に加えて、自動化スクリプトを提供しています。

### 事前準備

1. **Lark開発者コンソールでアプリ作成**
   - [Lark開発者コンソール](https://open.larksuite.com/app)にアクセス
   - 「アプリを作成」をクリック
   - アプリ名: `ShiftMaker v3`
   - アプリタイプ: `Bitable（多次元表格）`

2. **API権限の設定**
   ```
   ✅ bitable:app
   ✅ bitable:app:readonly
   ✅ bitable:app:readwrite
   ```

3. **認証情報の取得**
   - App ID: `cli_xxxxxxxxx`
   - App Secret: `xxxxxxxxx`
   - Base Token: Bitableアプリから取得

### 🛠️ 自動セットアップ手順

#### ステップ1: 環境変数設定

```bash
# .env.example をコピー
cp .env.example .env.local

# .env.local を編集
nano .env.local
```

必要な環境変数:
```bash
LARK_APP_ID=cli_your_app_id_here
LARK_APP_SECRET=your_app_secret_here
LARK_BASE_TOKEN=basc_your_base_token_here
```

#### ステップ2: 自動テーブル作成実行

```bash
# テーブル自動作成スクリプト実行
node scripts/create-lark-tables.js
```

#### ステップ3: テーブルID設定

スクリプト実行後に出力されるテーブルIDを `.env.local` に追加:

```bash
LARK_SKILLS_TABLE_ID=tbl_xxxxxxxxx
LARK_EMPLOYEES_TABLE_ID=tbl_xxxxxxxxx
LARK_ADMINSLOTS_TABLE_ID=tbl_xxxxxxxxx
LARK_STAFFWISHES_TABLE_ID=tbl_xxxxxxxxx
LARK_FINALSHIFTS_TABLE_ID=tbl_xxxxxxxxx
```

## 📊 作成されるテーブル

### 1. スキルテーブル (Skills)
- スキル名 (単行テキスト)
- 説明 (複数行テキスト)
- **初期データ**: 5つのスキル (カフェ業務、キッチン業務、レジ業務、マネジメント、清掃業務)

### 2. 従業員テーブル (Employees)
- 従業員ID (自動採番)
- 氏名 (単行テキスト)
- メールアドレス (単行テキスト)
- パスワード (単行テキスト) - bcryptハッシュ化済み
- 権限 (単一選択: 管理者, 従業員)
- 週の労働時間上限 (単一選択: 20時間, 30時間未満)
- LarkユーザーID (単行テキスト)
- **初期データ**: 5名の従業員 (管理者1名、従業員4名)

### 3. 管理者希望シフト枠テーブル (AdminSlots)
- 枠ID (自動採番)
- 対象日 (日付)
- 開始時刻 (単行テキスト)
- 終了時刻 (単行テキスト)
- 必要人数 (数字)
- 休憩時間(分) (数字)
- 備考 (複数行テキスト)

### 4. スタッフ希望シフトテーブル (StaffWishes)
- 希望ID (自動採番)
- 対象日 (日付)
- 希望開始時刻 (単行テキスト)
- 希望終了時刻 (単行テキスト)
- 提出日時 (作成時間)

### 5. 確定シフトテーブル (FinalShifts)
- 確定ID (自動採番)
- 勤務日 (日付)
- 開始時刻 (単行テキスト)
- 終了時刻 (単行テキスト)
- 備考 (複数行テキスト)
- 作成日時 (作成時間)

## 🔗 次のステップ

1. **リンクフィールドの設定**
   - 従業員テーブルの「所持スキル」→ スキルテーブル
   - 管理者希望シフト枠テーブルの「必要スキル」→ スキルテーブル
   - スタッフ希望シフトテーブルの「希望従業員」→ 従業員テーブル
   - 確定シフトテーブルの「担当従業員」→ 従業員テーブル
   - 確定シフトテーブルの「元になった枠」→ 管理者希望シフト枠テーブル

2. **アプリケーション起動**
   ```bash
   npm run dev
   ```

3. **動作確認**
   - 管理者ログイン: admin@example.com / admin123
   - 従業員ログイン: employee@example.com / employee123

## ⚠️ 注意事項

- リンクフィールドは手動で設定する必要があります
- API制限により、大量データの投入時は時間がかかる場合があります
- エラーが発生した場合は、手動でのテーブル作成を検討してください

## 🆘 トラブルシューティング

### 認証エラー
```
❌ エラー: Invalid app_token
```
→ LARK_BASE_TOKENが正しく設定されているか確認

### 権限エラー
```
❌ エラー: Permission denied
```
→ アプリの権限設定を確認 (bitable:app:readwrite が必要)

### テーブル作成失敗
```
❌ エラー: Table creation failed
```
→ 手動でのテーブル作成に切り替え、またはLark Baseのログを確認