# SHIFTMAKER v3 プロジェクト管理

## プロジェクト概要
AI連携型シフト管理システムの開発プロジェクト

## 開発ロードマップ

### V1.0 MVP（現在のフェーズ）
- [x] 基本認証機能
- [x] 管理者シフト枠作成機能
- [x] 従業員希望シフト提出機能
- [x] シフト確定機能
- [x] カレンダー表示機能
- [ ] Lark Base連携
- [ ] スマホファーストUI

### V1.5 AI連携
- [ ] AI自動最適化エンジン
- [ ] 希望マッチング機能
- [ ] シフト提案機能

### V2.0 完全自動化
- [ ] 完全自動シフト作成
- [ ] スマート通知システム
- [ ] アナリティクス機能

## 技術スタック
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Lark Base (Bitable)
- **Authentication**: JWT
- **API**: Next.js API Routes
- **Deployment**: Vercel

## 開発ワークフロー

### ブランチ戦略
- `main`: 本番環境（リリース版）
- `develop`: 開発環境（統合テスト）
- `feature/*`: 機能開発ブランチ
- `bugfix/*`: バグ修正ブランチ

### Issue管理
1. **機能追加**: `enhancement` ラベル
2. **バグ修正**: `bug` ラベル
3. **タスク**: `task` ラベル
4. **優先度**: `priority: high/medium/low`

### コミット規約
```
type: subject

body (optional)

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

**Type**:
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント更新
- `style`: スタイル修正
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `chore`: ビルド・設定変更

## 現在のタスク状況

### 進行中
- [ ] Lark Base連携設定
- [ ] 週次固定シフトテンプレート機能

### 今後の予定
- [ ] スマホファーストUI実装
- [ ] スタッフ向けシンプル入力機能

## 環境変数
```bash
# Lark API Authentication
LARK_APP_ID=cli_実際のAppID
LARK_APP_SECRET=実際のAppSecret
LARK_BASE_TOKEN=basc実際のBaseToken

# Table IDs
LARK_EMPLOYEES_TABLE_ID=tbl_***
LARK_SKILLS_TABLE_ID=tbl_***
LARK_ADMIN_SLOTS_TABLE_ID=tbl_***
LARK_WISHES_TABLE_ID=tbl_***
LARK_FINAL_SHIFTS_TABLE_ID=tbl_***

# JWT Authentication
JWT_SECRET=supersecretjwtkeyforprojectshiftmaker2024

# Development
NODE_ENV=development
```

## コントリビューション
1. Issueを作成して作業内容を明確化
2. feature ブランチを作成
3. 実装・テスト
4. Pull Request作成
5. コードレビュー・マージ