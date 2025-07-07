# Lark Base セットアップガイド

## 1. Lark Base アプリの作成

### 1.1 開発者コンソールでのアプリ作成
1. [Lark開発者コンソール](https://open.larksuite.com/app)にアクセス
2. 「アプリを作成」をクリック
3. 以下の情報を入力：
   - **アプリ名**: ShiftMaker v3
   - **アプリタイプ**: Bitable（多次元表格）
   - **説明**: AI連携型シフト管理システム

### 1.2 API権限の設定
以下の権限を有効化：
- `bitable:app`
- `bitable:app:readonly`
- `bitable:app:readwrite`

### 1.3 認証情報の取得
- **App ID**: `cli_xxxxxxxxx`
- **App Secret**: `xxxxxxxxx`

## 2. Bitable（多次元表格）の作成

### 2.1 新しいBitableアプリを作成
1. Larkアプリ内で「Bitable」を選択
2. 新しい多次元表格を作成
3. 名前: `ShiftMaker Database`

### 2.2 ベースURLとトークンの取得
- **Base Token**: Bitableアプリのメニューから「共有」→「高級」→「Open API Token」を確認

## 3. テーブル構造の作成

以下の5つのテーブルを**この順序で**作成してください：

### 3.1 スキルテーブル (Skills)
最初にスキルテーブルを作成（他のテーブルから参照されるため）

| フィールド名 | フィールドタイプ | 設定 |
|------------|-----------------|------|
| スキル名 | 単行テキスト | 主キー |
| 説明 | 複数行テキスト | - |

**初期データ**:
```
スキル名: カフェ業務, 説明: ドリンク作成、接客対応
スキル名: キッチン業務, 説明: フード調理、盛り付け
スキル名: レジ業務, 説明: 会計処理、POS操作  
スキル名: マネジメント, 説明: 店舗運営、スタッフ管理
スキル名: 清掃業務, 説明: 店内清掃、設備メンテナンス
```

### 3.2 従業員テーブル (Employees)

| フィールド名 | フィールドタイプ | 設定 |
|------------|-----------------|------|
| 従業員ID | 自動採番 | 主キー |
| 氏名 | 単行テキスト | 必須 |
| メールアドレス | 単行テキスト | 必須、一意 |
| パスワード | 単行テキスト | 必須 |
| 権限 | 単一選択 | 選択肢: 管理者, 従業員 |
| 所持スキル | 多重選択（リンク） | リンク先: スキルテーブル |
| 週の労働時間上限 | 単一選択 | 選択肢: 20時間, 30時間未満 |
| LarkユーザーID | 単行テキスト | - |

**初期データ**:
```
氏名: 管理者太郎
メールアドレス: admin@example.com
パスワード: $2b$10$xO1NcGfgiab9K/9HEAWlbe21g4ioWa1xVo2ITTO94ixRpPI53dTHe
権限: 管理者
所持スキル: カフェ業務, マネジメント
週の労働時間上限: 30時間未満
LarkユーザーID: (空白)

氏名: 従業員花子
メールアドレス: employee@example.com
パスワード: $2b$10$vxjzjPnnO9JcQWLopG.fzea3tbF1SUMNMBSclbBBEyQsuH/Ha4jYe
権限: 従業員
所持スキル: カフェ業務
週の労働時間上限: 20時間
LarkユーザーID: (空白)

氏名: 佐藤次郎
メールアドレス: sato@example.com
パスワード: $2b$10$vxjzjPnnO9JcQWLopG.fzea3tbF1SUMNMBSclbBBEyQsuH/Ha4jYe
権限: 従業員
所持スキル: カフェ業務, キッチン業務
週の労働時間上限: 30時間未満
LarkユーザーID: (空白)

氏名: 田中美咲
メールアドレス: tanaka@example.com
パスワード: $2b$10$vxjzjPnnO9JcQWLopG.fzea3tbF1SUMNMBSclbBBEyQsuH/Ha4jYe
権限: 従業員
所持スキル: カフェ業務, レジ業務
週の労働時間上限: 20時間
LarkユーザーID: (空白)

氏名: 山田健太
メールアドレス: yamada@example.com
パスワード: $2b$10$vxjzjPnnO9JcQWLopG.fzea3tbF1SUMNMBSclbBBEyQsuH/Ha4jYe
権限: 従業員
所持スキル: キッチン業務, 清掃業務
週の労働時間上限: 30時間未満
LarkユーザーID: (空白)
```

### 3.3 管理者希望シフト枠テーブル (Admin Shift Slots)

| フィールド名 | フィールドタイプ | 設定 |
|------------|-----------------|------|
| 枠ID | 自動採番 | 主キー |
| 対象日 | 日付 | 必須 |
| 開始時刻 | 単行テキスト | 必須、形式: HH:MM |
| 終了時刻 | 単行テキスト | 必須、形式: HH:MM |
| 必要人数 | 数字 | 必須、最小値: 1 |
| 必要スキル | 多重選択（リンク） | リンク先: スキルテーブル |
| 休憩時間(分) | 数字 | デフォルト: 30 |
| 備考 | 複数行テキスト | - |

**初期データ** (今日から1週間分):
```
対象日: [今日+1], 開始時刻: 09:00, 終了時刻: 13:00, 必要人数: 2, 必要スキル: カフェ業務, 休憩時間(分): 30, 備考: 朝のピークタイム対応
対象日: [今日+1], 開始時刻: 13:00, 終了時刻: 17:00, 必要人数: 3, 必要スキル: カフェ業務,キッチン業務, 休憩時間(分): 45, 備考: ランチタイム対応
対象日: [今日+2], 開始時刻: 10:00, 終了時刻: 15:00, 必要人数: 2, 必要スキル: カフェ業務,レジ業務, 休憩時間(分): 60, 備考: 平日昼間シフト
対象日: [今日+3], 開始時刻: 17:00, 終了時刻: 21:00, 必要人数: 2, 必要スキル: カフェ業務, 休憩時間(分): 30, 備考: 夕方〜夜シフト
対象日: [今日+5], 開始時刻: 08:00, 終了時刻: 12:00, 必要人数: 3, 必要スキル: カフェ業務,キッチン業務, 休憩時間(分): 30, 備考: 土曜日朝シフト
対象日: [今日+6], 開始時刻: 14:00, 終了時刻: 18:00, 必要人数: 4, 必要スキル: カフェ業務,キッチン業務,レジ業務, 休憩時間(分): 45, 備考: 日曜日午後シフト
```

### 3.4 スタッフ希望シフトテーブル (Staff Shift Wishes)

| フィールド名 | フィールドタイプ | 設定 |
|------------|-----------------|------|
| 希望ID | 自動採番 | 主キー |
| 希望従業員 | 单一选择（リンク） | リンク先: 従業員テーブル、必須 |
| 対象日 | 日付 | 必須 |
| 希望開始時刻 | 単行テキスト | 必須、形式: HH:MM |
| 希望終了時刻 | 単行テキスト | 必須、形式: HH:MM |
| 提出日時 | 作成時間 | 自動設定 |

**初期データ**:
```
希望従業員: 従業員花子, 対象日: [今日+1], 希望開始時刻: 09:00, 希望終了時刻: 13:00
希望従業員: 佐藤次郎, 対象日: [今日+1], 希望開始時刻: 13:00, 希望終了時刻: 17:00
希望従業員: 田中美咲, 対象日: [今日+2], 希望開始時刻: 10:00, 希望終了時刻: 15:00
希望従業員: 従業員花子, 対象日: [今日+3], 希望開始時刻: 17:00, 希望終了時刻: 21:00
希望従業員: 山田健太, 対象日: [今日+5], 希望開始時刻: 08:00, 希望終了時刻: 12:00
希望従業員: 佐藤次郎, 対象日: [今日+6], 希望開始時刻: 14:00, 希望終了時刻: 18:00
```

### 3.5 確定シフトテーブル (Final Shifts)

| フィールド名 | フィールドタイプ | 設定 |
|------------|-----------------|------|
| 確定ID | 自動採番 | 主キー |
| 勤務日 | 日付 | 必須 |
| 開始時刻 | 単行テキスト | 必須、形式: HH:MM |
| 終了時刻 | 単行テキスト | 必須、形式: HH:MM |
| 担当従業員 | 单一选择（リンク） | リンク先: 従業員テーブル、必須 |
| 元になった枠 | 单一选择（リンク） | リンク先: 管理者希望シフト枠テーブル |
| 備考 | 複数行テキスト | - |
| 作成日時 | 作成時間 | 自動設定 |

**初期データ** (確定済みシフトのサンプル):
```
勤務日: [今日+1], 開始時刻: 09:00, 終了時刻: 13:00, 担当従業員: 従業員花子, 元になった枠: [対応する枠ID], 備考: 朝のピークタイム対応
勤務日: [今日+2], 開始時刻: 10:00, 終了時刻: 15:00, 担当従業員: 田中美咲, 元になった枠: [対応する枠ID], 備考: 平日昼間シフト
```

## 4. テーブルIDの取得

各テーブル作成後、以下の手順でテーブルIDを取得：

1. テーブル右上の「…」メニューをクリック
2. 「リンクをコピー」を選択
3. URLから `tbl_xxxxxxxxx` の部分を抽出

例: `https://example.larksuite.com/base/bascxxxxxxx?table=tbl_xxxxxxx&view=vewxxxxxxx`

## 5. 環境変数の更新

`.env.local` ファイルを以下の実際の値で更新：

```ini
# Lark API Authentication
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
NODE_ENV=development
```

## 6. API切り替え

環境変数更新後、以下のファイルでモックAPIから実際のAPIに切り替え：

### ログイン画面の切り替え
`src/app/login/page.tsx`:
```typescript
// const apiEndpoint = '/api/auth/login-mock'; // モック版
const apiEndpoint = '/api/auth/login'; // 実際のAPI
```

### 管理者画面の切り替え  
`src/app/admin/page.tsx`:
```typescript
// const slotsResponse = await fetch('/api/admin/slots-mock', { headers }); // モック版
const slotsResponse = await fetch('/api/admin/slots', { headers }); // 実際のAPI
```

### 従業員画面の切り替え
`src/app/employee/page.tsx`:
```typescript  
// const calendarResponse = await fetch('/api/calendar/view-mock?...', { headers }); // モック版
const calendarResponse = await fetch('/api/calendar/view?...', { headers }); // 実際のAPI
```

## 7. テスト用ログインアカウント

実際のLark Base連携後も同じアカウントでログイン可能：

- **管理者**: admin@example.com / admin123
- **従業員**: employee@example.com / employee123  
- **佐藤**: sato@example.com / sato123
- **田中**: tanaka@example.com / tanaka123
- **山田**: yamada@example.com / yamada123

## 8. 動作確認

1. アプリケーションを再起動: `npm run dev`
2. 管理者アカウントでログイン
3. シフト枠作成・確定機能をテスト
4. 従業員アカウントで希望シフト提出をテスト

---

**注意**: 
- テーブル作成時は必ず指定した順序で作成してください（リンク関係があるため）
- 日付データは `[今日+1]` のような記載を実際の日付に置き換えてください
- パスワードはbcryptでハッシュ化済みの値をそのまま使用してください