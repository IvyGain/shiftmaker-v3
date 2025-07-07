# AI連携型 高機能シフト管理システム (SHIFTMAKER v3)

Next.jsベースのWebアプリケーションで、Lark Baseをバックエンドデータベースとして使用するシフト管理システムです。

## 🚀 機能

### V1.0 MVP (現在実装済み)
- ✅ **認証システム** - JWTベースのログイン機能
- ✅ **管理者機能** - シフト枠の作成・管理、手動シフト確定
- ✅ **従業員機能** - 希望シフト提出、確定シフト確認
- ✅ **カレンダー表示** - 月表示でのシフト状況確認
- ✅ **モバイル対応** - レスポンシブデザイン
- ✅ **モックデータ** - 開発・テスト用のダミーデータ機能

### 予定機能 (V1.5以降)
- 🔄 **AIによる自動シフト割り当て**
- 🔔 **Larkメッセージによる自動通知**
- 🤖 **AI Botによる自然言語でのシフト調整支援**

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15 with TypeScript
- **スタイリング**: Tailwind CSS
- **認証**: JWT (JSON Web Tokens)
- **バックエンド**: Next.js API Routes
- **データベース**: Lark Base (Bitable)
- **API連携**: Lark OpenAPI SDK (@larksuiteoapi/node-sdk)

## 📦 インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 本番ビルド
npm run build

# リント
npm run lint
```

## ⚙️ 環境設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```ini
# Lark API Authentication
LARK_APP_ID=your_lark_app_id
LARK_APP_SECRET=your_lark_app_secret

# Lark Base (Bitable) App
LARK_BASE_TOKEN=your_lark_base_token

# Table IDs (Lark Baseでテーブル作成後に更新)
LARK_EMPLOYEES_TABLE_ID=your_employees_table_id
LARK_SKILLS_TABLE_ID=your_skills_table_id
LARK_ADMIN_SLOTS_TABLE_ID=your_admin_slots_table_id
LARK_WISHES_TABLE_ID=your_wishes_table_id
LARK_FINAL_SHIFTS_TABLE_ID=your_final_shifts_table_id

# JWT Authentication
JWT_SECRET=your_jwt_secret_key

# Development
NODE_ENV=development
```

## 🧪 テストアカウント

モックデータモードでは以下のアカウントでログインできます：

### 管理者アカウント
- **Email**: admin@example.com
- **Password**: admin123

### 従業員アカウント
- **Email**: employee@example.com
- **Password**: employee123

## 🚦 使用方法

### 1. 管理者の操作
1. 管理者アカウントでログイン
2. カレンダーで日付を選択
3. シフト枠を作成（日付、時間、必要人数等を入力）
4. 従業員からの希望を確認
5. 希望者をシフトに確定

### 2. 従業員の操作
1. 従業員アカウントでログイン
2. 日付を選択
3. 利用可能なシフト枠を確認
4. 希望するシフトに応募
5. 確定シフトを確認

---

**開発状況**: V1.0 MVP 完成 🎉  
**次のマイルストーン**: Lark Base連携とAI機能実装
