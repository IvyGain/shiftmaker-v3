# Lark Base 連携トラブルシューティングガイド

## 🎯 概要

Lark Base連携で発生しやすい問題と解決方法をまとめたナレッジベースです。
実際の開発で成功した修正パターンに基づいています。

## ✅ 成功した修正パターン

### 1. 日付形式の統一

**問題**: LarkBaseとアプリ間の日付形式不一致
```javascript
// ❌ 問題のあるコード - ISO文字列形式
const slotData = {
  date: '2025-07-07', // ISO文字列
  // ...
}
```

**解決**: Unix timestampに統一
```javascript
// ✅ 修正後 - Unix timestamp形式
const slotData = {
  date: currentDate.getTime(), // 1735603200000 のような Unix timestamp
  // ...
}
```

**理由**: LarkBaseは内部的にUnix timestampで日付を管理するため。

### 2. フィールド名の不一致

**問題**: 存在しないフィールド名を送信
```javascript
// ❌ 問題のあるコード
const larkShiftSlotData = {
  slot_id: shiftSlotData.id,
  date: shiftSlotData.date,
  day_of_week: shiftSlotData.dayOfWeek,
  status: 'active' // ← 存在しないフィールド
}
```

**解決**: 実際のLarkBaseフィールド名に合わせる
```javascript
// ✅ 修正後
const larkShiftSlotData = {
  slot_id: shiftSlotData.id,
  date: shiftSlotData.date,
  day_of_week: shiftSlotData.dayOfWeek,
  // status フィールドは削除
}
```

**確認方法**:
1. Lark Baseの実際のテーブル構造を確認
2. APIレスポンスのフィールド名をチェック
3. 存在しないフィールドは送信しない

### 3. 数値型の扱い

**問題**: 数値フィールドに文字列を送信
```javascript
// ❌ 問題のあるコード
required_staff_count: setting.requiredStaffCount, // 文字列の可能性
break_time: setting.breakTime, // 文字列の可能性
```

**解決**: 明示的に数値に変換
```javascript
// ✅ 修正後
required_staff_count: Number(setting.requiredStaffCount),
break_time: Number(setting.breakTime),
```

**注意点**:
- `parseInt()` vs `Number()`: 小数点が含まれる場合は`Number()`を使用
- `NaN`チェックを行う: `isNaN(Number(value))`

### 4. 基本シフトと通常シフトの分離

**問題**: 全てのシフトを同じように扱っていた
```javascript
// ❌ 問題のあるコード
const shiftData = {
  // すべて同じ構造で処理
}
```

**解決**: `is_basic_shift` フラグで区別
```javascript
// ✅ 修正後
// 基本シフト設定
const basicShiftData = {
  is_basic_shift: true,
  // ...
}

// 通常のシフト枠
const normalShiftData = {
  is_basic_shift: false,
  // ...
}
```

## 🚨 よくあるエラーと対処法

### エラー: "Field not found"
```
Error: Field 'status' not found in table
```

**原因**: 存在しないフィールド名を使用

**対処法**:
1. Lark Baseのテーブル構造を確認
2. 正確なフィールド名を使用
3. オプショナルフィールドは条件付きで送信

### エラー: "Invalid field type"
```
Error: Invalid field type for 'required_staff_count'
```

**原因**: データ型の不一致

**対処法**:
```javascript
// 型チェックと変換
const validateAndConvert = (value, type) => {
  switch (type) {
    case 'number':
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    case 'string':
      return String(value);
    case 'boolean':
      return Boolean(value);
    default:
      return value;
  }
};
```

### エラー: "Date format invalid"
```
Error: Date format '2025-07-07' is not supported
```

**原因**: 日付形式の不一致

**対処法**:
```javascript
// ISO文字列をUnix timestampに変換
const convertToTimestamp = (dateString) => {
  return new Date(dateString).getTime();
};
```

## 📋 チェックリスト

### API送信前のチェック
- [ ] フィールド名が実際のLark Baseテーブルと一致している
- [ ] 数値フィールドが正しく数値型になっている
- [ ] 日付がUnix timestamp形式になっている
- [ ] 存在しないフィールドを送信していない
- [ ] 必須フィールドが全て含まれている

### デバッグ手順
1. **ネットワークタブでAPI送信データを確認**
2. **Lark Baseの実際のテーブル構造と比較**
3. **エラーレスポンスの詳細を確認**
4. **段階的にフィールドを削除してテスト**

## 🛠️ 実装例

### 完全なデータ変換関数
```javascript
// Lark Base用データ変換関数
const convertToLarkBaseFormat = (appData) => {
  return {
    // 日付フィールドの変換
    date: appData.date ? new Date(appData.date).getTime() : null,
    
    // 数値フィールドの変換
    required_staff_count: Number(appData.requiredStaffCount) || 1,
    break_time: Number(appData.breakTime) || 0,
    
    // 文字列フィールド（そのまま）
    notes: String(appData.notes || ''),
    
    // ブールフィールドの変換
    is_basic_shift: Boolean(appData.isBasicShift),
    
    // 存在確認後の条件付きフィールド
    ...(appData.optionalField && { optional_field: appData.optionalField })
  };
};
```

### エラーハンドリング
```javascript
const safeLarkBaseRequest = async (data) => {
  try {
    // データ変換
    const larkData = convertToLarkBaseFormat(data);
    
    // API送信
    const response = await fetch('/api/lark-base', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(larkData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Lark Base Error:', errorData);
      throw new Error(`API Error: ${errorData.message}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};
```

## 📚 参考資料

- [Lark Base API Documentation](https://open.larksuite.com/document/server-docs/docs/bitable-v1/overview)
- [JavaScript Date オブジェクト](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [TypeScript 型チェック](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

## 🔄 更新履歴

- **2025-07-07**: 初版作成
  - 基本的なトラブルシューティングパターンを追加
  - 実際の開発で発生した問題と解決策を整理