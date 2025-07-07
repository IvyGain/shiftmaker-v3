# SHIFTMAKER v3 🚀

AI連携型シフト管理システム

[![CI](https://github.com/IvyGain/shiftmaker-v3/actions/workflows/ci.yml/badge.svg)](https://github.com/IvyGain/shiftmaker-v3/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 プロジェクト概要

SHIFTMAKER v3は、AI技術を活用した次世代シフト管理システムです。管理者の負担を軽減し、従業員の満足度を向上させる革新的なソリューションを提供します。

## 🗺️ 開発ロードマップ

### 📋 [V1.0 MVP](https://github.com/IvyGain/shiftmaker-v3/milestone/1) - 基本機能 
*目標: 2025年7月31日*

- [x] 認証システム (JWT + Lark Base)
- [x] 管理者シフト枠作成機能
- [x] 従業員希望シフト提出機能  
- [x] シフト確定機能
- [x] カレンダー表示機能
- [ ] [Lark Base連携](https://github.com/IvyGain/shiftmaker-v3/issues/1) 🔥
- [ ] [スマホファーストUI](https://github.com/IvyGain/shiftmaker-v3/issues/5)

### 🤖 [V1.5 AI連携](https://github.com/IvyGain/shiftmaker-v3/milestone/2) - AI最適化
*目標: 2025年8月31日*

- [ ] [AI自動最適化エンジン](https://github.com/IvyGain/shiftmaker-v3/issues/7)
- [ ] [希望マッチング機能](https://github.com/IvyGain/shiftmaker-v3/issues/8)
- [ ] [シフト提案機能](https://github.com/IvyGain/shiftmaker-v3/issues/9)

### 🚀 V2.0 完全自動化 - 未来のシフト管理
*目標: 2025年9月30日*

- [ ] 完全自動シフト作成
- [ ] スマート通知システム
- [ ] アナリティクス・レポート機能

## 🛠️ 技術スタック

```
Frontend: Next.js 15 + TypeScript + Tailwind CSS
Backend:  Lark Base (Bitable) 
Auth:     JWT
API:      Next.js API Routes
Deploy:   Vercel
```

## 🚀 クイックスタート

```bash
# リポジトリクローン
git clone https://github.com/IvyGain/shiftmaker-v3.git
cd shiftmaker-v3

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local
# .env.local を編集して Lark Base 認証情報を設定

# 開発サーバー起動
npm run dev
```

## 📊 現在の進捗状況

### 🔥 高優先度タスク
1. [Lark Base テーブル作成とデータ投入](https://github.com/IvyGain/shiftmaker-v3/issues/1)
2. [.env.local ファイルの更新](https://github.com/IvyGain/shiftmaker-v3/issues/2)  
3. [モックAPIから実際のAPIへの切り替え](https://github.com/IvyGain/shiftmaker-v3/issues/3)

### 📈 今後の予定
- [週次固定シフトテンプレート機能](https://github.com/IvyGain/shiftmaker-v3/issues/4)
- [スマホファーストUI実装](https://github.com/IvyGain/shiftmaker-v3/issues/5)
- [スタッフ向けシンプル入力機能](https://github.com/IvyGain/shiftmaker-v3/issues/6)

## 🧪 テストアカウント

```
管理者: admin@example.com / admin123
従業員: employee@example.com / employee123
```

## 📚 ドキュメント

- [プロジェクト管理](./PROJECT.md)
- [Lark Base セットアップガイド](./docs/lark-base-setup.md)
- [API仕様書](./docs/api.md) (coming soon)

## 🤝 コントリビューション

1. [Issues](https://github.com/IvyGain/shiftmaker-v3/issues) でタスクを確認
2. Feature ブランチを作成
3. 実装・テスト  
4. [Pull Request](https://github.com/IvyGain/shiftmaker-v3/pulls) 作成

## 📜 ライセンス

MIT License - 詳細は [LICENSE](./LICENSE) を参照

---

**🎯 次のマイルストーン**: [V1.0 MVP完成](https://github.com/IvyGain/shiftmaker-v3/milestone/1) まで残り24日